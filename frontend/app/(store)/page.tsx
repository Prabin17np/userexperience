import { HeroSection } from "@/components/home/herosection";
import { TrustFeaturesStrip } from "@/components/home/ TrustFeaturesStrip";
import { CategoryShowcaseSection } from "@/components/home/ CategoryShowcaseSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { PromoBannerSection } from "@/components/home/PromoBannerSection";
import { FeaturedCollectionSection } from "@/components/home/FeaturedCollectionSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { productsApi } from "@/lib/api/products";

export default async function HomePage() {
  const data = await productsApi.getProducts();
  const products = data.products;

  return (
    <main>
      <HeroSection />
      <TrustFeaturesStrip />
      <CategoryShowcaseSection />
      <FeaturedProductsSection products={products} />
      <PromoBannerSection />
      <FeaturedCollectionSection />
      <NewsletterSection />
    </main>
  );
}