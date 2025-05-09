'use client';

import axios from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs';

// API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'auth_token';

/**
 * 인증 관련 서비스 함수들
 * Flutter 기존 프로젝트의 AuthService 클래스를 JavaScript로 재구현
 */
export const authService = {
  /**
   * 이메일과 비밀번호로 회원가입
   * @param {Object} userData - 회원가입 데이터
   * @returns {Promise<Object>} - 회원가입 결과
   */
  async signup(userData) {
    try {
      console.log(API_URL);
      const response = await axios.post(`${API_URL}/api/v1/users/signup`, userData);
      // 회원가입 응답에 access_token이 포함되어 있다면 저장
      const { access_token } = response.data;
      if (access_token) {
        Cookies.set(AUTH_COOKIE_NAME, access_token, {
          expires: 7, // 7일간 유효
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * 이메일과 비밀번호로 로그인
   * @param {string} email - 이메일
   * @param {string} password - 비밀번호
   * @returns {Promise<Object>} - 로그인 결과 및 사용자 정보
   */
  async login(email, password) {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/users/login`,
        qs.stringify({ username: email, password }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const { access_token, user } = response.data;

      // JWT 토큰을 HTTP 전용 쿠키에 저장
      Cookies.set(AUTH_COOKIE_NAME, access_token, {
        expires: 7, // 7일간 유효
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return { user };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout() {
    // 쿠키에서 토큰 제거
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
  },

  /**
   * 현재 로그인 상태 확인
   * @returns {boolean} - 로그인 여부
   */
  isAuthenticated() {
    return !!Cookies.get(AUTH_COOKIE_NAME);
  },

  /**
   * JWT 토큰 가져오기
   * @returns {string|null} - JWT 토큰
   */
  getToken() {
    return Cookies.get(AUTH_COOKIE_NAME) || null;
  },

  /**
   * 프로필 정보 업데이트
   * @param {Object} profileData - 프로필 데이터 (알레르기, 건강목표 등)
   * @returns {Promise<Object>} - 업데이트 결과
   */
  async updateProfile(profileData) {
    try {
      const token = this.getToken();
      const response = await axios.put(
        `${API_URL}/api/v1/users/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * 이메일 중복 여부 확인
   * @param {string} email - 확인할 이메일
   * @returns {Promise<boolean>} - 존재 여부
   */
  async emailExists(email) {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/email-exists`, {
        params: { email }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Email exists check error:', error.response?.data || error.message);
      throw error;
    }
  }
}; 