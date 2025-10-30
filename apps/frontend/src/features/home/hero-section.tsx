import { Button, Card, CardBody, Chip } from '@heroui/react';

import { MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
   return (
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-content1 py-20 sm:py-28">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
               {/* Left Content */}
               <div className="flex flex-col gap-8">
                  <Chip
                     startContent={<MapPin className="h-4 w-4" />}
                     variant="flat"
                     color="secondary"
                     className="w-fit"
                  >
                     Conectando pets com suas famílias
                  </Chip>

                  <h1 className="text-balance font-bold text-4xl leading-tight sm:text-5xl lg:text-6xl">
                     Ajudamos você a <span className="text-primary">encontrar</span> seu pet perdido
                  </h1>

                  <p className="text-default-600 text-lg leading-relaxed sm:text-xl">
                     Uma plataforma solidária que conecta quem perdeu com quem encontrou. Centralize
                     informações, agilize buscas e fortaleça a rede de apoio aos animais.
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row">
                     <Button
                        as={Link}
                        href="/cadastrar-perdido"
                        color="primary"
                        size="lg"
                        startContent={<Search className="h-5 w-5" />}
                        className="h-15 font-semibold shadow-lg"
                     >
                        Cadastrar Pet Perdido
                     </Button>
                     <Button
                        as={Link}
                        href="/cadastrar-encontrado"
                        color="secondary"
                        size="lg"
                        variant="solid"
                        className="h-15 font-semibold"
                     >
                        Encontrei um Pet
                     </Button>
                  </div>

                  <div className="flex items-center gap-8 pt-4">
                     <div>
                        <div className="font-bold text-3xl">500+</div>
                        <div className="text-default-500 text-sm">Pets cadastrados</div>
                     </div>
                     <div className="h-12 w-px bg-divider" />
                     <div>
                        <div className="font-bold text-3xl">200+</div>
                        <div className="text-default-500 text-sm">Reencontros realizados</div>
                     </div>
                  </div>
               </div>

               {/* Right Image */}
               <div className="relative h-[400px] lg:h-[600px]">
                  <div className="absolute inset-0 overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20">
                     <img
                        src="/happy-dog-reunited-with-owner-emotional-moment.jpg"
                        alt="Pet feliz reencontrado com seu tutor"
                        className="h-full w-full object-cover"
                     />
                  </div>
                  {/* Floating Card */}
                  <Card className="absolute right-8 bottom-8 left-8 shadow-2xl">
                     <CardBody className="p-6">
                        <div className="flex items-center gap-4">
                           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                              <Search className="h-8 w-8 text-primary" />
                           </div>
                           <div>
                              <div className="font-semibold">Busca Inteligente</div>
                              <div className="text-default-600 text-sm">
                                 Encontre pets por localização e características
                              </div>
                           </div>
                        </div>
                     </CardBody>
                  </Card>
               </div>
            </div>
         </div>
      </section>
   );
}
