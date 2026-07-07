import { cn } from '../../lib/cn'

type Variant = 'gold' | 'outline-gold' | 'light' | 'outline-light' | 'glass'

const base =
  'inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm btn-spring cursor-pointer'

const variants: Record<Variant, string> = {
  gold: 'bg-gradient-to-b from-[#e8c65a] to-[#c9a22e] text-black shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_8px_24px_-8px_rgba(212,175,55,.6)] hover:from-[#f0d06a] hover:to-[#d4af37]',
  'outline-gold': 'border border-gold text-gold hover:bg-gold hover:text-black',
  light:
    'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-100',
  'outline-light':
    'border border-gray-300 dark:border-white/80 text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black',
  glass:
    'border border-white/30 text-white bg-white/5 backdrop-blur-md hover:bg-white/15',
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
