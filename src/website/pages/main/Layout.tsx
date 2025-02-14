// src/components/Layout/Layout.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Gamepad2, LogOut, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logoutUser } from '../../store/slice/user_slice';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force a navigation to "/" even if we're already there
    navigate('/', { replace: true });
    // Dispatch a custom event that ExploreView can listen for
    window.dispatchEvent(new CustomEvent('resetExplore'));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Logo Bar - Simplified */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-lg z-40">
        <div className="container mx-auto flex justify-between items-center h-14 px-4">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                <path
                  fill="currentColor"
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">
              educasm
            </span>
          </a>

          {/* User Info and Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-200">
                  {user.name || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-14 mb-[5.5rem]">
        <div className="max-w-4xl mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg 
        border-t border-gray-800 z-40">
        <div className="flex justify-around items-center h-12 max-w-4xl mx-auto">
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-lg
              transition-colors ${location.pathname === '/'
                ? 'text-primary'
                : 'text-gray-400 hover:text-gray-300'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Explore</span>
          </Link>

          <Link
            to="/playground"
            className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-lg
              transition-colors ${location.pathname === '/playground'
                ? 'text-primary'
                : 'text-gray-400 hover:text-gray-300'}`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-[10px]">Playground</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
