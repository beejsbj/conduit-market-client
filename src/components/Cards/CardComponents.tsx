export const Card = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export const CardTitle = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

export const CardDescription = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <p className={`mt-1 text-sm text-gray-600 ${className}`}>{children}</p>
}

export const CardContent = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>
}

export const CardFooter = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`p-4 bg-gray-50 ${className}`}>{children}</div>
}
