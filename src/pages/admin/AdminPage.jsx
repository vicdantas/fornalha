import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../../lib/appwrite'
import { Logo } from '../../components/Logo'
import { CATEGORIES, CATEGORY_LABEL, UNITS, unitLabel } from '../../lib/catalog'
import {
  Plus, Pencil, Trash2, LogOut, X, Loader2,
  Package, DollarSign, Tag, ToggleLeft, ToggleRight, ArrowLeft, ImagePlus
} from 'lucide-react'

const EMPTY = {
  name: '', category: 'bovino', weight: '', description: '',
  price: '', unit: 'kg', badge: '', stock: '', imageUrl: '', order: 0, active: true
}
const BADGES = ['', 'Top venda', 'Dry Aged', 'Importado', 'Exclusivo', 'Novo', 'Kit', 'Oferta']

function fmt(n) { return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      set('imageUrl', await uploadProductImage(file))
    } catch (err) {
      alert('Erro ao enviar a foto: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

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

  const inputCls = "w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
  const labelCls = "block text-xs text-muted-foreground mb-1"

  return (
    <div className="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display text-primary font-bold tracking-wide text-sm">
            {product ? 'Editar produto' : 'Novo produto'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
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
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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
                {UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
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
              <label className={labelCls}>Foto</label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-md bg-background border border-border overflow-hidden shrink-0 flex items-center justify-center">
                  {uploading
                    ? <Loader2 className="w-5 h-5 text-primary/60 animate-spin" />
                    : form.imageUrl
                      ? <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                      : <ImagePlus className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <label className={`cursor-pointer border border-border hover:border-primary/40 text-foreground px-3 py-1.5 rounded-md text-xs transition-colors ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                    {form.imageUrl ? 'Trocar foto' : 'Escolher foto'}
                    <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
                  </label>
                  {form.imageUrl && !uploading && (
                    <button type="button" onClick={() => set('imageUrl', '')} className="text-xs text-muted-foreground hover:text-red-400 transition-colors">
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Ordem de exibição</label>
              <input type="number" value={form.order} onChange={e => set('order', e.target.value)} placeholder="0" className={inputCls} />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <button type="button" onClick={() => set('active', !form.active)} className="text-primary">
                  {form.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                </button>
                <span className="text-xs text-muted-foreground">{form.active ? 'Produto ativo' : 'Produto oculto'}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="flex-1 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 py-2 rounded-md text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving || uploading}className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-gold-200 disabled:opacity-50 text-primary-foreground font-bold py-2 rounded-md text-sm transition-colors">
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
  const [onlyNoPhoto, setOnlyNoPhoto] = useState(false)
  const [uploadingId, setUploadingId] = useState(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts(null, { includeInactive: true }),
  })

  const filtered = products.filter(p =>
    (catFilter === 'all' || p.category === catFilter) && (!onlyNoPhoto || !p.imageUrl),
  )

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

  // Foto direto da lista: escolhe o arquivo e já grava no produto, sem abrir o formulário.
  const handleRowImage = async (p, e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadingId(p.$id)
    try {
      await updateProduct(p.$id, { imageUrl: await uploadProductImage(file) })
      await invalidate()
    } catch (err) {
      alert('Erro ao enviar a foto: ' + err.message)
    } finally {
      setUploadingId(null)
    }
  }

  const handleLogout = async () => { await logout(); navigate('/admin/login') }

  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    outOfStock: products.filter(p => p.stock !== null && p.stock !== undefined && p.stock <= 0).length,
    noPhoto: products.filter(p => !p.imageUrl).length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Nav */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Painel de gestão</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 px-2.5 py-1.5 rounded-md transition-all">
              <ArrowLeft className="w-3 h-3" /> Loja
            </a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 border border-border hover:border-red-500/40 px-2.5 py-1.5 rounded-md transition-all">
              <LogOut className="w-3 h-3" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total de produtos', value: stats.total, icon: Package },
            { label: 'Produtos ativos', value: stats.active, icon: Tag },
            { label: 'Sem estoque', value: stats.outOfStock, icon: DollarSign },
            { label: 'Sem foto', value: stats.noPhoto, icon: ImagePlus },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-4">
              <Icon className="w-4 h-4 text-primary/60 mb-2" />
              <p className="font-display text-2xl font-bold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex gap-2 overflow-x-auto">
            {[{ id: 'all', label: 'Todos' }, ...CATEGORIES].map(c => (
              <button key={c.id} onClick={() => setCatFilter(c.id)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-md transition-colors ${catFilter === c.id ? 'bg-primary text-primary-foreground font-bold' : 'border border-border text-muted-foreground hover:text-foreground'}`}>
                {c.label}
              </button>
            ))}
            <button onClick={() => setOnlyNoPhoto(v => !v)}
              className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${onlyNoPhoto ? 'bg-primary text-primary-foreground font-bold' : 'border border-dashed border-border text-muted-foreground hover:text-foreground'}`}>
              <ImagePlus className="w-3 h-3" /> Sem foto ({stats.noPhoto})
            </button>
          </div>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-1.5 bg-primary hover:bg-gold-200 text-primary-foreground font-bold text-sm px-4 py-2 rounded-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Novo produto
          </button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-primary/60 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              {products.length === 0 ? 'Nenhum produto cadastrado ainda.' : 'Nenhum produto neste filtro.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Produto</th>
                    <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden md:table-cell">Categoria</th>
                    <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Preço</th>
                    <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3 hidden sm:table-cell">Estoque</th>
                    <th className="text-left text-xs text-muted-foreground font-medium px-4 py-3">Status</th>
                    <th className="text-right text-xs text-muted-foreground font-medium px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.$id} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <label
                            title={p.imageUrl ? 'Trocar foto' : 'Adicionar foto'}
                            className={`group relative w-12 h-12 rounded-md bg-background overflow-hidden shrink-0 cursor-pointer border ${p.imageUrl ? 'border-transparent' : 'border-dashed border-primary/40'} ${uploadingId ? 'pointer-events-none' : ''}`}
                          >
                            {uploadingId === p.$id
                              ? <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-4 h-4 text-primary animate-spin" /></div>
                              : p.imageUrl
                                ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><ImagePlus className="w-4 h-4 text-primary/70" /></div>
                            }
                            {p.imageUrl && uploadingId !== p.$id && (
                              <span className="absolute inset-0 flex items-center justify-center bg-overlay opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImagePlus className="w-4 h-4 text-foreground" />
                              </span>
                            )}
                            <input type="file" accept="image/*" onChange={e => handleRowImage(p, e)} className="sr-only" />
                          </label>
                          <div>
                            <p className="font-medium text-foreground text-sm">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.weight}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{CATEGORY_LABEL[p.category] ?? p.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-display text-primary text-sm font-bold">{fmt(p.price)}</span>
                        <span className="text-muted-foreground text-xs ml-1">/{unitLabel(p.unit)}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-xs ${p.stock === null || p.stock === undefined ? 'text-muted-foreground' : p.stock <= 0 ? 'text-red-400' : p.stock <= 5 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                          {p.stock === null || p.stock === undefined ? 'Ilimitado' : p.stock === 0 ? 'Sem estoque' : `${p.stock} un.`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggle(p)} className="transition-colors">
                          {p.active
                            ? <ToggleRight className="w-6 h-6 text-primary" />
                            : <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                          }
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setModal(p)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(p.$id)} className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded transition-all">
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
