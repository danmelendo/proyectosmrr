import { useState } from "react";
import { Calculator, Home, Bath, ChefHat, Sun, Waves, Thermometer, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReformType = "integral" | "bano" | "cocina" | "placas-solares" | "piscina" | "aislamiento";

interface ReformOption {
  id: ReformType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  basePrice: number; // precio base por m²
  description: string;
}

interface ZoneMultiplier {
  zone: string;
  multiplier: number;
}

const reformOptions: ReformOption[] = [
  { id: "integral", label: "Reforma Integral", icon: Home, basePrice: 650, description: "Renovación completa de la vivienda" },
  { id: "bano", label: "Reforma de Baño", icon: Bath, basePrice: 4500, description: "Precio por baño completo" },
  { id: "cocina", label: "Reforma de Cocina", icon: ChefHat, basePrice: 8000, description: "Precio por cocina completa" },
  { id: "placas-solares", label: "Placas Solares", icon: Sun, basePrice: 5500, description: "Instalación fotovoltaica básica" },
  { id: "piscina", label: "Piscina", icon: Waves, basePrice: 18000, description: "Piscina de obra 8x4m" },
  { id: "aislamiento", label: "Aislamiento Térmico", icon: Thermometer, basePrice: 45, description: "Precio por m² de aislamiento" },
];

const madridZones: ZoneMultiplier[] = [
  { zone: "Centro (Sol, Malasaña, Chueca)", multiplier: 1.25 },
  { zone: "Salamanca / Chamberí", multiplier: 1.30 },
  { zone: "Retiro / Arganzuela", multiplier: 1.15 },
  { zone: "Chamartín / Tetuán", multiplier: 1.20 },
  { zone: "Moncloa / Latina", multiplier: 1.10 },
  { zone: "Carabanchel / Usera", multiplier: 1.00 },
  { zone: "Vallecas / Vicálvaro", multiplier: 0.95 },
  { zone: "Hortaleza / San Blas", multiplier: 1.05 },
  { zone: "Las Rozas / Majadahonda", multiplier: 1.20 },
  { zone: "Pozuelo / Boadilla", multiplier: 1.25 },
  { zone: "Alcobendas / San Sebastián de los Reyes", multiplier: 1.15 },
  { zone: "Getafe / Leganés", multiplier: 0.95 },
  { zone: "Sierra Norte (Mirasierra, El Pardo)", multiplier: 1.15 },
];

const ReformBudgetCalculator = () => {
  const [reformType, setReformType] = useState<ReformType | "">("");
  const [zone, setZone] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(80);
  const [calculated, setCalculated] = useState(false);

  const selectedReform = reformOptions.find((r) => r.id === reformType);
  const selectedZone = madridZones.find((z) => z.zone === zone);

  const needsSquareMeters = reformType === "integral" || reformType === "aislamiento";

  const calculateBudget = () => {
    if (!selectedReform || !selectedZone) return { min: 0, max: 0 };

    let baseAmount: number;

    if (needsSquareMeters) {
      baseAmount = selectedReform.basePrice * squareMeters;
    } else {
      baseAmount = selectedReform.basePrice;
    }

    const adjustedAmount = baseAmount * selectedZone.multiplier;
    
    // Rango de ±15%
    const min = Math.round(adjustedAmount * 0.85);
    const max = Math.round(adjustedAmount * 1.15);

    return { min, max };
  };

  const budget = calculateBudget();

  const handleCalculate = () => {
    if (reformType && zone) {
      setCalculated(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
    setSquareMeters(Math.max(10, Math.min(value, 500)));
    setCalculated(false);
  };

  return (
    <section className="py-20 bg-secondary" aria-labelledby="budget-calculator-heading">
      <div className="container mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-7 h-7 text-gold" aria-hidden="true" />
          </div>
          <h2 id="budget-calculator-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calculadora de <span className="text-gradient-gold">Presupuestos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Obtén una estimación orientativa del coste de tu reforma según el tipo de proyecto y la zona de Madrid.
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card p-8 rounded-xl shadow-card">
            <div className="space-y-6">
              {/* Tipo de reforma */}
              <div className="space-y-2">
                <Label htmlFor="reform-type" className="text-foreground font-medium">
                  Tipo de Reforma
                </Label>
                <Select
                  value={reformType}
                  onValueChange={(value: ReformType) => {
                    setReformType(value);
                    setCalculated(false);
                  }}
                >
                  <SelectTrigger id="reform-type" className="w-full">
                    <SelectValue placeholder="Selecciona el tipo de reforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {reformOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-gold" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedReform && (
                  <p className="text-sm text-muted-foreground">{selectedReform.description}</p>
                )}
              </div>

              {/* Metros cuadrados (solo para integral y aislamiento) */}
              {needsSquareMeters && (
                <div className="space-y-2">
                  <Label htmlFor="square-meters" className="text-foreground font-medium">
                    Metros Cuadrados
                  </Label>
                  <div className="relative">
                    <Input
                      id="square-meters"
                      type="number"
                      min={10}
                      max={500}
                      value={squareMeters}
                      onChange={handleSquareMetersChange}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      m²
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo 10 m² - Máximo 500 m²
                  </p>
                </div>
              )}

              {/* Zona de Madrid */}
              <div className="space-y-2">
                <Label htmlFor="madrid-zone" className="text-foreground font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  Zona de Madrid
                </Label>
                <Select
                  value={zone}
                  onValueChange={(value) => {
                    setZone(value);
                    setCalculated(false);
                  }}
                >
                  <SelectTrigger id="madrid-zone" className="w-full">
                    <SelectValue placeholder="Selecciona la zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {madridZones.map((z) => (
                      <SelectItem key={z.zone} value={z.zone}>
                        {z.zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botón calcular */}
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={handleCalculate}
                disabled={!reformType || !zone}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calcular Presupuesto
              </Button>

              {/* Resultado */}
              {calculated && reformType && zone && (
                <div className="mt-6 p-6 bg-gradient-hero rounded-xl text-center">
                  <p className="text-cream/80 text-sm mb-2">Presupuesto estimado</p>
                  <div className="text-3xl md:text-4xl font-bold text-cream mb-2">
                    {formatCurrency(budget.min)} - {formatCurrency(budget.max)}
                  </div>
                  <p className="text-cream/60 text-xs mb-4">
                    *Precio orientativo. El presupuesto final puede variar según las características específicas del proyecto.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="bg-gold/20 text-cream px-3 py-1 rounded-full">
                      {selectedReform?.label}
                    </span>
                    {needsSquareMeters && (
                      <span className="bg-gold/20 text-cream px-3 py-1 rounded-full">
                        {squareMeters} m²
                      </span>
                    )}
                    <span className="bg-gold/20 text-cream px-3 py-1 rounded-full">
                      {zone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground mt-6 text-center">
              Esta calculadora proporciona estimaciones orientativas basadas en precios medios del mercado en Madrid. 
              Para obtener un presupuesto detallado y personalizado, contacta con nuestro equipo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReformBudgetCalculator;
