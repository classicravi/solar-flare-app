import { useState } from 'react';
import { Sun, Zap, Database, RotateCcw } from 'lucide-react';

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

interface PredictionResult {
  probability: number;
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
}

const parameterDescriptions: Record<keyof SolarParameters, string> = {
  TOTUSJH: 'Total unsigned current helicity',
  TOTBSQ: 'Total magnitude of Lorentz force',
  TOTPOT: 'Total photospheric magnetic free energy density',
  TOTUSJZ: 'Total unsigned vertical current',
  ABSNJZH: 'Absolute value of the net current helicity',
  SAVNCPP: 'Sum of the absolute value of the net current per polarity',
  USFLUX: 'Total unsigned flux',
  AREA_ACR: 'Area of strong field pixels in the active region',
  TOTFZ: 'Sum of z-component of Lorentz force',
  MEANPOT: 'Mean photospheric magnetic free energy',
  R_VALUE: 'Sum of flux near polarity inversion line',
  EPSZ: 'Sum of z-component of normalized Lorentz force',
  SHRGT45: 'Fraction of Area with Shear > 45°',
};

const sampleData: SolarParameters = {
  TOTUSJH: '3500.5',
  TOTBSQ: '125000.0',
  TOTPOT: '8500.25',
  TOTUSJZ: '28000.0',
  ABSNJZH: '4200.0',
  SAVNCPP: '15000.0',
  USFLUX: '2.5e22',
  AREA_ACR: '450.0',
  TOTFZ: '1.2e22',
  MEANPOT: '850.0',
  R_VALUE: '3.8e24',
  EPSZ: '0.015',
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

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (key: keyof SolarParameters, value: string) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const fillSampleData = () => {
    setParameters(sampleData);
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
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <div className="glass-card glow-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              Solar Magnetic Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(parameters) as Array<keyof SolarParameters>).map((key) => (
              <div key={key} className="group">
                <label className="floating-label group-focus-within:text-primary transition-colors">
                  {key}
                </label>
                <input
                  type="text"
                  value={parameters[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder={parameterDescriptions[key]}
                  className="solar-input"
                  required
                />
              </div>
            ))}
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
  );
};

export default SolarFlareForm;
