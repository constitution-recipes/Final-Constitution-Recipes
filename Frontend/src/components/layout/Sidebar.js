'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Plus,
  History,
  FileText,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSessionId = searchParams.get('session');
  const [expandHistory, setExpandHistory] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);

  // 클라이언트 사이드에서만 mounted 상태 업데이트
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // mounted, user, 또는 sessionId 변경 시 세션 목록 재조회
    if (mounted && user?.id) {
      // 백엔드에서 세션 목록 가져오기
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/session/${user.id}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setChatSessions(data))
        .catch(err => console.error('세션 목록 조회 오류:', err));
    }
  }, [mounted, user, currentSessionId]);

  // 세션 삭제 처리
  const handleDeleteSession = async (id) => {
    if (confirm('정말 이 채팅 기록을 삭제하시겠습니까?')) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/session/${id}`,
          { method: 'DELETE', credentials: 'include' }
        );
        // 목록에서 제거
        setChatSessions(prev => prev.filter(s => s.id !== id));
        // 현재 세션 삭제된 경우 기본 화면으로 이동
        if (currentSessionId === id) {
          window.location.href = '/chatbot';
        }
      } catch (e) {
        console.error('세션 삭제 오류:', e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/20">
      {/* 로고 영역 */}
      <div className="p-5 border-b border-border/40 flex items-center justify-center">
        <Link href="/chatbot" className="flex items-center">
          <MessageSquare className="h-6 w-6 mr-2 text-primary" />
          <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary to-secondary">ChiDiet 챗봇</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 overflow-hidden flex flex-col">
        {/* 새 채팅 버튼 */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90 shadow-sm"
            onClick={() => {
              // 새 채팅: 세션 생성 없이 채팅 페이지로 이동
              window.location.href = '/chatbot';
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>새 채팅</span>
          </motion.button>
        </div>
        
        {/* 채팅 히스토리 섹션 */}
        <div className="space-y-1">
          <button 
            onClick={() => setExpandHistory(!expandHistory)} 
            className="flex items-center justify-between w-full py-2 px-3 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
          >
            <div className="flex items-center">
              <History className="h-4 w-4 mr-3 text-primary/70" />
              <span>채팅 기록</span>
            </div>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${expandHistory ? 'rotate-180' : ''}`}
            />
          </button>
          
          <AnimatePresence>
            {expandHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="max-h-[calc(100vh-240px)] overflow-y-auto pr-2 space-y-1 pl-4 mt-1">
                  {chatSessions.length > 0 ? (
                    chatSessions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between">
                        <Link
                          href={`/chatbot?session=${s.id}`}
                          className={`flex items-center flex-1 group py-2 px-3 rounded-lg text-sm transition-colors ${
                            pathname === `/chatbot` && currentSessionId === s.id
                              ? 'bg-primary/10 text-primary' 
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span className="truncate">
                            {s.title || `채팅 ${s.id.slice(-4)}`}
                          </span>
                        </Link>
                        <button
                          onClick={() => handleDeleteSession(s.id)}
                          className="text-sm text-red-500 hover:text-red-700 ml-2"
                          aria-label="삭제"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">채팅 기록이 없습니다</p>
                      <p className="text-xs text-muted-foreground/70">새 채팅 버튼을 눌러 대화를 시작해보세요</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* 하단 정보 영역 */}
      <div className="p-4 text-center text-xs text-muted-foreground border-t border-border/40">
        <p>© 2025 ChiDiet</p>
        <p className="mt-1">한의학 기반 맞춤형 식단 제안 서비스</p>
      </div>
    </div>
  );
} 