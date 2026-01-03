'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createHugeiconComponent } from '@hugeicons/react';
import {
  AccountSetting01Icon,
  CalculatorIcon as CalculatorSvg,
  Cancel01Icon,
  Home01Icon,
  InvoiceIcon,
  Menu01Icon,
} from '@hugeicons/core-free-icons';

const HomeIcon = createHugeiconComponent('HomeIcon', Home01Icon);
const CalculatorIcon = createHugeiconComponent('CalculatorIcon', CalculatorSvg);
const DocumentTextIcon = createHugeiconComponent('DocumentTextIcon', InvoiceIcon);
const Cog6ToothIcon = createHugeiconComponent('Cog6ToothIcon', AccountSetting01Icon);
const Bars3Icon = createHugeiconComponent('Bars3Icon', Menu01Icon);
const XMarkIcon = createHugeiconComponent('XMarkIcon', Cancel01Icon);

const navItems = [
  { href: '/', label: 'صفحه اصلی', icon: HomeIcon },
  { href: '/calculator', label: 'محاسبه‌گر', icon: CalculatorIcon },
  { href: '/invoices', label: 'فاکتورها', icon: DocumentTextIcon },
  { href: '/settings', label: 'تنظیمات', icon: Cog6ToothIcon },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <CalculatorIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              پیش‌فاکتور آسانسور
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white animate-slide-down">
          <div className="container mx-auto px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
