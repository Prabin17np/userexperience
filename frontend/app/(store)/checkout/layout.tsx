export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main>{children}</main>
      <footer
        className="px-8 py-8 mt-16"
        style={{ background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-extrabold text-sm tracking-wide" style={{ color: 'var(--text)' }}>SOLE</div>
            <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>© 2026 SOLE Inc. Engineered for Momentum.</p>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text3)' }}>
            <span>Returns</span>
            <span>Shipping Policy</span>
            <span>Sustainability</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}