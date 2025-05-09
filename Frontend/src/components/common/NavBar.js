'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChefHat, 
  Heart, 
  User, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logout } = useAuth();
  
  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 페이지 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // 홈, 로그인, 회원가입에서는 NavBar를 렌더링하지 않음
  if (
    pathname === '/' ||
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup')
  ) {
    return null;
  }

  const menus = [
    { name: '챗봇', icon: <MessageSquare className="w-5 h-5" />, href: '/chatbot' },
    { name: '맞춤 레시피', icon: <ChefHat className="w-5 h-5" />, href: '/recommend_recipes' },
    { name: '저장함', icon: <Heart className="w-5 h-5" />, href: '/saved' },
    { name: '프로필', icon: <User className="w-5 h-5" />, href: '/profile' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-md' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* 로고 */}
            <Link 
              href="/" 
              className="flex items-center transition-opacity hover:opacity-90"
            >
              <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary via-primary to-secondary">
                ChiDiet
              </span>
            </Link>

            {/* 데스크탑 메뉴 */}
            <nav className="hidden md:flex items-center space-x-1">
              {menus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === menu.href || 
                    (menu.href !== '/' && pathname.startsWith(menu.href))
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {menu.icon}
                  <span className="ml-2">{menu.name}</span>
                </Link>
              ))}
            </nav>

            {/* 로그아웃 버튼 */}
            <div className="hidden md:flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive/90 hover:bg-destructive/10" 
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>로그아웃</span>
              </Button>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden p-2 rounded-lg text-foreground/80 hover:bg-muted focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 pt-16 bg-white/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col p-4 space-y-1">
              {menus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    pathname === menu.href || 
                    (menu.href !== '/' && pathname.startsWith(menu.href))
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {menu.icon}
                  <span className="ml-3">{menu.name}</span>
                </Link>
              ))}
              
              <hr className="my-2 border-border/50" />
              
              <button
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-destructive/80 hover:bg-destructive/10 transition-all"
                onClick={logout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>로그아웃</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 컨텐츠 공간 확보를 위한 패딩 */}
      <div className="h-16"></div>
    </>
  );
} 