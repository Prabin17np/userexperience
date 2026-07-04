import Link from 'next/link';
import Image from 'next/image';

export const FeaturedCollectionSection: React.FC = () => {
  return (
    <section className="bg-[var(--surface-sunken)] py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-4">
              New Collection
            </p>
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text)] leading-[0.95] mb-6">
              Engineered<br />for Movement
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm mb-8">
              Our latest performance line combines lightweight construction with premium materials — built for athletes who refuse to compromise.
            </p>
            <Link
              href="/shop?collection=new"
              className="inline-flex items-center justify-center h-12 px-8 bg-[var(--surface-inverse)] text-[var(--text-inverse)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-colors duration-300"
            >
              Explore Collection
            </Link>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/feature.jpg"
              alt="Featured collection"
              fill
              className="object-cover transition-transform duration-700 ease-out hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};