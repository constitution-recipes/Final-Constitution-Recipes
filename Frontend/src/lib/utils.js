import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스명을 조합하는 유틸리티 함수
 * tailwind 클래스들을 조합하고 충돌을 해결합니다.
 * 
 * @param {...string} inputs - 조합할 클래스명들
 * @returns {string} 조합된 클래스명
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 