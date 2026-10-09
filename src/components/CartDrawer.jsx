import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from './ui/Button'
import { WhatsappIcon } from './ui/icons'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function CartItem({ item }) {
  const { changeQty, remove } = useCart()

  return (
    <div className="flex gap-3 border-b border-border pb-5 last:border-0 last:pb-0">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <ShoppingBag className="size-6 text-primary/40" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold">{item.name}</h3>
        <p className="mt-1 text-sm text-primary">{money.format(item.price)}</p>
        <div className="mt-2 flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => changeQty(item.$id, -1)}
            aria-label={`Diminuir ${item.name}`}
          >
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm">{item.qty}</span>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => changeQty(item.$id, 1)}
            aria-label={`Aumentar ${item.name}`}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <Button
        variant="destructive"
        size="icon"
        onClick={() => remove(item.$id)}
        aria-label={`Remover ${item.name}`}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export function CartDrawer() {
  const { items, open, setOpen, total, count, clear, checkout } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 animate-fade-in bg-overlay"
        aria-label="Fechar carrinho"
        onClick={() => setOpen(false)}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Meu pedido"
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in-right flex-col border-l border-border bg-background shadow-2xl"
      >
        <div className="flex h-20 items-center justify-between border-b border-border px-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Fornalha</p>
            <h2 className="text-xl font-semibold">Meu pedido</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fechar">
            <X />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 size-10 text-primary" />
              <h3 className="text-lg font-semibold">Seu pedido está vazio</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Adicione os cortes que deseja e finalize pelo WhatsApp.
              </p>
              <Button className="mt-6" onClick={() => setOpen(false)}>
                Explorar catálogo
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map(item => (
                <CartItem key={item.$id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-secondary p-5">
            <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {count} {count === 1 ? 'item' : 'itens'}
              </span>
              <span>Subtotal</span>
            </div>
            <div className="mb-5 text-right font-display text-3xl font-semibold">
              {money.format(total)}
            </div>

            <Button variant="whatsapp" size="lg" className="w-full" onClick={checkout}>
              <WhatsappIcon /> Finalizar no WhatsApp
            </Button>

            <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
              Disponibilidade, peso e valor final serão confirmados no atendimento.
              Atendemos de segunda a sábado, das 8h às 18h.
            </p>

            <Button variant="ghost" onClick={clear} className="mt-2 w-full">
              Limpar pedido
            </Button>
          </div>
        )}
      </aside>
    </div>
  )
}
