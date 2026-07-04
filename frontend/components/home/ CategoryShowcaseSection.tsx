import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { label: 'Running', href: '/shop?category=running', image: '/images/running.jpg' },
  { label: 'Basketball', href: '/shop?category=basketball', image: '/images/basketball.jpg' },
  { label: 'Lifestyle', href: '/shop?category=lifestyle', image: '/images/lifestyle.jpg' },
  { label: 'Training', href: '/shop?category=training', image: '/images/training.jpg' },
];

export const CategoryShowcaseSection: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 lg:mb-14">
          <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-[var(--text)]">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden bg-[var(--surface-sunken)]"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/70" />
              <div className="absolute bottom-5 left-5">
                <span className="text-white text-base lg:text-lg font-bold uppercase tracking-wide relative inline-block">
                  {cat.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};