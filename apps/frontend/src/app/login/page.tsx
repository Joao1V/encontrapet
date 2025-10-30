'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';

import { getFieldErrorProps } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const emailLoginSchema = z.object({
   email: z.email('Email inválido'),
   password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const phoneLoginSchema = z.object({
   phone: z
      .string()
      .min(10, 'Celular inválido')
      .regex(/^$$\d{2}$$\s?\d{4,5}-?\d{4}$/, 'Formato inválido'),
   password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type EmailLoginForm = z.infer<typeof emailLoginSchema>;
type PhoneLoginForm = z.infer<typeof phoneLoginSchema>;

export default function LoginPage() {
   const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   const emailForm = useForm<EmailLoginForm>({
      resolver: zodResolver(emailLoginSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   });

   const phoneForm = useForm<PhoneLoginForm>({
      resolver: zodResolver(phoneLoginSchema),
      defaultValues: {
         phone: '',
         password: '',
      },
   });

   const handleSubmit = async (data: EmailLoginForm | PhoneLoginForm) => {
      setIsLoading(true);
      setError(null);

      try {
         if ('email' in data) {
            const res = await signIn('credentials', {
               ...data,
               redirect: false,
            });
            console.log(res);
            router.push('/feed');
         } else {
            setError('Login com celular não está disponível no momento.');
         }
      } catch (err) {
         console.error('Login error:', err);
         setError(
            err instanceof Error ? err.message : 'Erro ao fazer login. Verifique suas credenciais.',
         );
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
         <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="flex flex-col items-center gap-3 pt-8 pb-4">
               <h1 className="text-center font-bold text-3xl">Bem-vindo de volta!</h1>
               <p className="text-center text-default-500">Entre para continuar ajudando pets</p>
            </CardHeader>
            <CardBody className="gap-6 px-8 pb-8">
               <div className="flex gap-2">
                  <Button
                     fullWidth
                     variant={loginMethod === 'email' ? 'solid' : 'bordered'}
                     color={loginMethod === 'email' ? 'primary' : 'default'}
                     startContent={<Mail className="h-4 w-4" />}
                     onPress={() => setLoginMethod('email')}
                  >
                     Email
                  </Button>
                  <Button
                     fullWidth
                     variant={loginMethod === 'phone' ? 'solid' : 'bordered'}
                     color={loginMethod === 'phone' ? 'primary' : 'default'}
                     startContent={<Phone className="h-4 w-4" />}
                     onPress={() => setLoginMethod('phone')}
                  >
                     Celular
                  </Button>
               </div>

               {loginMethod === 'email' ? (
                  <form
                     onSubmit={emailForm.handleSubmit(handleSubmit)}
                     className="flex flex-col gap-4"
                  >
                     <Controller
                        name="email"
                        control={emailForm.control}
                        render={({ field, fieldState }) => (
                           <Input
                              type="email"
                              label="Email"
                              placeholder="seu@email.com"
                              startContent={<Mail className="h-4 w-4 text-default-400" />}
                              {...field}
                              {...getFieldErrorProps(fieldState)}
                              isRequired
                           />
                        )}
                     />

                     <Controller
                        name="password"
                        control={emailForm.control}
                        render={({ field, fieldState }) => (
                           <Input
                              type={showPassword ? 'text' : 'password'}
                              label="Senha"
                              placeholder="Digite sua senha"
                              startContent={<Lock className="h-4 w-4 text-default-400" />}
                              endContent={
                                 <Button
                                    type="button"
                                    isIconOnly
                                    variant={'light'}
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none"
                                 >
                                    {showPassword ? (
                                       <EyeOff className="h-4 w-4 text-default-400" />
                                    ) : (
                                       <Eye className="h-4 w-4 text-default-400" />
                                    )}
                                 </Button>
                              }
                              {...field}
                              {...getFieldErrorProps(fieldState)}
                              isRequired
                           />
                        )}
                     />
                  </form>
               ) : (
                  <form
                     onSubmit={phoneForm.handleSubmit(handleSubmit)}
                     className="flex flex-col gap-4"
                  >
                     <Controller
                        name="phone"
                        control={phoneForm.control}
                        render={({ field, fieldState }) => (
                           <Input
                              type="tel"
                              label="Celular"
                              placeholder="(67) 99999-9999"
                              startContent={<Phone className="h-4 w-4 text-default-400" />}
                              {...field}
                              {...getFieldErrorProps(fieldState)}
                              isRequired
                           />
                        )}
                     />

                     <Controller
                        name="password"
                        control={phoneForm.control}
                        render={({ field, fieldState }) => (
                           <Input
                              type={showPassword ? 'text' : 'password'}
                              label="Senha"
                              placeholder="Digite sua senha"
                              startContent={<Lock className="h-4 w-4 text-default-400" />}
                              endContent={
                                 <Button
                                    type="button"
                                    isIconOnly
                                    size={'sm'}
                                    variant={'light'}
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none"
                                 >
                                    {showPassword ? (
                                       <EyeOff className="h-4 w-4 text-default-400" />
                                    ) : (
                                       <Eye className="h-4 w-4 text-default-400" />
                                    )}
                                 </Button>
                              }
                              {...field}
                              {...getFieldErrorProps(fieldState)}
                              isRequired
                           />
                        )}
                     />
                  </form>
               )}

               <div className="flex justify-end">
                  <Link href="/recuperar-senha" className="text-primary text-sm hover:underline">
                     Esqueceu a senha?
                  </Link>
               </div>

               {error && (
                  <div className="rounded-lg border border-danger bg-danger-50 px-4 py-3 text-danger text-sm">
                     {error}
                  </div>
               )}

               <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="font-semibold"
                  isLoading={isLoading}
                  onPress={() => {
                     if (loginMethod === 'email') {
                        emailForm.handleSubmit(handleSubmit)();
                     } else {
                        phoneForm.handleSubmit(handleSubmit)();
                     }
                  }}
               >
                  Entrar
               </Button>

               <Divider />

               <p className="text-center text-default-500 text-sm">
                  Não tem uma conta?{' '}
                  <Link href="/registro" className="font-semibold text-primary hover:underline">
                     Cadastre-se
                  </Link>
               </p>
            </CardBody>
         </Card>
      </div>
   );
}
