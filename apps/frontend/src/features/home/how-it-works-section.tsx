import { Card, CardBody } from '@heroui/react';

import { Camera, MessageCircle, Search, UserPlus } from 'lucide-react';

const steps = [
   {
      number: '01',
      icon: UserPlus,
      title: 'Crie sua conta',
      description: 'Cadastre-se gratuitamente em menos de 1 minuto. É rápido, fácil e seguro.',
   },
   {
      number: '02',
      icon: Camera,
      title: 'Cadastre o pet',
      description:
         'Adicione fotos, características, localização e informações de contato do animal.',
   },
   {
      number: '03',
      icon: Search,
      title: 'Busque ou aguarde',
      description: 'Procure por pets encontrados ou aguarde alguém encontrar o seu pet perdido.',
   },
   {
      number: '04',
      icon: MessageCircle,
      title: 'Conecte-se',
      description: 'Entre em contato direto com quem encontrou ou perdeu o pet para o reencontro.',
   },
];

export function HowItWorksSection() {
   return (
      <section id="como-funciona" className="bg-muted/30 py-20 sm:py-28">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
               <h2 className="mb-4 text-balance font-bold text-3xl text-foreground sm:text-4xl lg:text-5xl">
                  Como funciona?
               </h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                  Em apenas 4 passos simples, você pode ajudar a reunir um pet com sua família
               </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                     <div key={index} className="relative">
                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                           <div className="absolute top-16 left-[calc(50%+2rem)] hidden h-0.5 w-[calc(100%-4rem)] bg-border lg:block" />
                        )}

                        <Card className="overflow-visible border border-gray-200">
                           <CardBody className="relative overflow-visible p-6 text-center">
                              <div className="-top-3 -translate-x-1/2 absolute left-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6b35] font-bold text-sm text-white shadow-sm">
                                 {step.number}
                              </div>
                              <div className="flex w-full items-center justify-center">
                                 <div className="mt-2 mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#d4f1f4] text-[#4fc3cf]">
                                    <Icon className="h-7 w-7" />
                                 </div>
                              </div>

                              <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                 {step.title}
                              </h3>

                              <p className="text-gray-500 text-sm leading-relaxed">
                                 {step.description}
                              </p>
                           </CardBody>
                        </Card>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
