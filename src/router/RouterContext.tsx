/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export type AppRoute =
  | '/'
  | '/meet-pip'
  | '/dream-making'
  | '/projects'
  | '/origin-story'
  | '/goodnight'
  | '/signin';

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

// Normalize path by stripping trailing slash (except root) and resolving hash fallback if needed
function normalizePath(rawPath: string): string {
  // If hash is used as fallback (e.g. #/projects), prioritize it
  if (window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1).replace(/\/+$/, '') || '/';
  }

  const clean = rawPath.split('?')[0].split('#')[0];
  if (clean === '' || clean === '/') return '/';
  return clean.replace(/\/+$/, '') || '/';
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => {
      const next = normalizePath(window.location.pathname);
      setCurrentPath(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleHashChange = () => {
      const next = normalizePath(window.location.pathname);
      setCurrentPath(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    const normalized = normalizePath(to);
    if (normalized === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      window.history.pushState({}, '', normalized);
    } catch {
      // Fallback to hash if pushState fails in certain sandboxed environments
      window.location.hash = normalized;
    }

    setCurrentPath(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  children: ReactNode;
  activeClassName?: string;
}

export const Link: React.FC<LinkProps> = ({
  to,
  className = '',
  activeClassName = 'active-nav-link',
  children,
  onClick,
  ...rest
}) => {
  const { currentPath, navigate } = useRouter();
  const normalizedTarget = normalizePath(to);
  const isActive = currentPath === normalizedTarget;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a
      href={normalizedTarget}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};
