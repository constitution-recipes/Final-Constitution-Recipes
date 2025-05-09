// 이미지를 제거하고 최적화된 디자인을 적용한 레시피 상세 페이지
import { use } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import RecipeDetailClient from './RecipeDetailClient';

export default function RecipeDetailPage({ params }) {
  // params를 Promise에서 언랩
  const { id } = use(params);
  return (
    <SidebarLayout>
      <RecipeDetailClient id={id} />
    </SidebarLayout>
  );
} 