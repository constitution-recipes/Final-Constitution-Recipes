'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/lib/services/userService';
import { User, Mail, Phone, Heart, AlertCircle, CheckCircle2, ListTodo, Clock, ShieldCheck } from 'lucide-react';
import ConstitutionCard from '@/components/common/ConstitutionCard';

export default function ProfilePage() {
  const { user, refreshUser, isLoading } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    allergies: [],
    currentHealthStatus: '',
    healthGoals: [],
    existingConditions: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        allergies: user.allergies || [],
        currentHealthStatus: user.currentHealthStatus || '',
        healthGoals: user.healthGoals || [],
        existingConditions: user.existingConditions || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        allergies: user.allergies || [],
        currentHealthStatus: user.currentHealthStatus || '',
        healthGoals: user.healthGoals || [],
        existingConditions: user.existingConditions || ''
      });
    }
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      await userService.updateProfile(profile);
      await refreshUser();
      setEditing(false);
      toast({
        title: "프로필 업데이트",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      toast({
        title: "오류 발생",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergiesChange = (e) => {
    const allergiesArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setProfile(prev => ({
      ...prev,
      allergies: allergiesArray
    }));
  };

  const handleHealthGoalsChange = (e) => {
    const goalsArray = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setProfile(prev => ({
      ...prev,
      healthGoals: goalsArray
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            <div className="relative w-full h-full flex items-center justify-center bg-primary/10 rounded-full">
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <p className="text-lg font-medium text-muted-foreground">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-muted-foreground">로그인이 필요합니다.<br/>로그인 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  // 체질 여부에 따른 배경 색상 설정
  const hasConstitution = !!user.constitution;
  const bgColor = hasConstitution 
    ? 'bg-gradient-to-b from-white via-white to-green-50' 
    : 'bg-gradient-to-b from-white via-white to-gray-50';

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 md:px-8">
        {/* 프로필 카드 - 개선된 그라데이션 및 디자인 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
          {/* 프로필 헤더 - 더 강화된 그라데이션 */}
          <div className="relative overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/70"></div>
            <div className="absolute inset-0 bg-[url('/pattern-dots.png')] opacity-15"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/25 to-transparent"></div>
            
            <div className="absolute right-4 top-4">
              <div className="px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>내 프로필</span>
              </div>
            </div>
          </div>
          
          {/* 프로필 내용 */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-8">
              <div className="w-28 h-28 rounded-full bg-white p-2 shadow-lg self-center sm:self-start mx-auto sm:mx-0 border border-white/80">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10">
                  <User className="w-14 h-14 text-primary" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                          <User className="w-4.5 h-4.5 text-primary" />
                        </span>
                        <span className="text-sm text-gray-500 font-medium">이름</span>
                      </div>
                      <span className="text-lg font-bold text-center sm:text-right">{user.name}</span>
                    </div>
                    
                    <div className="w-full border-t border-gray-100 my-1"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50">
                          <Mail className="w-4.5 h-4.5 text-blue-500" />
                        </span>
                        <span className="text-sm text-gray-500 font-medium">이메일</span>
                      </div>
                      <span className="text-sm font-medium text-center sm:text-right break-all">{user.email}</span>
                    </div>
                    
                    {user.phoneNumber && (
                      <>
                        <div className="w-full border-t border-gray-100 my-1"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-50">
                              <Phone className="w-4.5 h-4.5 text-green-500" />
                            </span>
                            <span className="text-sm text-gray-500 font-medium">전화번호</span>
                          </div>
                          <span className="text-sm font-medium text-center sm:text-right">{user.phoneNumber}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 프로필 완성도 - 개선된 디자인 */}
            <div className="relative bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-100 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">프로필 정보 완성도</h3>
                <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
                  {Math.round(((user.allergies?.length ? 1 : 0) + 
                  (user.currentHealthStatus ? 1 : 0) + 
                  (user.healthGoals?.length ? 1 : 0) + 
                  (user.existingConditions ? 1 : 0) +
                  (user.constitution ? 1 : 0)) * 20)}% 완료
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full" 
                  style={{ 
                    width: `${
                      ((user.allergies?.length ? 1 : 0) + 
                      (user.currentHealthStatus ? 1 : 0) + 
                      (user.healthGoals?.length ? 1 : 0) + 
                      (user.existingConditions ? 1 : 0) +
                      (user.constitution ? 1 : 0)) * 20
                    }%` 
                  }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                <ProfileBadge 
                  active={user.allergies?.length > 0} 
                  icon={<AlertCircle className="w-3.5 h-3.5" />} 
                  text="알레르기" 
                />
                <ProfileBadge 
                  active={!!user.currentHealthStatus} 
                  icon={<Heart className="w-3.5 h-3.5" />} 
                  text="건강 상태" 
                />
                <ProfileBadge 
                  active={user.healthGoals?.length > 0} 
                  icon={<ListTodo className="w-3.5 h-3.5" />} 
                  text="건강 목표" 
                />
                <ProfileBadge 
                  active={!!user.existingConditions} 
                  icon={<AlertCircle className="w-3.5 h-3.5" />} 
                  text="기존 질환" 
                />
                <ProfileBadge 
                  active={!!user.constitution} 
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />} 
                  text="체질 진단" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 체질 정보 섹션 - 개선된 디자인 */}
          <div className="order-2 md:order-1">
            {user.constitution ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>체질 진단 결과</span>
                  </h2>
                </div>
                <div className="p-5">
                  <ConstitutionCard constitution={user.constitution} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                  <h2 className="text-base font-semibold text-gray-800">체질 진단</h2>
                </div>
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-center">체질 진단 미완료</h3>
                  <p className="text-muted-foreground text-sm mb-6 text-center">맞춤형 건강 식단을 추천받으려면<br />체질 진단을 완료하세요.</p>
                  <Button className="rounded-lg px-6 shadow-sm" size="lg" asChild>
                    <a href="/constitution-diagnosis">체질 진단 받기</a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 건강 정보 섹션 - 개선된 디자인 */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                  <Heart className="w-5 h-5 text-blue-500" />
                  <span>건강 정보</span>
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {/* 알레르기 정보 */}
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    알레르기
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.allergies?.length ? (
                      user.allergies.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-100">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">알레르기 정보가 없습니다.</span>
                    )}
                  </div>
                </div>
                
                {/* 건강 상태 */}
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
                    <Heart className="w-4 h-4 text-primary" />
                    건강 상태
                  </h3>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {user.currentHealthStatus || "건강 상태 정보가 없습니다."}
                  </div>
                </div>
                
                {/* 건강 목표 */}
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
                    <ListTodo className="w-4 h-4 text-teal-500" />
                    건강 목표
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.healthGoals?.length ? (
                      user.healthGoals.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm border border-teal-100">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">건강 목표가 없습니다.</span>
                    )}
                  </div>
                </div>
                
                {/* 기존 질환 */}
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    기존 질환
                  </h3>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {user.existingConditions || "기존 질환 정보가 없습니다."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 프로필 완성도 배지 컴포넌트
function ProfileBadge({ active, icon, text }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20' 
        : 'bg-gray-100 text-gray-500 border border-gray-200'
    }`}>
      {icon}
      <span>{text}</span>
      {active && <CheckCircle2 className="w-3 h-3 text-green-500 ml-0.5" />}
    </div>
  );
} 