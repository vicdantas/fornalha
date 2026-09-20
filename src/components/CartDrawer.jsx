import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

function fmt(n) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function CartItem({ item }) {
  const { changeQty, remove } = useCart()
  return (
    <div className="flex gap-3 py-3.5 border-b border-white/5 last:border-0">
      <div className="w-14 h-11 rounded bg-navy-2 border border-white/5 shrink-0 flex items-center justify-center">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
          : <ShoppingBag className="w-5 h-5 text-gold/30" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm text-white tracking-wide truncate">{item.name}</p>
        <p className="text-xs text-white/30 mb-2">{item.weight}</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-sm text-gold font-bold">{fmt(item.price * item.qty)}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeQty(item.$id, -1)}
              className="w-6 h-6 rounded border border-white/10 text-white/60 hover:border-gold/40 hover:text-gold flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-white">{item.qty}</span>
            <button
              onClick={() => changeQty(item.$id, 1)}
              className="w-6 h-6 rounded border border-white/10 text-white/60 hover:border-gold/40 hover:text-gold flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={() => remove(item.$id)}
              className="w-6 h-6 rounded border border-white/5 text-white/20 hover:border-red-500/40 hover:text-red-400 flex items-center justify-center ml-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { items, open, setOpen, total, count, clear, checkout } = useCart()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-navy border-l border-white/5 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Head */}
        <div className="flex items-center justify-between px-5 py-4 bg-ink border-b border-white/5">
          <div>
            <p className="font-display text-gold font-bold tracking-widest text-sm">FORNALHA</p>
            <p className="text-xs text-white/30 mt-0.5">Seu pedido · {count} {count === 1 ? 'item' : 'itens'}</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white/10" />
              </div>
              <p className="text-sm text-white/30 leading-relaxed">Seu carrinho está vazio.<br />Adicione cortes para continuar.</p>
            </div>
          ) : (
            items.map(item => <CartItem key={item.$id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 bg-ink border-t border-white/5">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-white/40">Subtotal</span>
              <span className="text-xs text-white/40">{fmt(total)}</span>
            </div>
            <div className="flex justify-between items-baseline pb-3 border-b border-white/5 mb-3">
              <span className="text-xs text-white/40">Entrega</span>
              <span className="text-xs text-white/40">A confirmar</span>
            </div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-semibold text-white">Total estimado</span>
              <span className="font-display text-xl font-bold text-gold">{fmt(total)}</span>
            </div>
            <p className="text-[11px] text-white/20 mb-4 leading-relaxed">
              Disponibilidade e frete confirmados pelo WhatsApp após envio. Atendemos seg–sáb, 8h–18h.
            </p>
            <button
              onClick={checkout}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-sm py-3.5 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.534 5.852L.052 23.99l6.328-1.451A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.37l-.359-.213-3.754.861.878-3.65-.233-.374A9.818 9.818 0 0112 2.182 9.818 9.818 0 0121.818 12 9.818 9.818 0 0112 21.818z"/>
              </svg>
              Finalizar pelo WhatsApp
            </button>
            <button onClick={clear} className="w-full text-center text-xs text-white/20 hover:text-red-400 mt-3 transition-colors">
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  )
}
