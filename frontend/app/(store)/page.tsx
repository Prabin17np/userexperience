import { HeroSection } from "@/components/home/herosection";
import { ProductCard } from "@/components/product/ProductCard";
import { productsApi } from "@/lib/api/products";

export default async function HomePage() {
  const data = await productsApi.getProducts();

  const products = data.products; 

  return (
    <main>
      <HeroSection />

      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <h2 className="text-xl font-bold mb-6">Featured Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}