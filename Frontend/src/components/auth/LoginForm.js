'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { AtSign, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 로그인 폼 컴포넌트
 */
export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { login } = useAuth();

  async function onSubmit(data) {
    setIsLoading(true);
    setError('');

    try {
      const currentUser = await login(data.email, data.password);
      if (!currentUser.constitution) {
        alert('체질이 없어 사용자에게 맞는 레시피가 없습니다. 체질 진단을 진행해주세요.');
        router.push('/constitution-diagnosis');
      } else {
        router.push('/chatbot');
      }
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          환영합니다!
        </h1>
        <p className="text-muted-foreground text-sm">
          건강한 식단 여정, ChiDiet과 함께 시작하세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            이메일
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none text-muted-foreground">
              <AtSign className="h-4 w-4" />
            </div>
            <motion.div whileFocus="focus" variants={inputVariants}>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10 transition-all"
                disabled={isLoading}
                {...register('email', { 
                  required: '이메일을 입력해주세요', 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '유효한 이메일 주소를 입력해주세요'
                  }
                })}
              />
            </motion.div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            비밀번호
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <motion.div whileFocus="focus" variants={inputVariants}>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 transition-all"
                disabled={isLoading}
                {...register('password', { 
                  required: '비밀번호를 입력해주세요',
                  minLength: {
                    value: 6,
                    message: '비밀번호는 최소 6자 이상이어야 합니다'
                  }
                })}
              />
            </motion.div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-0 bottom-0 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.03 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            type="submit"
            className="w-full py-6 font-medium h-11 shadow-md bg-gradient-to-r from-primary to-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                <span>로그인 중...</span>
              </>
            ) : (
              <span>로그인</span>
            )}
          </Button>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          아직 계정이 없으신가요?{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/90 transition-colors underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
} 