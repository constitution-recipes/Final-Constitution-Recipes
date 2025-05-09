'use client';

import React, { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Search, Clock, Utensils, User } from 'lucide-react';
import Link from 'next/link';
import { fetchBookmarks } from '@/lib/utils/bookmarkApi';
import { useAuth } from '@/contexts/AuthContext';

export default function RecommendRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const accessToken = typeof window !== 'undefined' ? require('@/lib/services/authService').authService.getToken() : null;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [bodyType, setBodyType] = useState('');
  
  // 필터 상태
  const [filters, setFilters] = useState({
    category: '전체',
    difficulty: [],
    bodyType: '',
    ingredients: [],
  });

  const [activeFilter, setActiveFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 북마크 목록 불러오기
  const fetchAndSetBookmarks = async () => {
    if (isAuthenticated && accessToken) {
      try {
        const bookmarks = await fetchBookmarks(accessToken);
        setSavedIds(bookmarks.map(b => b.recipe_id));
      } catch {
        setSavedIds([]);
      }
    } else {
      const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      setSavedIds(saved);
    }
  };

  useEffect(() => {
    fetchAndSetBookmarks();
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    console.log('API URL:', API_URL); // API URL 로깅
    // 백엔드에서 모든 레시피 조회
    fetch(`${API_URL}/api/v1/recipes/get_all_recipes`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setRecipes(data);
        setFilteredRecipes(data);
      })
      .catch(err => {
        console.error('레시피 불러오기 실패:', err);
        console.error('상세 에러:', err.message);
        setRecipes([]);
        setFilteredRecipes([]);
      });
    // 체질 정보 로드는 사용자 정보로 대체
  }, []);

  useEffect(() => {
    if (user?.constitution) {
      setBodyType(user.constitution+'체질');
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, recipes]);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      recipes.forEach(r => {
        console.log(`[${r.title}] ingredients:`, r.ingredients);
      });
    }
  }, [recipes]);

  const applyFilters = () => {
    const base = Array.isArray(recipes) ? recipes : [];
    let results = [...base];
    const activeFiltersList = [];

    // 검색어 필터링
    if (searchQuery) {
      results = results.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      activeFiltersList.push(`검색: ${searchQuery}`);
    }

    // 카테고리 필터링
    if (filters.category && filters.category !== '전체') {
      results = results.filter(recipe => recipe.category === filters.category);
      activeFiltersList.push(`카테고리: ${filters.category}`);
    }

    // 난이도 필터링
    if (filters.difficulty.length > 0) {
      results = results.filter(recipe => filters.difficulty.includes(recipe.difficulty));
      activeFiltersList.push(`난이도: ${filters.difficulty.join(', ')}`);
    }

    // 체질 필터링
    if (filters.bodyType) {
      results = results.filter(recipe => Array.isArray(recipe.suitableBodyTypes) && recipe.suitableBodyTypes.includes(filters.bodyType));
      activeFiltersList.push(`체질: ${filters.bodyType}`);
    }

    // 재료(주요 재료) 필터링 (AND 조건)
    if (filters.ingredients.length > 0) {
      results = results.filter(recipe =>
        filters.ingredients.every(ing =>
          Array.isArray(recipe.keyIngredients)
            ? recipe.keyIngredients.includes(ing)
            : false
        )
      );
      activeFiltersList.push(`재료: ${filters.ingredients.join(', ')}`);
    }

    setFilteredRecipes(results);
    setActiveFilters(activeFiltersList);
  };

  const handleRemoveFilter = (filterToRemove) => {
    if (filterToRemove.startsWith('검색:')) {
      setSearchQuery('');
    } else if (filterToRemove.startsWith('카테고리:')) {
      setFilters({ ...filters, category: '전체' });
    } else if (filterToRemove.startsWith('재료:')) {
      setFilters({ ...filters, ingredients: [] });
    } else if (filterToRemove.startsWith('난이도:')) {
      setFilters({ ...filters, difficulty: [] });
    } else if (filterToRemove.startsWith('체질:')) {
      setFilters({ ...filters, bodyType: '' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '전체',
      difficulty: [],
      bodyType: '',
      ingredients: [],
    });
  };

  const handleCookingTimeChange = (values) => {
    setFilters({...filters, cookingTime: values});
  };

  const handleMealTypeChange = (mealType) => {
    const updatedMealTypes = filters.mealType.includes(mealType)
      ? filters.mealType.filter(m => m !== mealType)
      : [...filters.mealType, mealType];
    setFilters({...filters, mealType: updatedMealTypes});
  };

  const handleIngredientChange = (ingredient) => {
    const updatedIngredients = filters.ingredients.includes(ingredient)
      ? filters.ingredients.filter(i => i !== ingredient)
      : [...filters.ingredients, ingredient];
    setFilters({...filters, ingredients: updatedIngredients});
  };

  const handleDifficultyChange = (difficulty) => {
    const updatedDifficulties = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    setFilters({...filters, difficulty: updatedDifficulties});
  };

  const toggleBodyTypeMatch = () => {
    setFilters({...filters, bodyTypeMatch: !filters.bodyTypeMatch});
  };

  const toggleFilter = () => {
    setActiveFilter(!activeFilter);
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const currentValues = prev[category];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...currentValues, value]
        };
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 레시피 저장 토글
  const toggleSave = (recipeId) => {
    // 실제 구현에서는 API 호출 등으로 저장/삭제 처리
    console.log(`Toggle save for recipe ${recipeId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <SidebarLayout>
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">맞춤 레시피</h1>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                당신의 체질과 건강 상태에 맞게 개인화된 레시피를 추천해 드립니다. 
                원하는 재료, 조리 시간, 난이도 등을 선택하여 더 정확한 맞춤형 레시피를 찾아보세요.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="레시피 검색..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={toggleFilter}
              >
                <Filter className="h-4 w-4" />
                필터
                <ChevronDown className={`h-4 w-4 transition-transform ${activeFilter ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* 필터 패널 */}
            {activeFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 p-4 rounded-lg border border-border/40 bg-card"
              >
                <Tabs defaultValue="category">
                  <TabsList className="mb-4">
                    <TabsTrigger value="category">카테고리</TabsTrigger>
                    <TabsTrigger value="difficulty">난이도</TabsTrigger>
                    <TabsTrigger value="bodyType">체질</TabsTrigger>
                    <TabsTrigger value="ingredients">재료</TabsTrigger>
                  </TabsList>

                  <TabsContent value="category">
                    <div className="flex flex-wrap gap-2">
                      {['전체', '한식', '중식', '일식', '양식', '디저트', '음료'].map((category) => (
                        <button
                          key={category}
                          onClick={() => setFilters(f => ({ ...f, category }))}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            filters.category === category
                              ? 'bg-primary text-white'
                              : 'bg-muted hover:bg-muted/80 text-foreground/80'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="difficulty">
                    <div className="flex flex-wrap gap-2">
                      {['쉬움', '중간', '어려움'].map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => setFilters(f => ({ ...f, difficulty: [difficulty] }))}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            filters.difficulty.includes(difficulty)
                              ? 'bg-primary text-white'
                              : 'bg-muted hover:bg-muted/80 text-foreground/80'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="bodyType">
                    <div className="flex flex-wrap gap-2">
                      {['목양체질','목음체질','토양체질','토음체질','금양체질','금음체질','수양체질','수음체질'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilters(f => ({ ...f, bodyType: f.bodyType === type ? '' : type }))}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            filters.bodyType === type
                              ? 'bg-primary text-white'
                              : 'bg-muted hover:bg-muted/80 text-foreground/80'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="ingredients">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {['육류', '해산물', '채소', '과일', '유제품', '견과류'].map((ingredient) => (
                        <div key={ingredient} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`ingredient-${ingredient}`}
                            checked={filters.ingredients.includes(ingredient)}
                            onChange={() => {
                              setFilters(f => ({
                                ...f,
                                ingredients: f.ingredients.includes(ingredient)
                                  ? f.ingredients.filter(i => i !== ingredient)
                                  : [...f.ingredients, ingredient],
                              }));
                            }}
                            className="rounded border-border/40 text-primary focus:ring-primary/30"
                          />
                          <Label htmlFor={`ingredient-${ingredient}`}>{ingredient}</Label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            {/* 활성화된 필터 표시 */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-500">활성 필터:</span>
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {filter}
                    <button
                      onClick={() => handleRemoveFilter(filter)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* 결과 탭 */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
                <TabsTrigger value="all">전체 ({Array.isArray(filteredRecipes) ? filteredRecipes.length : 0})</TabsTrigger>
                <TabsTrigger value="bodyType">
                  체질 맞춤 ({Array.isArray(filteredRecipes) ? filteredRecipes.filter(r => Array.isArray(r.suitableBodyTypes) && r.suitableBodyTypes.includes(bodyType)).length : 0})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.length > 0 ? (
                    filteredRecipes.map(recipe => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isSaved={savedIds.includes(recipe.id)}
                        onBookmarkChange={fetchAndSetBookmarks}
                      />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <h3 className="text-lg text-gray-500 mb-2">검색 결과가 없습니다.</h3>
                      <p className="text-gray-400 mb-4">다른 검색어나 필터를 사용해보세요.</p>
                      <Button onClick={resetFilters} variant="outline">필터 초기화</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bodyType">
                {!bodyType ? (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg text-gray-500 mb-2">체질 정보가 없어 체질 맞춤 레시피를 볼 수 없습니다.</h3>
                    <p className="text-gray-400 mb-4">프로필에서 체질 진단을 먼저 완료해주세요.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.filter(r => Array.isArray(r.suitableBodyTypes) && r.suitableBodyTypes.includes(bodyType)).length > 0 ? (
                      filteredRecipes
                        .filter(r => Array.isArray(r.suitableBodyTypes) && r.suitableBodyTypes.includes(bodyType))
                        .map(recipe => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isSaved={savedIds.includes(recipe.id)}
                            onBookmarkChange={fetchAndSetBookmarks}
                          />
                        ))
                    ) : (
                      <div className="col-span-3 text-center py-12">
                        <h3 className="text-lg text-gray-500 mb-2">체질 맞춤 레시피가 없습니다.</h3>
                        <p className="text-gray-400 mb-4">다른 필터를 사용해보세요.</p>
                        <Button onClick={resetFilters} variant="outline">필터 초기화</Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </SidebarLayout>
  );
} 