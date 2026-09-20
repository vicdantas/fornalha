import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ChevronRight, MapPin, Clock, Phone } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { ProductCard } from '../components/ProductCard'
import { CartDrawer } from '../components/CartDrawer'
import { getProducts } from '../lib/appwrite'
import { Logo } from '../components/Logo'

const CATEGORIES = [
  { id: 'all',       label: 'Todos' },
  { id: 'ofertas',   label: 'Ofertas' },
  { id: 'bovino',    label: 'Bovinos' },
  { id: 'premium',   label: 'Premium' },
  { id: 'dryaged',   label: 'Dry Aged' },
  { id: 'kit',       label: 'Kits' },
  { id: 'suino',     label: 'Suínos' },
  { id: 'embutidos', label: 'Embutidos' },
]

export default function StorePage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', category],
    queryFn: () => getProducts(category),
    staleTime: 30_000,
  })

  const filtered = useMemo(() => {
    if (!search) return products
    const s = search.toLowerCase()
    return products.filter(p => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s))
  }, [products, search])

  return (
    <div className="min-h-screen bg-ink">
      <Navbar onSearch={setSearch} />
      <CartDrawer />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent z-10" />
        {/* Background image placeholder — substitua por uma foto real */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1400&q=80')" }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 md:py-28">
          <p className="flex items-center gap-2 text-gold text-xs font-semibold tracking-widest uppercase mb-5">
            <span className="w-5 h-px bg-gold" />
            Boutique de Carnes
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight max-w-lg mb-5">
            Cortes que acendem<br />grandes momentos.
          </h1>
          <p className="text-white/50 text-base max-w-sm leading-relaxed mb-8">
            Seleção cuidadosa, procedência e sabor para o seu churrasco. Escolha seus cortes e peça direto pelo WhatsApp.
          </p>
          <a
            href="#catalogo"
            className="inline-flex items-center gap-2 border border-gold/40 hover:border-gold text-gold text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            Ver catálogo <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] font-bold tracking-widest uppercase text-gold mb-1">Seleção Fornalha</p>
          <h2 className="font-display text-2xl md:text-3xl text-white font-semibold">Escolha seu corte</h2>
          <p className="text-xs text-white/30 mt-1">Preços demonstrativos sujeitos à confirmação.</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat.id
                  ? 'bg-gold text-ink font-bold'
                  : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile search */}
        <div className="relative mb-5 md:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Buscar cortes..."
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-navy border border-white/8 text-white placeholder-white/20 rounded-md pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold/30 transition-colors"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-navy rounded-lg aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">Erro ao carregar produtos.</p>
            <p className="text-white/20 text-xs mt-1">Verifique as configurações do Appwrite.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(p => <ProductCard key={p.$id} product={p} />)}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-navy border-t border-white/5 mt-16 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Logo size={36} />
                <div>
                  <p className="font-display text-gold font-bold tracking-widest text-sm">FORNALHA</p>
                  <p className="text-[9px] text-gold/30 tracking-widest uppercase">Boutique de Carnes</p>
                </div>
              </div>
              <p className="text-xs text-white/20 max-w-xs mt-3 leading-relaxed">
                Cortes selecionados com critério. Procedência rastreada, maturação própria e entrega no mesmo dia.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm text-white/40">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold/50 shrink-0 mt-0.5" />
                <span>Rua Benjamin Capusso, 206 — Vila Curuçá Velha<br />São Paulo · SP · 08031-760</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold/50 shrink-0" />
                <span>Segunda a Sábado, 8h às 18h</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold/50 shrink-0" />
                <a
                  href="https://wa.me/5511952176125"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  (11) 95217-6125
                </a>
              </div>
            </div>

            <div>
              <a
                href="https://maps.app.goo.gl/CdknGSixGQ7L7YAR6"
                target="_blank"
                rel="noreferrer"
                className="block w-48 h-28 rounded-lg overflow-hidden border border-white/5 hover:border-gold/20 transition-colors"
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Rua+Benjamin+Capusso,206,São+Paulo"
                  title="Localização Fornalha"
                />
              </a>
            </div>
          </div>
          <div className="border-t border-white/5 mt-10 pt-5 text-center text-xs text-white/15">
            © 2025 Fornalha Boutique de Carnes. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
