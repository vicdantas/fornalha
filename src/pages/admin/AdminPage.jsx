import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../lib/appwrite'
import { Logo } from '../../components/Logo'
import {
  Plus, Pencil, Trash2, LogOut, X, Loader2,
  Package, DollarSign, Tag, ToggleLeft, ToggleRight, ArrowLeft
} from 'lucide-react'

const EMPTY = {
  name: '', category: 'bovino', weight: '', description: '',
  price: '', unit: 'kg', badge: '', stock: '', imageUrl: '', order: 0, active: true
}
const CATEGORIES = ['bovino','premium','dryaged','kit','suino','embutidos','ofertas']
const BADGES = ['', 'Top venda', 'Dry Aged', 'Importado', 'Exclusivo', 'Novo', 'Kit', 'Oferta']

function fmt(n) { return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { ...EMPTY })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...form, price: parseFloat(form.price), stock: form.stock !== '' ? parseInt(form.stock) : null, order: parseInt(form.order) || 0 }
      await onSave(data)
      onClose()
    } catch (err) {
      alert('Erro ao salvar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full bg-ink border border-white/10 text-white placeholder-white/20 rounded-md px-3 py-2 text-sm outline-none focus:border-gold/40 transition-colors"
  const labelCls = "block text-xs text-white/40 mb-1"

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-navy border border-white/10 rounded-lg w-full max-w-lg my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="font-display text-gold font-bold tracking-wide text-sm">
            {product ? 'Editar produto' : 'Novo produto'}
          </h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Nome do produto *</label>
              <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Picanha Nelore" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Categoria *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <select value={form.badge} onChange={e => set('badge', e.target.value)} className={inputCls}>
                {BADGES.map(b => <option key={b} value={b}>{b || '—'}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Preço (R$) *</label>
              <input type="number" required step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="119.90" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Unidade</label>
              <select value={form.unit} onChange={e => set('unit', e.target.value)} className={inputCls}>
                {['kg','un','kit','500g','300g'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Peso / porção</label>
              <input type="text" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="Peça · ~1,2 kg" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Estoque (unid.)</label>
              <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="Ilimitado se vazio" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Descrição</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Descreva o corte..." className={inputCls + ' resize-none'} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>URL da imagem</label>
              <input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ordem de exibição</label>
              <input type="number" value={form.order} onChange={e => set('order', e.target.value)} placeholder="0" className={inputCls} />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <button type="button" onClick={() => set('active', !form.active)} className="text-gold">
                  {form.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-white/20" />}
                </button>
                <span className="text-xs text-white/50">{form.active ? 'Produto ativo' : 'Produto oculto'}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 border border-white/10 text-white/50 hover:text-white hover:border-white/20 py-2 rounded-md text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-50 text-ink font-bold py-2 rounded-md text-sm transition-colors">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [modal, setModal] = useState(null) // null | 'new' | product obj
  const [catFilter, setCatFilter] = useState('all')

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts(),
  })

  const filtered = catFilter === 'all' ? products : products.filter(p => p.category === catFilter)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-products'] })

  const saveProduct = async (data) => {
    if (modal === 'new') await createProduct(data)
    else await updateProduct(modal.$id, data)
    invalidate()
  }

  const handleDelete = async (id) => {
    if (!confirm('Excluir este produto?')) return
    await deleteProduct(id)
    invalidate()
  }

  const handleToggle = async (p) => {
    await updateProduct(p.$id, { active: !p.active })
    invalidate()
  }

  const handleLogout = async () => { await logout(); navigate('/admin/login') }

  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    outOfStock: products.filter(p => p.stock !== null && p.stock !== undefined && p.stock <= 0).length,
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Admin Nav */}
      <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <p className="font-display text-gold text-xs font-bold tracking-widest">FORNALHA</p>
              <p className="text-[9px] text-white/20 tracking-widest uppercase">Painel de gestão</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 hidden sm:block">{user?.email}</span>
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-md transition-all">
              <ArrowLeft className="w-3 h-3" /> Loja
            </a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2.5 py-1.5 rounded-md transition-all">
              <LogOut className="w-3 h-3" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Total de produtos', value: stats.total, icon: Package },
            { label: 'Produtos ativos', value: stats.active, icon: Tag },
            { label: 'Sem estoque', value: stats.outOfStock, icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-navy border border-white/5 rounded-lg p-4">
              <Icon className="w-4 h-4 text-gold/40 mb-2" />
              <p className="font-display text-2xl font-bold text-gold">{value}</p>
              <p className="text-xs text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex gap-2 overflow-x-auto">
            {['all', ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition-all ${catFilter === c ? 'bg-gold text-ink font-bold' : 'border border-white/10 text-white/40 hover:text-white'}`}>
                {c === 'all' ? 'Todos' : c}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-1.5 bg-gold hover:bg-gold-light text-ink font-bold text-sm px-4 py-2 rounded-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Novo produto
          </button>
        </div>

        {/* Table */}
        <div className="bg-navy border border-white/5 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-gold/40 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/20 text-sm">Nenhum produto cadastrado ainda.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-white/30 font-medium px-4 py-3">Produto</th>
                    <th className="text-left text-xs text-white/30 font-medium px-4 py-3 hidden md:table-cell">Categoria</th>
                    <th className="text-left text-xs text-white/30 font-medium px-4 py-3">Preço</th>
                    <th className="text-left text-xs text-white/30 font-medium px-4 py-3 hidden sm:table-cell">Estoque</th>
                    <th className="text-left text-xs text-white/30 font-medium px-4 py-3">Status</th>
                    <th className="text-right text-xs text-white/30 font-medium px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.$id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-8 rounded bg-ink overflow-hidden shrink-0">
                            {p.imageUrl
                              ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Package className="w-3 h-3 text-white/10" /></div>
                            }
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{p.name}</p>
                            <p className="text-xs text-white/30">{p.weight}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">{p.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-display text-gold text-sm font-bold">{fmt(p.price)}</span>
                        <span className="text-white/30 text-xs ml-1">/{p.unit}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-xs ${p.stock === null || p.stock === undefined ? 'text-white/30' : p.stock <= 0 ? 'text-red-400' : p.stock <= 5 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                          {p.stock === null || p.stock === undefined ? 'Ilimitado' : p.stock === 0 ? 'Sem estoque' : `${p.stock} un.`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggle(p)} className="transition-colors">
                          {p.active
                            ? <ToggleRight className="w-6 h-6 text-gold" />
                            : <ToggleLeft className="w-6 h-6 text-white/20" />
                          }
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setModal(p)} className="p-1.5 text-white/30 hover:text-gold hover:bg-gold/10 rounded transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p.$id)} className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  )
}
