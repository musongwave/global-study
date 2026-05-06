import { cn } from '../../lib/cn'

type Variant = 'gold' | 'outline-gold' | 'light' | 'outline-light'

const base =
  'inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer'

const variants: Record<Variant, string> = {
  gold: 'bg-gold text-black hover:bg-gold-dark',
  'outline-gold': 'border border-gold text-gold hover:bg-gold hover:text-black',
  light: 'bg-white text-black hover:bg-gray-100',
  'outline-light': 'border border-white/80 text-white hover:bg-white hover:text-black',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
}

export function Button({ variant = 'gold', className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />
}

export function LinkButton({ variant = 'gold', className, ...props }: LinkButtonProps) {
  return <a className={cn(base, variants[variant], className)} {...props} />
}
