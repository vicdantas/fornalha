import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const BADGE_STYLES = {
  'Top venda': 'bg-gold text-ink',
  'Dry Aged':  'bg-gold-dark text-gold-light border border-gold/20',
  'Importado': 'bg-navy-3 text-white/70 border border-white/10',
  'Exclusivo': 'bg-purple-900/60 text-purple-300 border border-purple-500/20',
  'Novo':      'bg-emerald-900/60 text-emerald-300 border border-emerald-500/20',
  'Kit':       'bg-gold/10 text-gold border border-gold/20',
  'Oferta':    'bg-red-900/60 text-red-300 border border-red-500/20',
}

const CAT_LABEL = {
  bovino: 'Bovinos',
  premium: 'Premium',
  dryaged: 'Dry Aged',
  kit: 'Kits',
  suino: 'Suínos',
  embutidos: 'Embutidos',
  ofertas: 'Ofertas',
}

function fmt(n) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export function ProductCard({ product }) {
  const { items, addItem, changeQty } = useCart()
  const cartItem = items.find(i => i.$id === product.$id)
  const qty = cartItem?.qty ?? 0
  const isOutOfStock = product.stock !== undefined && product.stock !== null && product.stock <= 0

  return (
    <div className="bg-navy border border-white/5 rounded-lg overflow-hidden flex flex-col group hover:border-gold/20 transition-colors">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-ink to-navy-2 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-white/5" />
          </div>
        )}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${BADGE_STYLES[product.badge] || 'bg-gold text-ink'}`}>
            {product.badge}
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">Indisponível</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-gold/60 mb-1">
          {CAT_LABEL[product.category] || product.category}
        </p>
        <h3 className="font-display text-white text-base font-medium tracking-wide leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-white/30 mb-2">{product.weight}</p>
        <p className="text-xs text-white/50 leading-relaxed flex-1 mb-4">{product.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5">
          <div>
            <span className="font-display text-gold font-bold text-lg">R$ {fmt(product.price)}</span>
            <span className="text-white/30 text-xs ml-1">/{product.unit || 'kg'}</span>
          </div>

          {isOutOfStock ? (
            <span className="text-xs text-white/20">Sem estoque</span>
          ) : qty === 0 ? (
            <button
              onClick={() => addItem(product)}
              className="flex items-center gap-1.5 bg-gold/10 hover:bg-gold text-gold hover:text-ink border border-gold/30 hover:border-gold font-semibold text-xs px-3 py-2 rounded-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </button>
          ) : (
            <div className="flex items-center gap-1 border border-gold/30 rounded-md overflow-hidden">
              <button
                onClick={() => changeQty(product.$id, -1)}
                className="w-8 h-8 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-bold text-gold">{qty}</span>
              <button
                onClick={() => changeQty(product.$id, 1)}
                className="w-8 h-8 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
