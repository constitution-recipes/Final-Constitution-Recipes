'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 사이드바는 채팅 페이지에서만 표시
  const isChatPage = pathname && pathname.startsWith('/chatbot');

  // 모바일에서는 기본적으로 닫힌 상태로 시작
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setSidebarOpen(window.innerWidth >= 768);
    }
  }, []);

  if (!mounted) return null;

  if (!isChatPage) {
    // 채팅 페이지가 아닌 경우 사이드바 없이 컨텐츠만 표시
    return (
      <div className="min-h-screen bg-gradient-primary">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-primary relative">
      {/* 모바일에서만 보이도록 md:hidden 추가 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-24 right-6 z-50 py-2.5 px-4 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 md:hidden flex items-center gap-2 group"
        aria-label={sidebarOpen ? "닫기" : "채팅 기록 열기"}
      >
        <Menu className="h-5 w-5" />
        <span className="font-medium text-sm">채팅 기록</span>
      </button>

      {/* 데스크탑 및 모바일에서 사이드바를 고정 표시 */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 h-full z-40 w-80 md:w-72 bg-white shadow-xl">
          <Sidebar />
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 min-h-screen ml-0 md:ml-72 transition-all duration-300">
        {children}
      </div>

      {/* 사이드바가 열려있을 때 모바일에서 배경 오버레이 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
} 