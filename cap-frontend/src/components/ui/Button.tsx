import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-3'
  const variants: Record<NonNullable<Props['variant']>, string> = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

