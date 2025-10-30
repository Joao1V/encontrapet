import { Button } from '@heroui/react';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
   return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 py-20 sm:py-28">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10">
            <div
               className="absolute inset-0"
               style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px',
               }}
            />
         </div>

         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
               <h2 className="mb-6 text-balance font-bold text-3xl text-primary-foreground sm:text-4xl lg:text-5xl">
                  Pronto para ajudar um pet a voltar para casa?
               </h2>
               <p className="mb-10 text-lg text-primary-foreground/90 leading-relaxed sm:text-xl">
                  Junte-se à nossa comunidade solidária e faça parte dessa rede de apoio aos
                  animais. Cada cadastro pode ser o início de um reencontro emocionante.
               </p>
               <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                     as={Link}
                     href="/cadastrar"
                     className="inline-flex h-15 items-center justify-center rounded-lg bg-background px-8 py-4 font-semibold text-base text-foreground shadow-xl transition-colors hover:bg-background/90"
                  >
                     Começar Agora
                     <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button
                     as={Link}
                     href="/sobre"
                     className="inline-flex h-15 items-center justify-center rounded-lg border-2 border-primary-foreground/20 bg-primary-foreground/10 px-8 py-4 font-semibold text-base text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
                  >
                     Saiba Mais
                  </Button>
               </div>
            </div>
         </div>
      </section>
   );
}
