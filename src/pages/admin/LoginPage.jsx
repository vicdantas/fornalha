import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

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
    } catch (err) {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size={52} />
          <p className="font-display text-gold font-bold tracking-widest text-lg mt-3">FORNALHA</p>
          <p className="text-xs text-white/20 tracking-widest uppercase mt-1">Área de Gestão</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-navy border border-white/5 rounded-lg p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full bg-ink border border-white/10 text-white placeholder-white/20 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-ink border border-white/10 text-white placeholder-white/20 rounded-md px-3 py-2.5 pr-10 text-sm outline-none focus:border-gold/40 transition-colors"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light disabled:opacity-50 text-ink font-bold py-2.5 rounded-md transition-colors mt-1"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-white/15 mt-6">
          <a href="/" className="hover:text-white/30 transition-colors">← Voltar à loja</a>
        </p>
      </div>
    </div>
  )
}
