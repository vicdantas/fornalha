const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ' +
  'transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 ' +
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
  '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none'

const VARIANTS = {
  default: 'bg-primary text-primary-foreground shadow hover:bg-gold-200',
  outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-foreground',
  secondary: 'bg-secondary text-foreground shadow-sm hover:bg-accent',
  ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive: 'text-muted-foreground hover:bg-red-500/10 hover:text-red-400',
  whatsapp: 'bg-whatsapp text-[#04210f] font-bold shadow hover:bg-whatsapp-dark hover:text-white',
}

const SIZES = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-12 rounded-md px-6 text-base',
  icon: 'h-9 w-9',
  'icon-sm': 'h-7 w-7',
}

export function Button({
  as: Comp = 'button',
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) {
  const type = Comp === 'button' && props.type === undefined ? 'button' : props.type

  return (
    <Comp
      {...props}
      type={type}
      className={[BASE, VARIANTS[variant] ?? VARIANTS.default, SIZES[size] ?? SIZES.default, className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
