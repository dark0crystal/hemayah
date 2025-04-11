'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    // Remove locale from pathname for comparison
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');
    return '/' + pathWithoutLocale === path;
  };
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Check Applications', path: '/check' },
    { name: 'Analysis', path: '/analysis' },
  ];
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Social Protection Fund</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'border-b-2 border-blue-500 text-gray-900'
                      : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* User menu or other elements could go here */}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>
    </nav>
  );
} 