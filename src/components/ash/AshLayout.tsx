import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'finance' | 'support' | 'client';
  status: string;
  avatar_url?: string;
  company_name?: string;
}

interface AshContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AshContext = createContext<AshContextType | undefined>(undefined);

export const useAsh = () => {
  const context = useContext(AshContext);
  if (!context) {
    throw new Error('useAsh must be used within AshProvider');
  }
  return context;
};

interface AshProviderProps {
  children: React.ReactNode;
}

export const AshProvider: React.FC<AshProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // محاولة جلب بيانات المستخدم من localStorage
    const savedUser = localStorage.getItem('ash_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ash_user');
      }
    }
    setIsLoading(false);
  }, []);

  const updateUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('ash_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('ash_user');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ash_user');
    localStorage.removeItem('ash_session');
    window.location.href = '/';
  };

  return (
    <AshContext.Provider value={{ user, setUser: updateUser, logout, isLoading }}>
      {children}
    </AshContext.Provider>
  );
};

interface AshLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AshLayout: React.FC<AshLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${className}`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDEwIDEwIEwgNTAgMTAgTCA1MCA1MCBMIDE0IDUwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-20"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};