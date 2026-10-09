import logoUrl from '../assets/fornalha-logo.png'

export function Logo({ size = 40, className = '' }) {
  return (
    <img
      src={logoUrl}
      alt="Fornalha Boutique de Carnes"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-md object-cover ${className}`}
    />
  )
}
