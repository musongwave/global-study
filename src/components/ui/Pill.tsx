import { cn } from '../../lib/cn'

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Pill({ active, className, ...props }: PillProps) {
  return (
    <button
      className={cn(
        'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
        active
          ? 'bg-gold text-black'
          : 'border border-white/20 text-white/60 hover:border-gold/50 hover:text-white',
        className
      )}
      {...props}
    />
  )
}
