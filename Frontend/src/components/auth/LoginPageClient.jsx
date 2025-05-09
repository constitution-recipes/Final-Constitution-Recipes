'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 애니메이션 변형
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
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

const features = [
  {
    icon: '🌱',
    title: '체질 맞춤 진단',
    description: '한의학 기반 체질 분석으로 당신에게 맞는 식단을 제안합니다.'
  },
  {
    icon: '🍜',
    title: '건강식 레시피',
    description: '체질과 건강 상태에 최적화된 맞춤형 레시피를 제공합니다.'
  },
  {
    icon: '📊',
    title: '영양 분석',
    description: '섭취하는 음식의 영양소를 분석하여 균형 잡힌 식단을 제안합니다.'
  },
  {
    icon: '🛒',
    title: '식재료 추천',
    description: '건강에 좋은 식재료와 대체 식품을 추천해 드립니다.'
  }
];

export default function LoginPageClient() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 소개 영역 */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-gradient-to-br from-background to-primary/5">
        {/* 배경 이미지와 효과 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-pattern-dots opacity-[0.03] dark:opacity-[0.05]" />
        </div>
        
        {/* 블러 효과 원형들 */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        
        {/* 메인 컨텐츠 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative h-full flex flex-col items-center justify-center p-12 text-center"
        >
          <motion.div variants={itemVariants} className="mb-12 relative">
            <div className="relative w-36 h-36 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-2xl" />
              <div className="relative w-full h-full rounded-full glass-effect border border-white/40 flex items-center justify-center">
                <span className="text-6xl">🌿</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              건강 여정의 <br />새로운 시작
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              한의학 지식과 AI의 만남으로<br />
              당신만을 위한 맞춤형 건강 식단을 제안합니다
            </p>
          </motion.div>
          
          {/* 특징 카드 리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-5 rounded-xl glass-effect border border-white/20 hover:border-primary/20 transition-all shadow-soft hover:shadow-md group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-3 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="font-medium text-base text-foreground mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 오른쪽 로그인 영역 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white"
      >
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-10"
          >
            <Link href="/" className="inline-block group">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary text-transparent bg-clip-text group-hover:opacity-90 transition-opacity">
                ChiDiet
              </div>
            </Link>
          </motion.div>
          
          {/* 로그인 폼 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="card shadow-soft border border-border/40"
          >
            <LoginForm />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 