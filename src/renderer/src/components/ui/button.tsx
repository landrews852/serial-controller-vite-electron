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
    primary: 'bg-blue-700 hover:bg-blue-600 text-white',
    secondary: 'bg-white hover:bg-slate-200 text-slate-900'
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
