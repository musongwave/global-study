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
          : 'border border-gray-300 dark:border-white/20 text-gray-500 dark:text-white/60 hover:border-gold/50 hover:text-gray-900 dark:hover:text-white',
        className
      )}
      {...props}
    />
  )
}
