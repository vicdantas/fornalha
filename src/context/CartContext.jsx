import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  const addItem = useCallback((product) => {
    setItems(prev => {
      const ex = prev.find(i => i.$id === product.$id)
      if (ex) return prev.map(i => i.$id === product.$id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const changeQty = useCallback((id, delta) => {
    setItems(prev => {
      const next = prev.map(i => i.$id === id ? { ...i, qty: i.qty + delta } : i)
      return next.filter(i => i.qty > 0)
    })
  }, [])

  const remove = useCallback((id) => setItems(prev => prev.filter(i => i.$id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  const checkout = useCallback(() => {
    if (!items.length) return
    const wa = import.meta.env.VITE_WA_NUMBER || '5511952176125'

    const msg = [
      'Olá, Fornalha! Gostaria de fazer este pedido:',
      '',
      ...items.map(i => {
        const detail = i.weight ? ` (${i.weight})` : ''
        return `• ${i.qty}x ${i.name}${detail} — ${money.format(i.price * i.qty)}`
      }),
      '',
      `Total estimado: ${money.format(total)}`,
      '',
      'Pode confirmar a disponibilidade e o valor final?',
    ].join('\n')

    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [items, total])

  return (
    <CartContext.Provider value={{ items, addItem, changeQty, remove, clear, total, count, open, setOpen, checkout }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
