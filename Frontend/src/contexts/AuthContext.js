'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/services/authService';
import { userService } from '@/lib/services/userService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// 기본 상태 값
const defaultState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  refreshUser: async () => {},
};

// Context 생성
export const AuthContext = createContext(defaultState);

/**
 * 인증 상태를 관리하는 AuthProvider 컴포넌트
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 사용자 정보 갱신 함수
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 마운트 시 인증 상태 확인 (refreshUser 호출)
  useEffect(() => {
    refreshUser();
  }, []);

  /**
   * 로그인 함수
   * @param {string} email - 이메일
   * @param {string} password - 비밀번호
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await authService.login(email, password);
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      toast.success('로그인에 성공했습니다!');
      return currentUser;
    } catch (error) {
      toast.error(error.response?.data?.detail || '로그인에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 회원가입 함수
   * @param {Object} userData - 회원가입 데이터
   */
  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.signup(userData);
      toast.success('회원가입에 성공했습니다! 로그인해주세요.');
      router.push('/auth/login');
      return result;
    } catch (error) {
      toast.error(error.response?.data?.detail || '회원가입에 실패했습니다. 다시 시도해주세요.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('로그아웃되었습니다.');
    router.push('/');
  };

  // Context에 제공할 값
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 인증 상태를 사용하기 위한 커스텀 훅
 */
export const useAuth = () => useContext(AuthContext); 