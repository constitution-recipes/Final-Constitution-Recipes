'use client';

import axios from 'axios';
import { authService } from './authService';
import { UserModel } from '../models/userModel';

// API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * API 요청에 인증 헤더 및 쿠키 전송 설정 추가
 * @returns {Object} - 인증 헤더를 포함한 axios config
 */
const getAuthConfig = () => {
  const token = authService.getToken();
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true, // 쿠키 전송 허용
  };
};

/**
 * 사용자 관련 서비스 함수들
 * Flutter 기존 프로젝트의 UserService 클래스를 JavaScript로 재구현
 */
export const userService = {
  /**
   * 사용자 프로필 조회
   * @param {string} userId - 사용자 ID
   * @returns {Promise<UserModel>} - 사용자 모델 객체
   */
  async getUser(userId) {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/${userId}`, getAuthConfig());
      return UserModel.fromJSON(response.data);
    } catch (error) {
      console.error('Get user error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * 현재 로그인한 사용자 프로필 조회
   * @returns {Promise<UserModel>} - 사용자 모델 객체
   */
  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/me`, getAuthConfig());
      return UserModel.fromJSON(response.data);
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * 사용자 정보 업데이트
   * @param {string} userId - 사용자 ID
   * @param {Object} userData - 업데이트할 사용자 데이터
   * @returns {Promise<UserModel>} - 업데이트된 사용자 모델 객체
   */
  async updateUser(userId, userData) {
    try {
      const response = await axios.put(`${API_URL}/api/v1/users/${userId}`, userData, getAuthConfig());
      return UserModel.fromJSON(response.data);
    } catch (error) {
      console.error('Update user error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * 사용자 건강 목표 업데이트
   * @param {string} userId - 사용자 ID
   * @param {string} healthGoals - 건강 목표
   * @returns {Promise<UserModel>} - 업데이트된 사용자 모델 객체
   */
  async updateHealthGoals(userId, healthGoals) {
    return this.updateUser(userId, { healthGoals });
  },

  /**
   * 사용자 알레르기 정보 업데이트
   * @param {string} userId - 사용자 ID
   * @param {string} allergies - 알레르기 정보
   * @returns {Promise<UserModel>} - 업데이트된 사용자 모델 객체
   */
  async updateAllergies(userId, allergies) {
    return this.updateUser(userId, { allergies });
  },
}; 