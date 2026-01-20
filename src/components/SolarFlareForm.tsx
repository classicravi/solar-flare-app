import { useState } from 'react';
import { Sun, Zap, Database, RotateCcw, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SolarParameters {
  TOTUSJH: string;
  TOTBSQ: string;
  TOTPOT: string;
  TOTUSJZ: string;
  ABSNJZH: string;
  SAVNCPP: string;
  USFLUX: string;
  AREA_ACR: string;
  TOTFZ: string;
  MEANPOT: string;
  R_VALUE: string;
  EPSZ: string;
  SHRGT45: string;
}

interface ParameterInfo {
  description: string;
  min: number;
  max: number;
}

interface PredictionResult {
  probability: number;
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
}

const parameterInfo: Record<keyof SolarParameters, ParameterInfo> = {
  TOTUSJH: { description: 'Total unsigned current helicity', min: 0, max: 10000 },
  TOTBSQ: { description: 'Total magnetic field squared', min: 0, max: 5000 },
  TOTPOT: { description: 'Total photospheric magnetic energy', min: 0, max: 100000 },
  TOTUSJZ: { description: 'Total unsigned vertical current', min: 0, max: 5000 },
  ABSNJZH: { description: 'Absolute net current helicity', min: 0, max: 1000 },
  SAVNCPP: { description: 'Sum of absolute net currents', min: 0, max: 500 },
  USFLUX: { description: 'Unsigned magnetic flux', min: 0, max: 50000 },
  AREA_ACR: { description: 'Active region area', min: 0, max: 2000 },
  TOTFZ: { description: 'Total Lorentz force (Z component)', min: 0, max: 1000 },
  MEANPOT: { description: 'Mean photospheric magnetic energy', min: 0, max: 1000 },
  R_VALUE: { description: "Schrijver's R parameter", min: 0, max: 5000 },
  EPSZ: { description: 'Mean vertical current density', min: 0, max: 100 },
  SHRGT45: { description: 'Fraction of shear angle > 45°', min: 0, max: 1 },
};

const sampleData: SolarParameters = {
  TOTUSJH: '3500',
  TOTBSQ: '2500',
  TOTPOT: '45000',
  TOTUSJZ: '2800',
  ABSNJZH: '420',
  SAVNCPP: '250',
  USFLUX: '25000',
  AREA_ACR: '450',
  TOTFZ: '500',
  MEANPOT: '850',
  R_VALUE: '3800',
  EPSZ: '50',
  SHRGT45: '0.35',
};

const SolarFlareForm = () => {
  const [parameters, setParameters] = useState<SolarParameters>({
    TOTUSJH: '',
    TOTBSQ: '',
    TOTPOT: '',
    TOTUSJZ: '',
    ABSNJZH: '',
    SAVNCPP: '',
    USFLUX: '',
    AREA_ACR: '',
    TOTFZ: '',
    MEANPOT: '',
    R_VALUE: '',
    EPSZ: '',
    SHRGT45: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SolarParameters, string>>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateParameter = (key: keyof SolarParameters, value: string): string | null => {
    if (!value.trim()) return null; // Empty is handled by required
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Invalid number';
    
    const info = parameterInfo[key];
    if (numValue < info.min || numValue > info.max) {
      return `Value must be between ${info.min} and ${info.max}`;
    }
    return null;
  };

  const handleInputChange = (key: keyof SolarParameters, value: string) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
    
    const error = validateParameter(key, value);
    setErrors((prev) => ({ ...prev, [key]: error || undefined }));
  };

  const fillSampleData = () => {
    setParameters(sampleData);
    setErrors({});
    setResult(null);
  };

  const resetForm = () => {
    setParameters({
      TOTUSJH: '',
      TOTBSQ: '',
      TOTPOT: '',
      TOTUSJZ: '',
      ABSNJZH: '',
      SAVNCPP: '',
      USFLUX: '',
      AREA_ACR: '',
      TOTFZ: '',
      MEANPOT: '',
      R_VALUE: '',
      EPSZ: '',
      SHRGT45: '',
    });
    setErrors({});
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all parameters
    const newErrors: Partial<Record<keyof SolarParameters, string>> = {};
    let hasErrors = false;
    
    (Object.keys(parameters) as Array<keyof SolarParameters>).forEach((key) => {
      const error = validateParameter(key, parameters[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);

    // Simulate API call with mock prediction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock prediction logic based on parameters
    const values = Object.values(parameters).map((v) => parseFloat(v) || 0);
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Simple mock calculation for demo
    let probability = Math.min(Math.max((avgValue / 10000) * 100, 5), 95);
    probability = Math.round(probability * 100) / 100;

    let riskLevel: 'low' | 'medium' | 'high';
    let message: string;

    if (probability < 30) {
      riskLevel = 'low';
      message = 'Low probability of solar flare activity. Conditions appear stable.';
    } else if (probability < 60) {
      riskLevel = 'medium';
      message = 'Moderate probability of solar flare activity. Continue monitoring.';
    } else {
      riskLevel = 'high';
      message = 'High probability of solar flare activity. Enhanced monitoring recommended.';
    }

    setResult({ probability, riskLevel, message });
    setIsLoading(false);
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 animate-[pulse-glow_2s_ease-in-out_infinite]">
            <Sun className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gradient-solar">
            Solar Flare Prediction
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered prediction system using solar magnetic field parameters
            to forecast solar flare probability.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-transparent border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">
                Solar Magnetic Parameters
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Object.keys(parameters) as Array<keyof SolarParameters>).map((key) => {
                const info = parameterInfo[key];
                const hasError = !!errors[key];
                
                return (
                  <div key={key} className="group">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                        {key}
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="p-0.5 rounded-full hover:bg-white/10 transition-colors">
                            <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs bg-background/95 border-white/20 backdrop-blur-md">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{info.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Valid range: {info.min} – {info.max}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <input
                      type="text"
                      value={parameters[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      placeholder={`${info.min} – ${info.max}`}
                      className={`solar-input ${hasError ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}`}
                      required
                    />
                    {hasError && (
                      <p className="mt-1 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">
                        {errors[key]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <button
                type="button"
                onClick={fillSampleData}
                className="glow-button-secondary flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Fill Sample Data
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="glow-button-secondary flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="glow-button flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" />
                  Predict Solar Flare
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className={`result-card ${result.riskLevel}-risk`}>
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Prediction Results
              </h3>
              
              {/* Probability gauge */}
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      result.riskLevel === 'low'
                        ? 'hsl(120, 70%, 45%)'
                        : result.riskLevel === 'medium'
                        ? 'hsl(45, 100%, 50%)'
                        : 'hsl(0, 85%, 60%)'
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${result.probability * 2.83} 283`}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: `drop-shadow(0 0 10px ${
                        result.riskLevel === 'low'
                          ? 'hsl(120, 70%, 45%)'
                          : result.riskLevel === 'medium'
                          ? 'hsl(45, 100%, 50%)'
                          : 'hsl(0, 85%, 60%)'
                      })`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">
                    {result.probability}%
                  </span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    Probability
                  </span>
                </div>
              </div>

              {/* Risk level badge */}
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold uppercase tracking-wider ${
                  result.riskLevel === 'low'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : result.riskLevel === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    result.riskLevel === 'low'
                      ? 'bg-green-400'
                      : result.riskLevel === 'medium'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  }`}
                />
                {result.riskLevel} Risk
              </div>

              {/* Message */}
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {result.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SolarFlareForm;
