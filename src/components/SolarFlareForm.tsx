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
  binary_prediction: 'Major Flare' | 'No Major Flare';
  final_class: string;
  confidence: number;
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
    
    // Mock response simulating backend API
    const mockClasses = ['B', 'C', 'M', 'X', 'B/C'];
    const classIndex = Math.min(Math.floor(avgValue / 2500), 4);
    const finalClass = mockClasses[classIndex];
    const isMajorFlare = finalClass === 'M' || finalClass === 'X';
    const confidence = Math.min(Math.max(0.4 + (avgValue / 20000), 0.4), 0.98);

    setResult({
      binary_prediction: isMajorFlare ? 'Major Flare' : 'No Major Flare',
      final_class: finalClass,
      confidence: confidence,
    });
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
              <h2 className="text-xl font-semibold text-white">
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
          <div className={`bg-transparent border rounded-2xl p-8 backdrop-blur-sm ${
            result.binary_prediction === 'Major Flare' 
              ? 'border-red-500/50' 
              : 'border-green-500/50'
          }`}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white text-center">
                Prediction Results
              </h3>
              
              {/* Results Grid */}
              <div className="space-y-4 max-w-md mx-auto">
                {/* Binary Prediction */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-muted-foreground font-medium">Binary Prediction</span>
                  <span className={`flex items-center gap-2 font-semibold ${
                    result.binary_prediction === 'Major Flare' 
                      ? 'text-red-400' 
                      : 'text-green-400'
                  }`}>
                    {result.binary_prediction === 'Major Flare' ? '✅' : '❌'} {result.binary_prediction}
                  </span>
                </div>

                {/* Final Prediction */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-muted-foreground font-medium">Final Prediction</span>
                  <span className={`font-semibold ${
                    result.final_class === 'M' || result.final_class === 'X'
                      ? 'text-red-400'
                      : 'text-green-400'
                  }`}>
                    {result.final_class === 'B/C' ? 'B / C Class' : `${result.final_class} Class`}
                  </span>
                </div>

                {/* Prediction Confidence */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-muted-foreground font-medium">Prediction Confidence</span>
                  <span className="text-white font-bold text-xl">
                    {Math.round(result.confidence * 100)} %
                  </span>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="max-w-md mx-auto">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      result.binary_prediction === 'Major Flare'
                        ? 'bg-gradient-to-r from-red-500 to-red-400'
                        : 'bg-gradient-to-r from-green-500 to-green-400'
                    }`}
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SolarFlareForm;
