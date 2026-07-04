import Link from 'next/link';
import Image from 'next/image';

export const PromoBannerSection: React.FC = () => {
  return (
    <section className="relative bg-[var(--surface-inverse)] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/promo.jpg"
          alt=""
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8 py-24 lg:py-32 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-4">
          Limited Time
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[var(--text-inverse)] leading-[0.95] mb-6">
          Up to 40% Off<br />Selected Styles
        </h2>
        <p className="text-sm text-[var(--text-inverse-muted)] max-w-md mx-auto mb-10">
          Don&apos;t miss out — our biggest seasonal drop ends soon.
        </p>
        <Link
          href="/shop?sale=true"
          className="inline-flex items-center justify-center h-12 px-10 border-2 border-[var(--text-inverse)] text-[var(--text-inverse)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-inverse)] hover:text-[var(--surface-inverse)] transition-colors duration-300"
        >
          Shop the Sale
        </Link>
      </div>
    </section>
  );
};