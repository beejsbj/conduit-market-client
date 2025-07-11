import React from 'react'
import { useLocation } from 'wouter'
import MainLayout from '@/layouts/MainLayout'
import SimpleLayout from '@/layouts/SimpleLayout'

function getLayoutForPath(path: string) {
  if (path.startsWith('/auth') || path.startsWith('/zapout')) {
    return SimpleLayout
  }
  return MainLayout
}

class ErrorBoundaryImpl extends React.Component<
  {
    children: React.ReactNode
    Layout: React.ComponentType<{ children: React.ReactNode }>
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    const { Layout } = this.props
    if (this.state.hasError) {
      return (
        <Layout>
          <main className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="w-32 h-32 mb-6 flex items-center justify-center rounded-full bg-primary-600 text-white shadow-lg animate-bounce-slow">
              <span className="text-[5rem]">😵‍💫</span>
            </div>
            <h2 className="voice-4l font-bold text-red-700 mb-2 drop-shadow-lg animate-pulse">
              Something went wrong
            </h2>
            <pre className="bg-red-100 text-red-800 rounded p-4 mb-4 max-w-xl whitespace-pre-wrap break-words shadow-lg border border-red-200 animate-fade-in-slow">
              {this.state.error?.message}
            </pre>
            <button
              onClick={this.handleReload}
              className="mt-2 px-6 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-colors animate-fade-in"
            >
              Reload Page
            </button>
          </main>
        </Layout>
      )
    }
    return this.props.children
  }
}

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [location] = useLocation()
  const Layout = getLayoutForPath(location)
  return <ErrorBoundaryImpl Layout={Layout}>{children}</ErrorBoundaryImpl>
}

export default ErrorBoundary
