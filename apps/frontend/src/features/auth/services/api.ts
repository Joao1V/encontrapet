import api from '@/lib/axios';
import type { User } from 'next-auth';
import { z } from 'zod';

export const loginSchema = z.object({
   email: z.email('Email inválido'),
   password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z
   .object({
      fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
      phone: z.string().min(10, 'Celular inválido'),
      email: z.email('Email inválido'),
      birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
      password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
      confirmPassword: z.string().min(8, 'Confirme sua senha'),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
   });

export const forgotPasswordSchema = z.object({
   email: z.email('Email inválido'),
});

export const resetPasswordSchema = z.object({
   password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
   token: z.string(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export interface AuthResponse {
   message: string;
   exp: number;
   token: string;
   user: User;
}

export class AuthService {
   private static readonly BASE_URL = '/users';

   static async login(data: LoginData): Promise<AuthResponse> {
      return api.post<AuthResponse>(`${AuthService.BASE_URL}/login`, data);
   }

   static async logout(): Promise<AuthResponse> {
      return api.post<AuthResponse>(`${AuthService.BASE_URL}/logout`, {
         allSessions: true,
      });
   }

   static async me(): Promise<AuthResponse> {
      return api.get<AuthResponse>(`${AuthService.BASE_URL}/me`);
   }

   static async register(data: RegisterData): Promise<void> {
      // Mapear campos do formulário para o formato do Payload
      const payload = {
         email: data.email,
         password: data.password,
         name: data.fullName,
         phone: data.phone,
         birthDate: data.birthDate,
      };

      // Apenas criar o usuário, NextAuth fará o login
      await api.post(AuthService.BASE_URL, payload);
   }

   static async refreshToken(): Promise<{ token: string }> {
      return api.post<{ token: string }>(`${AuthService.BASE_URL}/refresh-token`, {});
   }

   static async forgotPassword(data: ForgotPasswordData): Promise<void> {
      return api.post(`${AuthService.BASE_URL}/forgot-password`, data);
   }

   static async resetPassword(data: ResetPasswordData): Promise<void> {
      return api.post(`${AuthService.BASE_URL}/reset-password`, data);
   }
}
