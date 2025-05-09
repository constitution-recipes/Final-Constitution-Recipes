'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, ChefHat, ArrowLeft, Heart, Users, Award, CheckCircle, Leaf, ShoppingBag, Calendar, Flame, Sparkles, PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { updateRecipe } from '@/lib/utils/recipeApi';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export default function EditRecipeClient({ id }) {
  const [recipe, setRecipe] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [editDetails, setEditDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ingredients");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${API_URL}/api/v1/recipes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setRecipe(data);
        setLoading(false);
      })
      .catch(() => {
        router.replace('/404');
      });
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl blur-3xl opacity-50"></div>
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden relative z-10">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (!recipe) return null;

  const bodyTypes = recipe.suitableBodyTypes || recipe.suitableFor?.split(', ') || [];

  // 체질 타입에 따른 색상
  const getBodyTypeColor = (bodyType) => {
    const colorMap = {
      '태양인': 'bg-amber-100 text-amber-800 border-amber-200',
      '태음인': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      '소양인': 'bg-rose-100 text-rose-800 border-rose-200',
      '소음인': 'bg-blue-100 text-blue-800 border-blue-200',
      '일반': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colorMap[bodyType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // const handleSubmit = async () => {
  //   try {
  //     await updateRecipe(id, { editReason: editDetails });
  //     toast({ title: '수정 완료', description: '수정 사유가 저장되었습니다.' });
  //     router.push(`/recipe/${id}`);
  //   } catch (error) {
  //     toast({ title: '수정 실패', description: error.message, variant: 'destructive' });
  //   }
  // };
  const handleSubmit = () => {
    toast({ title: '수정 완료', description: '수정 사유가 저장되었습니다.' });
  };

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 relative">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10"
      >
        <Link 
          href={`/recipe/${id}`}
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">레시피 상세로 돌아가기</span>
        </Link>
        
        {/* 레시피 카드 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-3xl opacity-70"></div>
          <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden relative z-10">
            <CardContent className="p-0">
              {/* 헤더 영역 - 이미지 대신 그라데이션과 정보로 구성 */}
              <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 p-10 sm:p-12">
                {/* 편집 모드 아이콘 */}
                <div className="absolute top-6 right-6">
                  <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center">
                    <PencilLine size={22} className="text-primary mr-2" />
                    <span className="font-medium text-primary">편집 모드</span>
                  </div>
                </div>
                
                {/* 헤더 섹션 - 타이틀과 메타데이터 */}
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex p-3 rounded-full bg-white/30 backdrop-blur-sm shadow-sm mb-3">
                      <ChefHat size={20} className="text-primary mr-3" />
                      <span className="font-medium text-primary">체질 맞춤 레시피</span>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {recipe.tags && recipe.tags.map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          className="bg-white/30 hover:bg-white/40 backdrop-blur-sm text-gray-800 border-white/10 py-1 px-3 text-sm font-medium tracking-wide shadow-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight leading-tight">
                      {recipe.title}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {recipe.description}
                    </p>
                    <div className="w-32 h-2 bg-gradient-to-r from-primary/40 to-primary/5 rounded-full mt-6"></div>
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <div className="flex items-center mb-2">
                          <Clock size={18} className="text-primary mr-2" />
                          <span className="font-medium">조리 시간</span>
                        </div>
                        <p className="text-2xl font-semibold">{recipe.cookTime}</p>
                      </div>
                      
                      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <div className="flex items-center mb-2">
                          <ChefHat size={18} className="text-primary mr-2" />
                          <span className="font-medium">난이도</span>
                        </div>
                        <p className="text-2xl font-semibold">{recipe.difficulty}</p>
                      </div>
                      
                      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                        <div className="flex items-center mb-2">
                          <Users size={18} className="text-primary mr-2" />
                          <span className="font-medium">인분</span>
                        </div>
                        <p className="text-2xl font-semibold">{recipe.servings || "1인분"}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* 내용 영역 */}
              <div className="p-8 sm:p-10">
                {/* 체질 맞춤 정보 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-12"
                >
                  <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 via-primary/5 to-secondary/5 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <CardContent className="p-8 relative">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mr-4">
                          <Leaf size={24} className="text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">체질 맞춤 정보</h2>
                          <p className="text-sm text-muted-foreground mt-1">당신의 체질에 맞춘 레시피입니다</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {bodyTypes.map((type, index) => (
                          <div 
                            key={index} 
                            className={`px-4 py-2 rounded-full border ${getBodyTypeColor(type)}`}
                          >
                            <span className="font-medium">{type}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-start p-5 bg-white rounded-2xl shadow-sm border border-primary/10">
                        <div className="mt-1 mr-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle size={20} className="text-primary" />
                          </div>
                        </div>
                        <div>
                          <span className="text-base font-semibold">이 레시피가 당신의 체질에 이로운 이유</span>
                          <p className="text-muted-foreground mt-2 leading-relaxed">
                            {recipe.reason || "체질에 맞는 재료와 조리법이 사용되었습니다. 체질 특성을 고려한 영양소 균형과 조리 방법으로 건강에 도움을 줍니다."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* 탭 영역 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Tabs defaultValue="ingredients" className="mb-6" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-8 bg-muted/50 p-1 rounded-full">
                      <TabsTrigger 
                        value="ingredients" 
                        className="rounded-full py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300"
                      >
                        <ShoppingBag size={18} className="mr-2" />
                        재료
                      </TabsTrigger>
                      <TabsTrigger 
                        value="steps" 
                        className="rounded-full py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300"
                      >
                        <ChefHat size={18} className="mr-2" />
                        조리 방법
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ingredients" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <ShoppingBag size={20} className="text-primary mr-3" />
                              <h3 className="text-xl font-bold">필요한 재료</h3>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              수정이 필요한 재료를 체크하세요
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1">
                            {recipe.ingredients.map((item, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="flex items-center py-4 border-b border-border/30"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-3 h-3 bg-primary/80 rounded-full mr-4 shadow-sm"></div>
                                </div>
                                <span className="text-foreground text-base flex-grow">{item}</span>
                                <Checkbox
                                  className="ml-3"
                                  checked={selectedIngredients.includes(idx)}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? setSelectedIngredients(prev => [...prev, idx])
                                      : setSelectedIngredients(prev => prev.filter(i => i !== idx))
                                  }
                                />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="steps" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="p-6 sm:p-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <ChefHat size={20} className="text-primary mr-3" />
                              <h3 className="text-xl font-bold">조리 방법</h3>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              수정이 필요한 조리 단계를 체크하세요
                            </div>
                          </div>
                          
                          <div className="space-y-8">
                            {recipe.steps.map((step, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex items-start"
                              >
                                <div className="flex-shrink-0 mr-5">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-md text-white font-bold text-lg">
                                    {idx + 1}
                                  </div>
                                </div>
                                <div className="pt-1 flex-grow">
                                  <p className="text-foreground text-lg leading-relaxed">{step}</p>
                                </div>
                                <div className="ml-3 pt-1">
                                  <Checkbox
                                    checked={selectedSteps.includes(idx)}
                                    onCheckedChange={(checked) =>
                                      checked
                                        ? setSelectedSteps(prev => [...prev, idx])
                                        : setSelectedSteps(prev => prev.filter(i => i !== idx))
                                    }
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
                
                {/* 수정 사항 입력 영역 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-12"
                >
                  <Card className="border-none shadow-md bg-gradient-to-br from-white to-primary/5">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <PencilLine size={22} className="text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">수정 사유</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            무엇을 왜 수정했는지 작성해주세요
                          </p>
                        </div>
                      </div>
                      <Textarea 
                        value={editDetails}
                        onChange={(e) => setEditDetails(e.target.value)}
                        placeholder="수정 사항에 대한 내용을 입력해주세요"
                        className="mt-4 min-h-[120px] text-base"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* 저장 버튼 영역 */}
                <div className="flex justify-center mt-14 gap-4">
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="rounded-full px-6 py-6 shadow-md bg-primary hover:bg-primary/90"
                  >
                    <PencilLine size={18} className="mr-2" />
                    <span>수정 사항 저장하기</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </main>
  );
} 