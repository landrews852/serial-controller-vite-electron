import { cn } from '../../lib/utils'

export const Button = ({
  children,
  onClick,
  color = 'primary',
  ...props
}: {
  children: string
  onClick: () => void
  color?: string
}): JSX.Element => {
  const colors = {
    primary: 'bg-blue-700 hover:bg-blue-600 focus:bg-blue-500 text-white',
    secondary: 'bg-white hover:bg-slate-200 focus:bg-slate-200 text-slate-900',
    transparent: 'bg-transparent hover:bg-white/10 focus:bg-white/15 text-white border border-white'
  }
  return (
    <button
      type="button"
      className={cn('font-bold py-2 px-4 rounded-3xl', colors[color])}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
