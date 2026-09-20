import { ShoppingBag, Search } from 'lucide-react'

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}
import { useCart } from '../context/CartContext'
import { Logo } from './Logo'
import { useRef } from 'react'

export function Navbar({ onSearch }) {
  const { count, setOpen } = useCart()
  const searchRef = useRef()

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <Logo size={40} />
          <div className="hidden sm:block">
            <div className="font-display text-gold text-base font-bold tracking-widest leading-none">FORNALHA</div>
            <div className="text-[9px] text-gold/40 tracking-[0.22em] uppercase mt-0.5">Boutique de Carnes</div>
          </div>
        </a>

        {/* Search */}
        <div className="flex-1 max-w-md relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-white/20 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar cortes..."
            onChange={e => onSearch?.(e.target.value)}
            className="w-full bg-navy/60 border border-white/8 text-white placeholder-white/20 rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:border-gold/40 focus:bg-navy transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://instagram.com/fornalhaboutique"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md border border-white/8 text-white/40 hover:text-white hover:border-white/20 transition-all"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold text-sm px-4 py-2 rounded-md transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Meu pedido</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-ink text-gold text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-gold/30">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
