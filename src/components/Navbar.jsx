import { Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Logo } from './Logo'
import { Button } from './ui/Button'
import { InstagramIcon } from './ui/icons'

export function Navbar({ onSearch }) {
  const { count, setOpen } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="/" aria-label="Fornalha — início" className="shrink-0">
          <Logo size={56} />
        </a>

        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cortes..."
            aria-label="Buscar produtos"
            onChange={e => onSearch?.(e.target.value)}
            className="h-11 w-full rounded-md border border-input bg-secondary pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <Button
          as="a"
          variant="ghost"
          size="icon"
          href="https://instagram.com/fornalhaboutique"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram da Fornalha"
          className="ml-auto md:ml-0"
        >
          <InstagramIcon />
        </Button>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="relative h-11 border-primary/50"
        >
          <ShoppingBag />
          <span className="hidden sm:inline">Meu pedido</span>
          {count > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
