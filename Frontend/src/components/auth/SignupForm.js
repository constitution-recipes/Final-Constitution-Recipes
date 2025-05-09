'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { authService } from '@/lib/services/authService';
import axios from 'axios';

/**
 * 회원가입 폼 컴포넌트
 */
export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  // 1단계: 회원가입 정보
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  // 2단계: 프로필 정보
  const [profileData, setProfileData] = useState({
    allergies: [],
    healthGoals: [],
    currentHealthStatus: 'average',
    existingConditions: '',
  });

  // 알레르기 옵션 정의
  const allergyOptions = [
    { id: 'none', label: '알레르기 없음' },
    { id: 'peanuts', label: '땅콩' },
    { id: 'treeNuts', label: '견과류' },
    { id: 'milk', label: '우유' },
    { id: 'eggs', label: '계란' },
    { id: 'fish', label: '생선' },
    { id: 'shellfish', label: '조개류' },
    { id: 'wheat', label: '밀가루' },
    { id: 'soy', label: '대두' },
    { id: 'sesame', label: '참깨' },
    { id: 'corn', label: '옥수수' },
    { id: 'fruits', label: '과일류' },
  ];

  // 건강 목표 옵션
  const healthGoalOptions = [
    { value: 'weight_loss', label: '체중 감량' },
    { value: 'muscle_gain', label: '근육 증가' },
    { value: 'cardiovascular_health', label: '심혈관 건강' },
    { value: 'flexibility', label: '유연성 향상' },
    { value: 'energy', label: '에너지 증진' },
  ];

  // 건강 상태 옵션
  const healthStatusOptions = [
    { value: 'poor', label: '나쁨' },
    { value: 'average', label: '보통' },
    { value: 'good', label: '좋음' },
  ];

  // 1단계 입력 핸들러
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 2단계 입력 핸들러
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 알레르기 변경 핸들러 (2단계)
  const handleAllergyChange = (allergyId) => {
    setProfileData(prev => {
      if (allergyId === 'none') {
        return {
          ...prev,
          allergies: prev.allergies.includes('none') ? [] : ['none']
        };
      }
      if (prev.allergies.includes('none')) {
        return prev;
      }
      const newAllergies = prev.allergies.includes(allergyId)
        ? prev.allergies.filter(id => id !== allergyId)
        : [...prev.allergies, allergyId];
      return {
        ...prev,
        allergies: newAllergies
      };
    });
  };

  // 건강목표 변경 핸들러 (2단계)
  const handleHealthGoalChange = (goalValue) => {
    setProfileData(prev => {
      const newGoals = prev.healthGoals.includes(goalValue)
        ? prev.healthGoals.filter(g => g !== goalValue)
        : [...prev.healthGoals, goalValue];
      return {
        ...prev,
        healthGoals: newGoals
      };
    });
  };

  // 1단계 유효성 검사
  const validateStep1 = () => {
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.phoneNumber) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    return true;
  };

  // 1단계: 회원가입
  const handleSignup = async (e) => {
    console.log('handleSignup triggered', signupData);
    e.preventDefault();
    setError('');
    // 필수 입력값 확인
    if (!validateStep1()) {
      return;
    }
    setIsLoading(true);
    try {
      console.log('Checking email existence for:', signupData.email);
      // 이메일 중복 검사 (authService 사용)
      const exists = await authService.emailExists(signupData.email);
      if (exists) {
        console.log('Email already exists');
        setError('이미 사용 중인 이메일입니다.');
        return;
      }
      console.log('Email available, moving to next step');
      // 모든 입력이 정상이고 이메일 중복이 아니면 다음 단계로 이동
      setStep(2);
    } catch (error) {
      console.error('handleSignup error:', error);
      setError('이메일 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2단계: 프로필을 포함한 최종 회원가입
  const handleProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 알레르기 ID를 한국어 라벨로 매핑
    const koreanAllergies = profileData.allergies.map(id => {
      const opt = allergyOptions.find(a => a.id === id);
      return opt ? opt.label : id;
    });

    // 건강 상태 한글 라벨 매핑
    const healthStatusKorean = (() => {
      const opt = healthStatusOptions.find(o => o.value === profileData.currentHealthStatus);
      return opt ? opt.label : profileData.currentHealthStatus;
    })();

    // 건강 목표 한글 라벨 매핑
    const healthGoalsKorean = profileData.healthGoals.map(val => {
      const opt = healthGoalOptions.find(g => g.value === val);
      return opt ? opt.label : val;
    });

    // 회원가입 기본 정보와 프로필 정보를 alias 기반 camelCase 키로 합쳐 요청
    const userData = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      phoneNumber: signupData.phoneNumber,
      allergies: koreanAllergies,
      healthStatus: healthStatusKorean,
      existingConditions: profileData.existingConditions || "",
      healthGoals: healthGoalsKorean
    };

    try {
      await authService.signup(userData);
      // 회원가입 후 체질 진단 소개 페이지로 이동
      router.push('/constitution-intro');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('이미 사용 중인 이메일입니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {step === 1 ? '회원가입' : '건강 프로필 작성'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {step === 1 
            ? '건강한 삶을 위한 첫 걸음, ChiDiet과 함께하세요'
            : '맞춤형 건강 관리를 위한 정보를 입력해주세요'}
        </p>
      </div>
      {error && (
        <Alert variant="destructive" className="text-sm animate-shake">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={step === 1 ? handleSignup : handleProfile} className="space-y-4">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={signupData.name}
                onChange={handleSignupChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={signupData.email}
                onChange={handleSignupChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="안전한 비밀번호를 입력하세요"
                value={signupData.password}
                onChange={handleSignupChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">전화번호</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="010-0000-0000"
                value={signupData.phoneNumber}
                onChange={handleSignupChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full font-semibold h-11 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '다음 단계'}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>알레르기 정보</Label>
                <p className="text-sm text-muted-foreground">
                  해당되는 알레르기를 모두 선택해주세요.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((allergy) => (
                  <button
                    key={allergy.id}
                    type="button"
                    onClick={() => handleAllergyChange(allergy.id)}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      "border hover:bg-accent hover:text-accent-foreground",
                      profileData.allergies.includes(allergy.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input",
                      allergy.id !== 'none' && profileData.allergies.includes('none') && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isLoading || (allergy.id !== 'none' && profileData.allergies.includes('none'))}
                  >
                    {allergy.label}
                    {profileData.allergies.includes(allergy.id) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {profileData.allergies.length > 0 && !profileData.allergies.includes('none') && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium mb-2">선택된 알레르기:</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.allergies.map(id => {
                      const allergy = allergyOptions.find(opt => opt.id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="flex items-center gap-1 py-1"
                        >
                          {allergy?.label}
                          <button
                            type="button"
                            onClick={() => handleAllergyChange(id)}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>건강 목표</Label>
              <div className="flex flex-wrap gap-2">
                {healthGoalOptions.map(goal => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => handleHealthGoalChange(goal.value)}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      "border hover:bg-accent hover:text-accent-foreground",
                      profileData.healthGoals.includes(goal.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input"
                    )}
                    disabled={isLoading}
                  >
                    {goal.label}
                    {profileData.healthGoals.includes(goal.value) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentHealthStatus">현재 건강 상태</Label>
              <select
                id="currentHealthStatus"
                name="currentHealthStatus"
                value={profileData.currentHealthStatus}
                onChange={handleProfileChange}
                disabled={isLoading}
                className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              >
                <option value="poor">나쁨</option>
                <option value="average">보통</option>
                <option value="good">좋음</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingConditions">현재 질병</Label>
              <Input
                id="existingConditions"
                name="existingConditions"
                type="text"
                placeholder="현재 겪고 있는 질병이 있다면 입력하세요"
                value={profileData.existingConditions}
                onChange={handleProfileChange}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                이전
              </Button>
              <Button
                type="submit"
                className="w-full font-semibold h-11 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? '저장 중...' : '가입 완료'}
              </Button>
            </div>
          </>
        )}

        <div className="text-center text-sm text-muted-foreground mt-8">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-semibold">
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
} 