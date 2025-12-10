import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { open } from '@web3modal/wagmi/react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo: string;
  navItems: NavItem[];
  cta: {
    label: string;
    action: () => void;
  };
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  logo,
  navItems,
  cta,
  className,
}) => {
  const { isConnected, address } = useAccount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        {
          'bg-white/80 backdrop-blur-md shadow-medium': isScrolled,
          'bg-transparent': !isScrolled,
        },
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="font-bold text-xl text-neutral-900">{logo}</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-medium text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {cta.label === 'Connect Wallet' ? (
              isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-700">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <Button onClick={() => open()} variant="outline" size="sm">
                    Switch
                  </Button>
                </div>
              ) : (
                <Button onClick={() => open()} variant="solid" size="sm">
                  Connect Wallet
                </Button>
              )
            ) : (
              <Button onClick={cta.action} variant="solid" size="sm">
                {cta.label}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-neutral-200 inline-flex items-center justify-center p-2 rounded-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-large">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-neutral-700 hover:text-primary-600 block px-3 py-2 rounded-medium text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="px-3 py-2">
              {cta.label === 'Connect Wallet' ? (
                isConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-700">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <Button onClick={() => open()} variant="outline" size="sm">
                      Switch
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => open()} variant="solid" size="sm" className="w-full">
                    Connect Wallet
                  </Button>
                )
              ) : (
                <Button
                  onClick={() => {
                    cta.action();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="solid"
                  size="sm"
                  className="w-full"
                >
                  {cta.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };