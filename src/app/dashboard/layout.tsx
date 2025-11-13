'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Novo pedido #1234 recebido', read: false },
    { id: 2, message: 'Pedido #1230 foi entregue', read: false },
    { id: 3, message: 'Estoque baixo: Produto X', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pedidos', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Cardápio', href: '/dashboard/products', icon: Package },
    { name: 'Clientes', href: '/dashboard/customers', icon: Users },
    { name: 'Atendimento', href: '/dashboard/atendimento', icon: MessageSquare },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
  ];

  // Carregar tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Função para alternar tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast.success(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`);
  };

  // Função de logout
  const handleLogout = () => {
    // Limpar dados de autenticação
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    
    // Mostrar notificação
    toast.success('Logout realizado com sucesso!');
    
    // Redirecionar para login após 500ms
    setTimeout(() => {
      router.push('/login');
    }, 500);
  };

  // Marcar notificação como lida
  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center justify-between px-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Anota
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Sistema de Pedidos
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-orange-400'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive 
                      ? 'text-white' 
                      : theme === 'dark'
                      ? 'text-gray-400 group-hover:text-orange-400'
                      : 'text-gray-400 group-hover:text-orange-600'
                  }`}
                />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Admin
              </p>
              <p className={`text-xs truncate ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                admin@anota.com
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className={`h-16 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b sticky top-0 z-30`}>
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar pedidos, produtos, clientes..."
                  className={`w-full pl-12 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Botão de Tema */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-orange-600 hover:bg-gray-100'
                }`}
                title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>

              {/* Botão de Notificações */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Notificações"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown de Notificações */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Notificações
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Nenhuma notificação
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              toast.info(notif.message);
                            }}
                            className={`w-full px-4 py-3 text-left transition-colors border-b ${
                              notif.read
                                ? theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700'
                                  : 'bg-gray-50 border-gray-100'
                                : theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                : 'bg-blue-50 border-blue-100 hover:bg-blue-100'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notif.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {notif.message}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`p-4 lg:p-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
