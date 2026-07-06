import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight text-primary">
            QueueEase Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/admin/dashboard" className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium">
            Dashboard
          </Link>
          <Link to="/" className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium">
            View Live Site
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={() => navigate('/admin/login')}
            className="w-full text-left px-4 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-8 bg-card">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Logged in as Admin</span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
