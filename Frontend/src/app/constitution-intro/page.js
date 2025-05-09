'use client';

import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ConstitutionIntroPage() {
  const router = useRouter();

  return (
    <SidebarLayout>
      <div className="flex flex-col items-center justify-center h-full min-h-screen px-4 md:px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-4">체질 진단 안내</h1>
        <p className="text-base text-muted-foreground mb-8 max-w-lg">
          ChiDiet의 체질 진단은 한의학 이론을 기반으로 질문을 통해 당신의 체질을 분석합니다.
          체질 진단 결과에 따라 맞춤 레시피와 식단을 제공해드립니다.
        </p>
        <Button
          className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary/90"
          onClick={() => router.push('/constitution-diagnosis')}
        >
          체질 진단 시작
        </Button>
      </div>
    </SidebarLayout>
  );
} 