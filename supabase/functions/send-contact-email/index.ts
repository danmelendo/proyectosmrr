/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Rate limit configuration
const RATE_LIMIT_MAX_REQUESTS = 5; // Maximum requests per IP
const RATE_LIMIT_WINDOW_HOURS = 1; // Time window in hours

// Allowed origins for CORS - restrict to production domains and local development
const ALLOWED_ORIGINS = [
  'https://proyectosmrr.es',
  'https://www.proyectosmrr.es',
  'http://localhost:5173',
  'http://localhost:8080',
];

// Get CORS headers with origin validation
function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Server-side validation schema with strict limits
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message must be less than 5000 characters"),
  honeypot: z.string().max(0, "Bot detected").optional(), // Honeypot must be empty
});

// HTML encode function to prevent HTML injection in email content
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

// Check rate limit for IP address
// deno-lint-ignore no-explicit-any
async function checkRateLimit(supabase: any, ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date();
  windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS);

  // Count recent submissions from this IP
  const { count, error } = await supabase
    .from("contact_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("submitted_at", windowStart.toISOString());

  if (error) {
    console.error("Rate limit check error:", error);
    // If there's an error, allow the request but log it
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }

  const currentCount = count || 0;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentCount);
  
  return {
    allowed: currentCount < RATE_LIMIT_MAX_REQUESTS,
    remaining,
  };
}

// Record a submission for rate limiting
// deno-lint-ignore no-explicit-any
async function recordSubmission(supabase: any, ip: string): Promise<void> {
  const { error } = await supabase
    .from("contact_rate_limits")
    .insert([{ ip_address: ip }]);

  if (error) {
    console.error("Failed to record rate limit entry:", error);
  }

  // Periodically clean up old entries (1 in 10 chance to avoid doing it every request)
  if (Math.random() < 0.1) {
    try {
      await supabase.rpc("cleanup_old_rate_limits");
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Get CORS headers for this request
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     req.headers.get("x-real-ip") ||
                     "unknown";

    console.log("Contact form submission from IP:", clientIP);

    // Initialize Supabase client with service role
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check rate limit
    const { allowed, remaining } = await checkRateLimit(supabase, clientIP);
    
    if (!allowed) {
      console.log("Rate limit exceeded for IP:", clientIP);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again later.",
          retryAfter: RATE_LIMIT_WINDOW_HOURS * 3600 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": String(RATE_LIMIT_WINDOW_HOURS * 3600),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
            ...corsHeaders 
          },
        }
      );
    }

    // Parse and validate request body
    const rawBody = await req.json();
    
    // Server-side validation
    const validationResult = contactSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: validationResult.error.errors.map((e: z.ZodIssue) => e.message) 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, subject, message, honeypot } = validationResult.data;

    // Honeypot check - if filled, it's a bot
    if (honeypot && honeypot.length > 0) {
      console.log("Honeypot triggered - bot detected from IP:", clientIP);
      // Return success to avoid revealing bot detection
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Record this submission for rate limiting
    await recordSubmission(supabase, clientIP);

    // Escape HTML in all user inputs to prevent HTML injection
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : "";
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    console.log("Processing contact form from:", safeName, safeEmail, "IP:", clientIP, "Remaining:", remaining - 1);

    // Save to database using service role (bypasses RLS)
    const { error: dbError } = await supabase.from("clients").insert([{
      name: name,
      email: email,
      phone: phone || null,
      subject: subject,
      message: message,
    }]);

    if (dbError) {
      console.error("Error saving client to database:", dbError);
      // Continue with email even if DB fails
    } else {
      console.log("Client saved to database successfully");
    }

    // Read destination email from site_settings (fallback to default)
    let destinationEmail = "info@proyectosmrr.es";
    try {
      const { data: settingData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "contact_email")
        .maybeSingle();
      if (settingData?.value) {
        destinationEmail = settingData.value;
      }
    } catch (settingsErr) {
      console.error("Could not read contact_email setting, using default:", settingsErr);
    }

    // Send email notification
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Proyectos MRR <noreply@mail.proyectosmrr.es>",
        to: [destinationEmail],
        subject: `Nuevo mensaje de contacto: ${safeSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d5a4a;">Nuevo mensaje de contacto</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
              <p><strong>Nombre:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              ${safePhone ? `<p><strong>Teléfono:</strong> ${safePhone}</p>` : ""}
              <p><strong>Asunto:</strong> ${safeSubject}</p>
              <p><strong>Mensaje:</strong></p>
              <p style="white-space: pre-wrap;">${safeMessage}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Este mensaje fue enviado desde el formulario de contacto de proyectosmrr.es
            </p>
          </div>
        `,
        reply_to: email, // Use original email for reply-to functionality
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      // Return generic error to client, log detailed error server-side
      return new Response(
        JSON.stringify({ error: "Failed to send email. Please try again later." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": String(remaining - 1),
        ...corsHeaders 
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending contact email:", errorMessage);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
