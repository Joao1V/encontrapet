'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';

import { AuthService, type RegisterData, registerSchema } from '@/features/auth/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

export default function RegistroPage() {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<RegisterData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         fullName: '',
         phone: '',
         email: '',
         birthDate: '',
         password: '',
         confirmPassword: '',
      },
   });

   const onSubmit = async (data: RegisterData) => {
      setIsLoading(true);
      setError(null);

      try {
         // 1. Criar o usuário no Payload
         await AuthService.register(data);

         // 2. Fazer login com NextAuth (isso cria a sessão)
         const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
         });

         if (result?.error) {
            setError('Conta criada, mas erro ao fazer login. Tente fazer login manualmente.');
            return;
         }

         // 3. Redirecionar para o feed
         router.push('/feed');
      } catch (err: any) {
         console.error('Registration error:', err);
         setError(
            err.response?.data?.errors?.[0]?.message ||
               err.message ||
               'Erro ao criar conta. Tente novamente.',
         );
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4 py-12">
         <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="flex flex-col items-center gap-3 pt-8 pb-4">
               <h1 className="text-center font-bold text-3xl">Criar Conta</h1>
               <p className="text-center text-default-500">Junte-se a nós e ajude pets perdidos</p>
            </CardHeader>
            <CardBody className="gap-6 px-8 pb-8">
               <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <Input
                     type="text"
                     label="Nome Completo"
                     placeholder="João Silva"
                     startContent={<User className="h-4 w-4 text-default-400" />}
                     {...register('fullName')}
                     isInvalid={!!errors.fullName}
                     errorMessage={errors.fullName?.message}
                     isRequired
                  />

                  <Input
                     type="tel"
                     label="Celular"
                     placeholder="(67) 99999-9999"
                     startContent={<Phone className="h-4 w-4 text-default-400" />}
                     {...register('phone')}
                     isInvalid={!!errors.phone}
                     errorMessage={errors.phone?.message}
                     isRequired
                  />

                  <Input
                     type="email"
                     label="Email"
                     placeholder="seu@email.com"
                     startContent={<Mail className="h-4 w-4 text-default-400" />}
                     {...register('email')}
                     isInvalid={!!errors.email}
                     errorMessage={errors.email?.message}
                     isRequired
                  />

                  <Input
                     type="date"
                     label="Data de Nascimento"
                     startContent={<Calendar className="h-4 w-4 text-default-400" />}
                     {...register('birthDate')}
                     isInvalid={!!errors.birthDate}
                     errorMessage={errors.birthDate?.message}
                     isRequired
                  />

                  <Input
                     type={showPassword ? 'text' : 'password'}
                     label="Senha"
                     placeholder="Mínimo 8 caracteres"
                     startContent={<Lock className="h-4 w-4 text-default-400" />}
                     endContent={
                        <Button
                           isIconOnly
                           type="button"
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
                     {...register('password')}
                     isInvalid={!!errors.password}
                     errorMessage={errors.password?.message}
                     isRequired
                  />

                  <Input
                     type={showConfirmPassword ? 'text' : 'password'}
                     label="Confirme a Senha"
                     placeholder="Digite a senha novamente"
                     startContent={<Lock className="h-4 w-4 text-default-400" />}
                     endContent={
                        <Button
                           isIconOnly
                           type="button"
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
                     {...register('confirmPassword')}
                     isInvalid={!!errors.confirmPassword}
                     errorMessage={errors.confirmPassword?.message}
                     isRequired
                  />

                  {error && (
                     <div className="rounded-lg border border-danger bg-danger-50 px-4 py-3 text-danger text-sm">
                        {error}
                     </div>
                  )}

                  <Button
                     type="submit"
                     color="primary"
                     size="lg"
                     className="mt-2 font-semibold"
                     isLoading={isLoading}
                  >
                     Criar Conta
                  </Button>
               </form>

               <Divider />

               <p className="text-center text-default-500 text-sm">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                     Entrar
                  </Link>
               </p>
            </CardBody>
         </Card>
      </div>
   );
}
