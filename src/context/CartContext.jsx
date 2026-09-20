import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

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
    const WA = import.meta.env.VITE_WA_NUMBER || '5511952176125'
    let msg = '🥩 *Pedido — Fornalha Boutique de Carnes*\n\n'
    items.forEach(i => {
      msg += `• ${i.name} (${i.weight}) × ${i.qty} — R$ ${(i.price * i.qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
    })
    msg += `\n*Total estimado: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*`
    msg += '\n\nOlá! Gostaria de confirmar disponibilidade e frete. Obrigado!'
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [items, total])

  return (
    <CartContext.Provider value={{ items, addItem, changeQty, remove, clear, total, count, open, setOpen, checkout }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
