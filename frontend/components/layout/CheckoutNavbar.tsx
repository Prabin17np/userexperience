// import Link from 'next/link';

// interface Props {
//   variant?: 'simple' | 'secure' | 'full';
// }

// export function CheckoutNavbar({ variant = 'simple' }: Props) {
//   return (
//     <nav
//       className="sticky top-0 z-[100] h-[68px] flex items-center justify-between px-8 backdrop-blur-md"
//       style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
//     >
//       <Link
//         href="/"
//         className="font-['Playfair_Display'] text-xl font-extrabold tracking-wide"
//         style={{ color: 'var(--text)' }}
//       >
//         SOLE
//       </Link>

//       {variant === 'full' && (
//         <div className="hidden sm:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--text2)' }}>
//           <Link href="/shop">New Arrivals</Link>
//           <Link href="/shop">Collections</Link>
//           <Link href="/shop">Brands</Link>
//           <Link href="/shop">Sale</Link>
//         </div>
//       )}

//       {variant === 'secure' ? (
//         <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text2)' }}>
//           🔒 Secure Checkout
//         </div>
//       ) : (
//         <div className="flex items-center gap-4" style={{ color: 'var(--text)' }}>
//           <Link href="/cart" aria-label="Cart">
//             <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
//               <line x1="3" y1="6" x2="21" y2="6" />
//               <path d="M16 10a4 4 0 0 1-8 0" />
//             </svg>
//           </Link>
//           <Link href="/login" aria-label="Account">
//             <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//               <circle cx="12" cy="7" r="4" />
//             </svg>
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }