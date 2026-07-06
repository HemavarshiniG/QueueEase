import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
      <p className="text-2xl font-bold tracking-tight mb-2">Page Not Found</p>
      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  )
}
