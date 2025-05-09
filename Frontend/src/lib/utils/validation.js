import { z } from 'zod';

/**
 * 이메일 유효성 검증 스키마
 */
export const emailSchema = z
  .string()
  .min(1, { message: '이메일을 입력해주세요.' })
  .email({ message: '유효한 이메일 주소를 입력해주세요.' });

/**
 * 비밀번호 유효성 검증 스키마
 */
export const passwordSchema = z
  .string()
  .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' });

/**
 * 이름 유효성 검증 스키마
 */
export const nameSchema = z
  .string()
  .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' });

/**
 * 전화번호 유효성 검증 스키마
 * 간단한 한국 휴대폰 번호 형식 (예: 010-1234-5678 또는 01012345678)
 */
export const phoneSchema = z
  .string()
  .min(1, { message: '전화번호를 입력해주세요.' })
  .regex(/^(01[016789]|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/, {
    message: '유효한 전화번호 형식이 아닙니다.',
  });

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneSchema,
  allergies: z.string().optional(),
  healthGoals: z.string().optional(),
  currentHealthStatus: z.string().optional(),
  existingConditions: z.string().optional(),
});

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}); 