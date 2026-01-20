import solarBackground from '@/assets/solar-background.jpg';
import ParticleField from '@/components/ParticleField';
import SolarFlareForm from '@/components/SolarFlareForm';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen background image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${solarBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Dark overlay for readability */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at center top, transparent 0%, hsl(var(--space-dark) / 0.7) 70%),
            linear-gradient(to bottom, hsl(var(--space-dark) / 0.5) 0%, hsl(var(--space-dark) / 0.9) 100%)
          `,
        }}
      />

      {/* Animated particle field */}
      <ParticleField />

      {/* Main content */}
      <main className="relative z-20 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <SolarFlareForm />
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Solar Insight App • Powered by AI
        </p>
      </footer>
    </div>
  );
};

export default Index;
