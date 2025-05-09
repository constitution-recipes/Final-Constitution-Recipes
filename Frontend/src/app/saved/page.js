"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { useAuth } from '@/contexts/AuthContext';
import { fetchBookmarks } from '@/lib/utils/bookmarkApi';
// 더미 레시피 데이터 (실제 API 호출로 대체 예정)
const dummyRecipes = [
  {
    id: '1',
    title: '단호박 효능 높이는 체질별 맞춤 수프',
    description: '체질에 맞는 재료와 조리법으로 단호박의 효능을 극대화하는 수프 레시피입니다.',
    difficulty: '쉬움',
    cookTime: '40분',
    ingredients: ['단호박', '양파', '마늘', '올리브 오일', '소금', '후추', '치킨 스톡'],
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ba2a?q=80&w=500',
    rating: 4.8,
    suitableFor: '음양 균형, 소화력 강화',
    tags: ['계절식', '영양식', '간편식'],
  },
  {
    id: '2',
    title: '체질별 맞춤 닭가슴살 샐러드',
    description: '다양한 신선한 채소와 단백질이 풍부한 닭가슴살을 체질에 맞게 조합한 샐러드입니다.',
    difficulty: '쉬움',
    cookTime: '35분',
    ingredients: ['닭가슴살', '양상추', '시금치', '방울토마토', '아보카도', '올리브 오일', '레몬즙'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500',
    rating: 4.5,
    suitableFor: '단백질 흡수 개선, 면역력 강화',
    tags: ['고단백', '저칼로리', '가벼운 식사'],
  },
  {
    id: '3',
    title: '대추차 활용 냉이 영양밥',
    description: '대추차의 달콤함과 냉이의 영양을 모두 담은 맞춤형 영양밥으로 체질 개선에 도움을 줍니다.',
    difficulty: '중간',
    cookTime: '45분',
    ingredients: ['쌀', '냉이', '대추', '마늘', '참기름', '소금'],
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=500',
    rating: 4.7,
    suitableFor: '혈액순환 개선, 소화기능 강화',
    tags: ['한식', '약선요리', '영양식'],
  },
  {
    id: '4',
    title: '체질별 맞춤 당근생강주스',
    description: '체질에 맞게 조절된 당근과 생강의 비율로 최적의 영양 흡수를 도와주는 주스입니다.',
    difficulty: '쉬움',
    cookTime: '10분',
    ingredients: ['당근', '생강', '사과', '레몬', '꿀'],
    image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?q=80&w=500',
    rating: 4.9,
    suitableFor: '소화력 증진, 면역력 강화',
    tags: ['주스', '건강음료', '간편식'],
  }
];

export default function SavedRecipesPage() {
  const { isAuthenticated } = useAuth();
  const accessToken = typeof window !== 'undefined' ? require('@/lib/services/authService').authService.getToken() : null;
  const [savedIds, setSavedIds] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  // useEffect(() => {
    //   // localStorage에서 저장된 레시피 id 불러오기
    //   const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    //   setSavedIds(saved);
    //   setSavedRecipes(dummyRecipes.filter(r => saved.includes(r.id)));
    // }, []);
  // 북마크 목록과 레시피 상세정보를 불러오는 함수
  const fetchAndSetBookmarks = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1492';
    if (isAuthenticated && accessToken) {
      // 서버에서 북마크 목록을 불러오고, 각 recipe_id로 레시피 상세 정보 요청
      fetchBookmarks(accessToken)
        .then(async (bookmarks) => {
          setSavedIds(bookmarks.map(b => b.recipe_id));
          // 여러 레시피 상세정보 병렬 요청
          const recipeDetails = await Promise.all(
            bookmarks.map(bm =>
              fetch(`${API_URL}/api/v1/recipes/${bm.recipe_id}`)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
            )
          );
          setSavedRecipes(recipeDetails.filter(Boolean));
        })
        .catch(() => {
          setSavedIds([]);
          setSavedRecipes([]);
        });
    } else {
      // 비로그인 fallback: localStorage
      const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      setSavedIds(saved);
      setSavedRecipes(dummyRecipes.filter(r => saved.includes(r.id)));
    }
  };

  useEffect(() => {
    fetchAndSetBookmarks();
  }, [isAuthenticated, accessToken]);

  return (
    <SidebarLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-2">
            <Heart size={24} className="text-teal-500" />
            <h1 className="text-2xl font-bold text-gray-900">저장한 레시피</h1>
          </div>
          {savedRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Heart size={48} className="mb-4" />
              <p className="text-lg">저장한 레시피가 없습니다.</p>
              <Link href="/recommend_recipes">
                <Button className="mt-6 bg-teal-500 hover:bg-teal-600">레시피 보러가기</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} isSaved={savedIds.includes(recipe.id)} onBookmarkChange={fetchAndSetBookmarks} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
} 