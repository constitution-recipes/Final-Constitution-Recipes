"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/chatbot');
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isLoading && isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 네비게이션 (NavBar 스타일) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary via-primary to-secondary">
              ChiDiet
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm">로그인</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* 헤더 높이 만큼 간격 확보 */}
      <div className="h-16"></div>

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-dot-pattern min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <div className="space-y-4 animate-fade-in backdrop-blur-[2px] p-6 rounded-2xl bg-background/20">
              <Badge variant="outline" className="px-4 py-1 text-sm backdrop-blur-sm bg-background/50">
                ✨ AI 기반 맞춤형 건강 관리 플랫폼
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-[1.2] lg:leading-[1.15] tracking-tight">
                전통 지식과 현대 AI로<span className="hidden md:inline"><br /></span>{' '}
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-transparent bg-clip-text">
                  건강한 삶을 위한 맞춤형 솔루션
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                몸의 균형을 찾고 체질에 맞는 건강법을 발견하세요.<br />
                <span className="md:whitespace-nowrap">
                  ChiDiet은 당신의 건강 여정을 과학적이고 개인화된 방식으로 도와드립니다.
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="group w-full sm:w-auto">
                  더 알아보기
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-1 text-sm">
              주요 기능
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-transparent bg-clip-text">
                ChiDiet
              </span>
              의 특별한 기능
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              최신 AI 기술과 전통 의학을 결합하여 당신만을 위한 맞춤형 건강 관리 서비스를 제공합니다
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <HoverCard key={index} openDelay={200}>
                <HoverCardTrigger>
                  <Card className="p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-b from-card to-card/50">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        {feature.icon}
                      </div>
                      <Badge variant="outline" className="absolute top-0 right-0">
                        {feature.badge}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[320px] backdrop-blur-sm bg-card/80">
                  <ScrollArea className="h-[180px] pr-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.longDescription}
                      </p>
                      <div className="pt-2">
                        <Badge variant="secondary" className="mr-2">
                          {feature.tags[0]}
                        </Badge>
                        <Badge variant="secondary" className="mr-2">
                          {feature.tags[1]}
                        </Badge>
                        <Badge variant="secondary">
                          {feature.tags[2]}
                        </Badge>
                      </div>
                    </div>
                  </ScrollArea>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 border-t bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left space-y-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-transparent bg-clip-text">
                  ChiDiet
                </div>
                <p className="text-muted-foreground">건강한 삶을 위한 맞춤형 솔루션</p>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            © 2025 ChiDiet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    title: "맞춤형 체질 분석",
    description: "과학적 설문과 AI 분석을 통해 당신의 체질을 정확히 진단합니다.",
    longDescription: "최신 AI 기술과 전통 의학 지식을 결합하여 개인의 체질을 정확하게 분석하고, 이를 바탕으로 맞춤형 건강 솔루션을 제공합니다. 빅데이터 분석을 통해 당신의 체질에 가장 적합한 건강 관리 방법을 제시합니다.",
    badge: "AI 분석",
    tags: ["체질 분석", "빅데이터", "맞춤 솔루션"]
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    title: "건강 목표 달성",
    description: "개인화된 식단과 운동법으로 건강 목표 달성을 돕습니다.",
    longDescription: "체중 관리, 면역력 강화, 스트레스 감소 등 당신의 건강 목표에 맞는 맞춤형 식단과 운동 계획을 제공합니다. 실시간 진행 상황 추적과 조언을 통해 목표 달성을 지원합니다.",
    badge: "맞춤 설계",
    tags: ["목표 관리", "맞춤 식단", "운동 계획"]
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v6h6"></path>
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
        <path d="M21 22v-6h-6"></path>
        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
      </svg>
    ),
    title: "지속적인 건강 관리",
    description: "정기적인 피드백과 모니터링으로 건강을 관리합니다.",
    longDescription: "실시간 건강 데이터 분석과 정기적인 피드백을 통해 당신의 건강 상태를 지속적으로 모니터링하고 개선방안을 제시합니다. AI 기반 알고리즘이 24시간 당신의 건강을 관리합니다.",
    badge: "24/7 관리",
    tags: ["실시간 모니터링", "데이터 분석", "맞춤 피드백"]
  }
]; 