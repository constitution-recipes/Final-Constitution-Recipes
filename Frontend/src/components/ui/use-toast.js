'use client';

/**
 * useToast 훅: 간단한 토스트 알림 기능을 제공합니다.
 * title과 description을 받아 alert로 표시하는 기본 구현입니다.
 */
export function useToast() {
  return {
    toast: ({ title, description, variant }) => {
      // variant에 따라 스타일을 다르게 적용할 수 있도록 확장 가능합니다.
      window.alert(`${title}\n${description}`);
    },
  };
} 