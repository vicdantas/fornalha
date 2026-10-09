import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Clock, Flame, MapPin, Phone, Search } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { ProductCard } from '../components/ProductCard'
import { CartDrawer } from '../components/CartDrawer'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { InstagramIcon } from '../components/ui/icons'
import { getProducts } from '../lib/appwrite'
import { CATEGORIES as CATALOG_CATEGORIES } from '../lib/catalog'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1920&q=80'

const CATEGORIES = [{ id: 'all', label: 'Todos' }, ...CATALOG_CATEGORIES]

export default function StorePage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', category],
    queryFn: () => getProducts(category),
    staleTime: 30_000,
  })

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    if (!term) return products
    return products.filter(p =>
      `${p.name} ${p.description ?? ''}`.toLocaleLowerCase('pt-BR').includes(term),
    )
  }, [products, search])

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar onSearch={setSearch} />
      <CartDrawer />

      {/* HERO */}
      <section className="relative min-h-[540px] overflow-hidden border-b border-border bg-[radial-gradient(120%_120%_at_72%_45%,#4a2a0c_0%,#1c1008_48%,#0b0706_100%)]">
        <img
          src={HERO_IMAGE}
          alt="Cortes grelhando sobre a brasa"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-center px-4 py-20 sm:px-6">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Flame className="size-4" /> Boutique de carnes
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.98] sm:text-7xl">
              Cortes que acendem grandes momentos.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-foreground/75 sm:text-lg">
              Seleção cuidadosa, procedência e sabor para o seu churrasco. Escolha seus cortes e
              peça direto pelo WhatsApp.
            </p>
            <Button as="a" href="#catalogo" size="lg" className="mt-8">
              Ver catálogo <ChevronRight />
            </Button>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Seleção Fornalha
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-gold-200 sm:text-4xl">
              Escolha seu corte
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Preços demonstrativos sujeitos à confirmação.
            </p>
          </div>

          <div className="relative md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cortes..."
              aria-label="Buscar produtos"
              className="h-11 w-full rounded-md border border-input bg-secondary pl-10 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Categorias">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={category === cat.id ? 'default' : 'secondary'}
              onClick={() => setCategory(cat.id)}
              className="shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-border bg-card"
              >
                <div className="aspect-square bg-secondary" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded bg-secondary" />
                  <div className="h-4 w-2/3 rounded bg-secondary" />
                  <div className="h-9 rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="border-y border-border py-20 text-center">
            <p className="text-lg font-semibold">Não foi possível carregar o catálogo.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifique as configurações do Appwrite e tente novamente.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-y border-border py-20 text-center">
            <p className="text-lg font-semibold">Nenhum corte encontrado.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearch('')
                setCategory('all')
              }}
            >
              Limpar busca
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map(p => (
              <ProductCard key={p.$id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* FAIXA DE MARCA */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Do balcão para a brasa
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-gold-200 sm:text-4xl">
              Escolhido por quem entende de carne.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Na Fornalha, cada corte é escolhido com atenção à procedência, ao marmoreio e ao ponto
            perfeito para o preparo. Seu pedido é separado com cuidado e confirmado pessoalmente
            pela nossa equipe.
          </p>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_auto]">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={48} />
              <div>
                <p className="font-display text-lg font-semibold leading-none">Fornalha</p>
                <p className="mt-1 text-xs text-muted-foreground">Boutique de Carnes</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Cortes selecionados com critério. Procedência rastreada, maturação própria e entrega
              no mesmo dia.
            </p>
            <a
              href="https://instagram.com/fornalhaboutique"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
            >
              <InstagramIcon className="size-4" /> @fornalhaboutique
            </a>
          </div>

          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="leading-6">
                Rua Benjamin Capusso, 206 — Vila Curuçá Velha
                <br />
                São Paulo · SP · 08031-760
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-primary" />
              <span>Segunda a sábado, 8h às 18h</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-primary" />
              <a
                href="https://wa.me/5511952176125"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-primary"
              >
                (11) 95217-6125
              </a>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/CdknGSixGQ7L7YAR6"
            target="_blank"
            rel="noreferrer"
            className="flex h-32 w-full flex-col justify-between rounded-lg border border-border bg-card p-4 transition hover:border-primary/40 lg:w-56"
          >
            <MapPin className="size-5 text-primary" />
            <span>
              <span className="block text-sm font-semibold">Ver no mapa</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Vila Curuçá Velha · São Paulo
              </span>
            </span>
          </a>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fornalha Boutique de Carnes. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  )
}
