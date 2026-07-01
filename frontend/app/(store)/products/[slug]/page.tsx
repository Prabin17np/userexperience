import { notFound } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductGrid } from '@/components/product/ProductGrid';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

const REVIEWS = [
  { name: 'Alexandra M.', date: 'March 2026',    stars: 5, text: "Absolutely love these! The craftsmanship is exceptional and they're incredibly comfortable right out of the box. I've received so many compliments." },
  { name: 'James T.',     date: 'February 2026', stars: 5, text: "Worth every penny. The materials feel premium and the fit is perfect. Been wearing them daily for 3 months and they still look brand new." },
  { name: 'Sophie L.',    date: 'January 2026',  stars: 4, text: "Beautiful shoe, runs slightly narrow. Went up a half size and it's perfect now. Shipping was fast and packaging was gorgeous." },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    product = await productsApi.getProductBySlug(slug);
  } catch {
    notFound();
  }

  let related: typeof product[] = [];
  try {
    const result = await productsApi.getProducts({
      category: product.category,
      limit: 5,
    });
    related = result.products
      .filter((p) => p.id !== product!.id)
      .slice(0, 4);
  } catch {
    related = [];
  }

  const avgRating = (
    REVIEWS.reduce((a, r) => a + r.stars, 0) / REVIEWS.length
  ).toFixed(1);

  return (
    <>
      <style>{`
        .bc-link {
          color: var(--text3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .bc-link:hover { color: var(--accent); }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem 4rem;
        }

        .review-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 1.5rem 1.75rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .review-card:hover {
          border-color: var(--border2);
          box-shadow: var(--shadow);
        }
        .review-stars { color: #C8A97E; letter-spacing: 2px; font-size: 0.95rem; }

        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

        {/* Breadcrumb */}
        <div style={{
          maxWidth: 1400, margin: '0 auto', padding: '1rem 2rem',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '0.82rem', color: 'var(--text3)',
        }}>
          <Link href="/" className="bc-link">Home</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href="/shop" className="bc-link">Shop</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href={`/shop?category=${product.category}`} className="bc-link">
            {product.category}
          </Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>

        {/* Gallery + Details */}
        <div className="detail-grid">
          <ProductGallery images={product.images} name={product.name} />
          <ProductDetails product={product} />
        </div>

        {/* Reviews */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 5rem' }}>

          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '1rem', marginBottom: '1.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <p style={{
                fontSize: '0.75rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--accent)',
                fontWeight: 500, marginBottom: 4,
              }}>
                What customers say
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.6rem', fontWeight: 600, color: 'var(--text)',
              }}>
                Customer Reviews
              </h2>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              padding: '0.6rem 1rem',
            }}>
              <span style={{ color: '#C8A97E', fontSize: '1.1rem', letterSpacing: 2 }}>
                ★★★★★
              </span>
              <div>
                <div style={{
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--text)', lineHeight: 1,
                }}>
                  {avgRating}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>
                  {REVIEWS.length} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Review list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card">
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', marginBottom: '0.85rem',
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.92rem', fontWeight: 600,
                      color: 'var(--text)', marginBottom: 3,
                    }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                      {r.date}
                    </div>
                  </div>
                  <span className="review-stars">
                    {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.875rem', color: 'var(--text2)',
                  lineHeight: 1.75, margin: 0,
                }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem 5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{
                fontSize: '0.75rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--accent)',
                fontWeight: 500, marginBottom: '0.5rem',
              }}>
                You May Also Like
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 600, color: 'var(--text)',
              }}>
                Related Products
              </h2>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        )}

      </div>
    </>
  );
}