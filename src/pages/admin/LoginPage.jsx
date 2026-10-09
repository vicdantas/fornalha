import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Logo } from '../../components/Logo'
import { Button } from '../../components/ui/Button'

const INPUT_CLS =
  'h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-ring/30'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size={72} />
          <p className="mt-4 font-display text-2xl font-semibold leading-none">Fornalha</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Área de gestão
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs text-muted-foreground">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs text-muted-foreground">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`${INPUT_CLS} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-1 h-11 w-full">
            {loading && <Loader2 className="animate-spin" />}
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs">
          <a href="/" className="text-muted-foreground transition-colors hover:text-primary">
            ← Voltar à loja
          </a>
        </p>
      </div>
    </main>
  )
}
