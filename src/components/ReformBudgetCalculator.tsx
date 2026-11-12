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
  minPrice: number; // precio mínimo por m² para reforma integral (con IVA)
  maxPrice: number; // precio máximo por m² para reforma integral (con IVA)
  multiplier: number; // multiplicador para otros servicios
}

const reformOptions: ReformOption[] = [
  { id: "integral", label: "Reforma Integral", icon: Home, basePrice: 650 * 1.21, description: "Renovación completa de la vivienda" },
  { id: "bano", label: "Reforma de Baño", icon: Bath, basePrice: 4500 * 1.21, description: "Precio por baño completo" },
  { id: "cocina", label: "Reforma de Cocina", icon: ChefHat, basePrice: 8000 * 1.21, description: "Precio por cocina completa" },
  { id: "placas-solares", label: "Placas Solares", icon: Sun, basePrice: 5500 * 1.21, description: "Instalación fotovoltaica básica" },
  { id: "piscina", label: "Piscina", icon: Waves, basePrice: 18000 * 1.21, description: "Piscina de obra 8x4m" },
  { id: "aislamiento", label: "Aislamiento Térmico", icon: Thermometer, basePrice: 45 * 1.21, description: "Precio por m² de aislamiento" },
];

const madridZones: ZoneMultiplier[] = [
  { zone: "Centro (Sol, Malasaña, Chueca)", minPrice: 950, maxPrice: 1092.50, multiplier: (950 + 1092.50) / 2 / (650 * 1.21) },
  { zone: "Salamanca / Chamberí", minPrice: 1100, maxPrice: 1265, multiplier: (1100 + 1265) / 2 / (650 * 1.21) },
  { zone: "Retiro / Arganzuela", minPrice: 1000, maxPrice: 1150, multiplier: (1000 + 1150) / 2 / (650 * 1.21) },
  { zone: "Chamartín / Tetuán", minPrice: 925, maxPrice: 1063.75, multiplier: (925 + 1063.75) / 2 / (650 * 1.21) },
  { zone: "Moncloa / Latina", minPrice: 1050, maxPrice: 1207.50, multiplier: (1050 + 1207.50) / 2 / (650 * 1.21) },
  { zone: "Carabanchel / Usera", minPrice: 850, maxPrice: 977.50, multiplier: (850 + 977.50) / 2 / (650 * 1.21) },
  { zone: "Vallecas / Vicálvaro", minPrice: 825, maxPrice: 948.75, multiplier: (825 + 948.75) / 2 / (650 * 1.21) },
  { zone: "Hortaleza / San Blas", minPrice: 900, maxPrice: 1035, multiplier: (900 + 1035) / 2 / (650 * 1.21) },
  { zone: "Las Rozas / Majadahonda", minPrice: 1050, maxPrice: 1207.50, multiplier: (1050 + 1207.50) / 2 / (650 * 1.21) },
  { zone: "Pozuelo / Boadilla", minPrice: 1050, maxPrice: 1207.50, multiplier: (1050 + 1207.50) / 2 / (650 * 1.21) },
  { zone: "Alcobendas / San Sebastián de los Reyes", minPrice: 950, maxPrice: 1092.50, multiplier: (950 + 1092.50) / 2 / (650 * 1.21) },
  { zone: "Getafe", minPrice: 840, maxPrice: 966, multiplier: (840 + 966) / 2 / (650 * 1.21) },
  { zone: "Leganés", minPrice: 835, maxPrice: 960.25, multiplier: (835 + 960.25) / 2 / (650 * 1.21) },
];

const ReformBudgetCalculator = () => {
  const [reformType, setReformType] = useState<ReformType | "">("");
  const [zone, setZone] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(80);
  const [clientBudget, setClientBudget] = useState<number | "">("");
  const [calculated, setCalculated] = useState(false);
  const [squareMetersError, setSquareMetersError] = useState<string>("");

  const selectedReform = reformOptions.find((r) => r.id === reformType);
  const selectedZone = madridZones.find((z) => z.zone === zone);

  const needsSquareMeters = reformType === "integral" || reformType === "aislamiento";
  const showSquareMetersOption = reformType === "integral"; // Solo mostrar para reforma integral

  const calculateBudget = () => {
    if (!selectedReform || !selectedZone) return { min: 0, max: 0, pricePerSqm: null };

    if (reformType === "integral") {
      // Para reforma integral, usar precios específicos por zona
      const min = Math.round(selectedZone.minPrice * squareMeters);
      const max = Math.round(selectedZone.maxPrice * squareMeters);
      const pricePerSqm = squareMeters > 0 ? {
        min: selectedZone.minPrice,
        max: selectedZone.maxPrice
      } : null;
      return { min, max, pricePerSqm };
    }

    // Para otros servicios, usar multiplicador de zona
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

    // Calcular precio por m² si se proporcionan metros cuadrados y es relevante
    const pricePerSqm = (squareMeters > 0 && (reformType === "aislamiento" || squareMeters > 1)) ? {
      min: Math.round((min / squareMeters) * 100) / 100,
      max: Math.round((max / squareMeters) * 100) / 100
    } : null;

    return { min, max, pricePerSqm };
  };

  const budget = calculateBudget();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateViability = () => {
    if (!clientBudget || typeof clientBudget !== 'number') return null;

    const budgetMin = budget.min;
    const difference = budgetMin - clientBudget;
    const percentage = (difference / budgetMin) * 100;

    if (clientBudget >= budget.min) {
      return {
        status: 'viable',
        message: 'Esta reforma está en rango con su presupuesto, contacte con nosotros para realizar un estudio y llevar a cabo su visión',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (percentage <= 40) {
      return {
        status: 'financing',
        message: 'Disponemos de medios de financiación a medida, contacte con nosotros para lograr una solución a su medida',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        status: 'insufficient',
        message: 'No dispone de fondos suficientes para llevar a cabo esta reforma',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const viability = calculateViability();

  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    
    setSquareMeters(numValue);
    
    // Validación solo para reforma integral
    if (showSquareMetersOption && numValue > 0 && numValue < 10) {
      setSquareMetersError("Como mínimo la superficie debe tener 10m²");
    } else {
      setSquareMetersError("");
    }
  };

  const handleClientBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientBudget(value === "" ? "" : parseFloat(value));
  };

  const handleCalculate = () => {
    if (reformType && zone) {
      setCalculated(true);
    }
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
            Obtén una estimación orientativa del coste de tu reforma según el tipo de proyecto y la zona de Madrid (IVA incluido).
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

              {/* Metros cuadrados (solo para reforma integral) */}
              {showSquareMetersOption && (
                <div className="space-y-2">
                  <Label htmlFor="square-meters" className="text-foreground font-medium">
                    Metros Cuadrados <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="square-meters"
                      type="number"
                      value={squareMeters || ""}
                      onChange={handleSquareMetersChange}
                      placeholder="Introduce los metros cuadrados"
                      className={`pr-12 ${squareMetersError ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      m²
                    </span>
                  </div>
                  {squareMetersError && (
                    <p className="text-sm text-red-500">{squareMetersError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Mínimo 10 m²
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

              {/* Presupuesto del cliente (opcional) */}
              <div className="space-y-2">
                <Label htmlFor="client-budget" className="text-foreground font-medium">
                  Tu Presupuesto <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="client-budget"
                    type="number"
                    value={clientBudget || ""}
                    onChange={handleClientBudgetChange}
                    placeholder="Introduce tu presupuesto disponible"
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    €
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Opcional: compara con nuestro presupuesto estimado
                </p>
              </div>

              {/* Botón calcular */}
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={handleCalculate}
                disabled={!reformType || !zone || (showSquareMetersOption && !!squareMetersError)}
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
                  {budget.pricePerSqm && (
                    <div className="text-lg md:text-xl text-cream/80 mb-2">
                      {formatCurrency(budget.pricePerSqm.min)} - {formatCurrency(budget.pricePerSqm.max)} / m²
                    </div>
                  )}
                  <p className="text-cream/60 text-xs mb-4">
                    *Precio orientativo con IVA incluido. El presupuesto final puede variar según las características específicas del proyecto.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="bg-gold/20 text-cream px-3 py-1 rounded-full">
                      {selectedReform?.label}
                    </span>
                    {squareMeters > 0 && (
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

            {/* Viabilidad del presupuesto */}
            {calculated && viability && (
              <div className={`mt-4 p-4 rounded-xl border ${viability.bgColor} ${viability.borderColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    viability.status === 'viable' ? 'bg-green-500' :
                    viability.status === 'financing' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <p className={`font-medium ${viability.color}`}>Análisis de viabilidad</p>
                </div>
                <p className={`text-sm ${viability.color}`}>{viability.message}</p>
                {viability.status === 'viable' && (
                  <p className="text-xs text-gray-600 mt-1">¡Perfecto! Tu presupuesto se ajusta al proyecto estimado.</p>
                )}
                {viability.status === 'financing' && (
                  <p className="text-xs text-gray-600 mt-1">Podemos ayudarte a financiar tu proyecto de reforma.</p>
                )}
                {viability.status === 'insufficient' && (
                  <p className="text-xs text-gray-600 mt-1">Considera ajustar el alcance del proyecto o buscar financiación adicional.</p>
                )}
              </div>
            )}

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
