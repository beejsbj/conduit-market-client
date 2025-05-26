export const Badge = ({
  children,
  className = '',
  variant = 'default'
}: {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary'
}) => {
  const variantClasses = {
    default: 'bg-gray-800 text-gray-200',
    secondary: 'bg-gray-700 text-gray-200'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
