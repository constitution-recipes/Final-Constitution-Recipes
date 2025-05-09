'use client';

import Link from 'next/link';
import { Clock, ChefHat, Tag, Heart, BookOpen, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addBookmark, removeBookmark } from '@/lib/utils/bookmarkApi';

export function RecipeCard({ recipe, isSaved, onBookmarkChange }) {
  const { id, title, description, difficulty, cookTime, suitableBodyTypes, tags } = recipe;
  const { isAuthenticated } = useAuth();
  const accessToken = typeof window !== 'undefined' ? require('@/lib/services/authService').authService.getToken() : null;
  const [loading, setLoading] = useState(false);
  
  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !accessToken) {
      // 비로그인 fallback: localStorage
      const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      let updated;
      if (isSaved) {
        updated = saved.filter(savedId => savedId !== id);
      } else {
        updated = [...saved, id];
      }
      localStorage.setItem('savedRecipes', JSON.stringify(updated));
      if (typeof onBookmarkChange === 'function') {
        onBookmarkChange();
      }
      return;
    }
    setLoading(true);
    try {
      if (isSaved) {
        await removeBookmark(id, accessToken);
      } else {
        await addBookmark(id, accessToken);
      }
    } catch (err) {
      alert(err.message || '북마크 처리 중 오류 발생');
    }
    setLoading(false);
    if (typeof onBookmarkChange === 'function') {
      onBookmarkChange();
    }
  };
  
  // 난이도에 따른 색상 설정
  const difficultyColor = {
    '쉬움': 'bg-green-100 text-green-800',
    '중간': 'bg-yellow-100 text-yellow-800',
    '어려움': 'bg-red-100 text-red-800',
  };

  // 태그 색상
  const getTagColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-rose-100 text-rose-800',
      'bg-amber-100 text-amber-800',
      'bg-emerald-100 text-emerald-800'
    ];
    return colors[index % colors.length];
  };

  // 체질 타입에 따른 색상
  const getBodyTypeColor = (bodyType) => {
    const colorMap = {
      '태양인': 'bg-amber-50 text-amber-800 border-amber-200',
      '태음인': 'bg-emerald-50 text-emerald-800 border-emerald-200',
      '소양인': 'bg-rose-50 text-rose-800 border-rose-200',
      '소음인': 'bg-blue-50 text-blue-800 border-blue-200',
      '일반': 'bg-slate-50 text-slate-800 border-slate-200'
    };
    return colorMap[bodyType] || 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const bodyTypes = suitableBodyTypes || recipe.suitableFor?.split(', ') || [];

  return (
    <div className="bg-gradient-to-br from-white to-primary/5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-primary/10 h-full">
      <div className="p-6 relative h-full flex flex-col">
        {/* 상단 영역: 태그 및 북마크 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-1 max-w-[80%]">
            {tags && tags.slice(0, 2).map((tag, index) => (
              <span key={index} className={cn('px-2 py-1 text-xs font-medium rounded-full', getTagColor(index))}>
                {tag}
              </span>
            ))}
            {tags && tags.length > 2 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                +{tags.length - 2}
              </span>
            )}
          </div>
          <button 
            onClick={handleSave}
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <Heart size={18} className={isSaved ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"} />
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-grow">
          <div className="flex items-center mb-3 gap-2">
            <span className={cn('px-3 py-1 text-xs font-medium rounded-full', difficultyColor[difficulty] || 'bg-gray-100 text-gray-800')}>
              {difficulty}
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex items-center">
              <Clock size={12} className="mr-1" />
              {cookTime}
            </span>
          </div>

          <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
          
          {/* 장식적 요소 */}
          <div className="w-20 h-1 bg-gradient-to-r from-primary/40 to-primary/10 rounded-full mb-4"></div>
        </div>

        {/* 체질 정보 */}
        <div className="mt-auto">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">적합 체질</p>
            <div className="flex flex-wrap gap-1.5">
              {bodyTypes.map((type, idx) => (
                <span key={idx} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getBodyTypeColor(type)}`}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          <Link href={`/recipe/${id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90 rounded-lg shadow flex items-center justify-center gap-2">
              <BookOpen size={16} />
              레시피 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 