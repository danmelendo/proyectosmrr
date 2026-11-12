// Conversión de Google Ads "Contacto" (AW-17273217970).
// El comando `config` de la etiqueta de Google está en el <head> de index.html;
// aquí solo disparamos el evento de conversión.
export const ADS_CONVERSION_SEND_TO = "AW-17273217970/8a86CLHN9MEcELLHwaxA";

interface TrackAdsConversionOptions {
  /** Se ejecuta cuando Google confirma el envío (event_callback) o al vencer el tiempo de espera. */
  onComplete?: () => void;
  /** Tiempo máximo (ms) de espera al event_callback antes de continuar. */
  timeoutMs?: number;
}

/**
 * Dispara el evento de conversión de Google Ads (equivalente a
 * `gtag_report_conversion` del snippet oficial de Google).
 *
 * Si se pasa `onComplete`, usa el patrón oficial de "conversión con redirección":
 * espera al `event_callback` de gtag (con un tiempo máximo de seguridad) para no
 * perder la conversión si la navegación ocurre inmediatamente después.
 */
export const trackAdsConversion = ({
  onComplete,
  timeoutMs = 1500,
}: TrackAdsConversionOptions = {}): void => {
  if (typeof window.gtag !== "function") {
    onComplete?.();
    return;
  }

  let completed = false;
  const finish = () => {
    if (completed) return;
    completed = true;
    onComplete?.();
  };

  window.gtag("event", "conversion", {
    send_to: ADS_CONVERSION_SEND_TO,
    value: 1.0,
    currency: "EUR",
    ...(onComplete ? { event_callback: finish } : {}),
  });

  // Red de seguridad: continúa aunque el event_callback no llegue a dispararse.
  if (onComplete) {
    window.setTimeout(finish, timeoutMs);
  }
};
