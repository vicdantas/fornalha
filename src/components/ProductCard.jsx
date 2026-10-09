import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from './ui/Button'
import { CATEGORY_LABEL, unitLabel } from '../lib/catalog'

const BADGE_STYLES = {
  'Top venda': 'bg-primary text-primary-foreground',
  'Dry Aged': 'bg-gold-900 text-gold-100',
  'Importado': 'bg-accent text-foreground/80',
  'Exclusivo': 'bg-gold-700 text-gold-100',
  'Novo': 'bg-gold-100 text-primary-foreground',
  'Kit': 'bg-secondary text-primary ring-1 ring-inset ring-primary/30',
  'Oferta': 'bg-red-900/70 text-red-200',
}

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function ProductCard({ product }) {
  const { items, addItem, changeQty } = useCart()
  const qty = items.find(i => i.$id === product.$id)?.qty ?? 0
  const isOutOfStock =
    product.stock !== undefined && product.stock !== null && product.stock <= 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="size-10 text-muted-foreground/20" />
          </div>
        )}

        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              BADGE_STYLES[product.badge] ?? 'bg-primary text-primary-foreground'
            }`}
          >
            {product.badge}
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-overlay">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
              Indisponível
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
          {CATEGORY_LABEL[product.category] ?? product.category}
          {product.brand && <span className="text-muted-foreground"> · {product.brand}</span>}
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-tight">{product.name}</h3>
        {product.weight && (
          <p className="mt-1 text-xs text-muted-foreground">{product.weight}</p>
        )}
        <p className="mt-1 min-h-10 flex-1 text-sm leading-5 text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <strong className="text-xl font-semibold text-gold-200">{money.format(product.price)}</strong>
            <span className="ml-1 text-xs text-muted-foreground">/ {unitLabel(product.unit)}</span>
          </div>
        </div>

        {isOutOfStock ? (
          <p className="mt-4 flex h-9 items-center justify-center rounded-md border border-border text-xs text-muted-foreground">
            Sem estoque
          </p>
        ) : qty === 0 ? (
          <Button className="mt-4 w-full" onClick={() => addItem(product)}>
            <ShoppingBag /> Adicionar
          </Button>
        ) : (
          <div className="mt-4 flex h-9 items-center justify-between rounded-md border border-primary bg-primary/5 px-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => changeQty(product.$id, -1)}
              aria-label={`Diminuir ${product.name}`}
              className="text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Minus />
            </Button>
            <span className="text-sm font-bold">
              {qty} no pedido
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => changeQty(product.$id, 1)}
              aria-label={`Aumentar ${product.name}`}
              className="text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Plus />
            </Button>
          </div>
        )}
      </div>
    </article>
  )
}
