import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Users, Home, History, LogOut, LogIn } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-reverse space-x-8">
              <Link 
                to="/" 
                className="text-xl font-bold hover:text-blue-200 transition-colors"
              >
                فرق التحفيظ
              </Link>
              
              <div className="hidden md:flex items-center space-x-reverse space-x-6">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') ? 'bg-blue-800' : 'hover:bg-blue-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>الرئيسية</span>
                </Link>
                
                {isAdmin && (
                  <>
                    <Link 
                      to="/members" 
                      className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/members') ? 'bg-blue-800' : 'hover:bg-blue-800'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>إدارة الأعضاء</span>
                    </Link>
                    
                    <Link 
                      to="/history" 
                      className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/history') ? 'bg-blue-800' : 'hover:bg-blue-800'
                      }`}
                    >
                      <History className="w-4 h-4" />
                      <span>سجل الفرق</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              {isAdmin ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-reverse space-x-2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-reverse space-x-2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 rounded-md transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}