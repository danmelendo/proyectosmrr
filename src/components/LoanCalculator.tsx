import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [inputValue, setInputValue] = useState<string>("10.000");
  const [months, setMonths] = useState<number>(24);

  const TAE = 6; // 6% TAE

  const monthlyPayment = useMemo(() => {
    // Convertir TAE a tasa mensual
    const monthlyRate = Math.pow(1 + TAE / 100, 1 / 12) - 1;
    
    // Fórmula de cuota mensual: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    if (monthlyRate === 0) {
      return loanAmount / months;
    }
    
    const payment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return payment;
  }, [loanAmount, months]);

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - loanAmount;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow user to type freely
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    // Parse the number (remove dots used as thousands separator in Spanish)
    const numericValue = parseInt(rawValue.replace(/\./g, "").replace(/[^0-9]/g, ""), 10);
    
    if (!isNaN(numericValue)) {
      setLoanAmount(numericValue);
    }
  };

  const handleAmountBlur = () => {
    // On blur, validate and format the value
    let validAmount = loanAmount;
    if (validAmount < 1000) validAmount = 1000;
    if (validAmount > 100000) validAmount = 100000;
    
    setLoanAmount(validAmount);
    setInputValue(validAmount.toLocaleString("es-ES"));
  };

  return (
    <section className="py-20 bg-secondary" aria-labelledby="calculator-heading">
      <div className="container mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold font-medium">Herramienta de Cálculo</span>
          <h2 id="calculator-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Calculadora de Préstamo para Reforma
          </h2>
          <p className="text-muted-foreground text-lg">
            Calcula tu cuota mensual con un <span className="text-gold font-semibold">6% TAE</span>
          </p>
        </header>

        <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-gold" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Simula tu préstamo</h3>
              <p className="text-sm text-muted-foreground">Introduce el importe y el plazo deseado</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Loan Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="loan-amount" className="text-foreground font-medium">
                Importe del préstamo
              </Label>
              <div className="relative">
                <Input
                  id="loan-amount"
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  className="text-lg pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  €
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo 1.000€ - Máximo 100.000€
              </p>
            </div>

            {/* Months Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="months" className="text-foreground font-medium">
                  Plazo de devolución
                </Label>
                <span className="text-gold font-semibold text-lg">{months} meses</span>
              </div>
              <Slider
                id="months"
                value={[months]}
                onValueChange={(value) => setMonths(value[0])}
                min={3}
                max={96}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>3 meses</span>
                <span>96 meses</span>
              </div>
            </div>

            {/* Results */}
            <div className="bg-primary/5 rounded-xl p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Cuota mensual</p>
                <p className="text-4xl font-bold text-gold">
                  {monthlyPayment.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} €
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total a pagar</p>
                  <p className="text-lg font-semibold text-foreground">
                    {totalPayment.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} €
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Intereses totales</p>
                  <p className="text-lg font-semibold text-foreground">
                    {totalInterest.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} €
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              * Cálculo orientativo con TAE del 6%. Las condiciones finales dependerán 
              de la evaluación crediticia. Consulta condiciones personalizadas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;
