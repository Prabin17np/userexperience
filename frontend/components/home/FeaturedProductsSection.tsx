import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types/product'; // adjust to your actual type path

interface FeaturedProductsSectionProps {
  products: Product[];
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products }) => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 lg:mb-14">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-[var(--text)]">
              Featured Drops
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Handpicked styles, trending this week
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-200 group"
          >
            View All
            <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text)]"
          >
            View All <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
};