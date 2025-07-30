import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Users, Home, History, LogOut, LogIn, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { signOut, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-reverse space-x-8">
              <Link 
                to="/" 
                className="text-xl font-bold hover:text-blue-200 transition-colors"
                onClick={closeMobileMenu}
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
              {/* Mobile menu button */}
              {isAdmin && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-4"
                >
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              )}
              
              {/* Desktop auth button */}
              <div className="hidden md:block">
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
          
          {/* Mobile menu */}
          {isMobileMenuOpen && isAdmin && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-800">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/') ? 'bg-blue-800' : 'hover:bg-blue-800'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Home className="w-5 h-5" />
                  <span>الرئيسية</span>
                </Link>
                
                <Link 
                  to="/members" 
                  className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/members') ? 'bg-blue-800' : 'hover:bg-blue-800'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Users className="w-5 h-5" />
                  <span>إدارة الأعضاء</span>
                </Link>
                
                <Link 
                  to="/history" 
                  className={`flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/history') ? 'bg-blue-800' : 'hover:bg-blue-800'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <History className="w-5 h-5" />
                  <span>سجل الفرق</span>
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition-colors w-full text-right"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}