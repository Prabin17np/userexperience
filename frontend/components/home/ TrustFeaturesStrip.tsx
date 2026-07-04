import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: Truck, label: 'Free Shipping', sub: 'On orders over ₹2999' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '30-day return window' },
  { icon: ShieldCheck, label: 'Secure Checkout', sub: '256-bit encryption' },
  { icon: Sparkles, label: 'Premium Quality', sub: 'Authenticity guaranteed' },
];

export const TrustFeaturesStrip: React.FC = () => {
  return (
    <section className="bg-[var(--surface-sunken)] border-y border-[var(--border)]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={20} strokeWidth={1.75} className="text-[var(--accent)] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--text)] truncate">
                  {label}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};