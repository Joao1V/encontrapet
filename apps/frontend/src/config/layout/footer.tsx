import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
   return (
      <footer className="border-border border-t bg-muted/30">
         <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
               {/* Brand */}
               <div>
                  <Link href="/" className="mb-4 flex items-center gap-2">
                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                        <Heart className="h-6 w-6 fill-current text-primary-foreground" />
                     </div>
                     <span className="font-bold font-heading text-foreground text-xl">
                        EncontraPet
                     </span>
                  </Link>
                  <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                     Plataforma solidária para reunir pets perdidos com suas famílias.
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                     <MapPin className="h-4 w-4" />
                     <span>Campo Grande, MS</span>
                  </div>
               </div>

               {/* Links */}
               <div>
                  <h3 className="mb-4 font-semibold text-foreground">Plataforma</h3>
                  <ul className="space-y-3">
                     <li>
                        <Link
                           href="/cadastrar-perdido"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Cadastrar Pet Perdido
                        </Link>
                     </li>
                     <li>
                        <Link
                           href="/cadastrar-encontrado"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Cadastrar Pet Encontrado
                        </Link>
                     </li>
                     <li>
                        <Link
                           href="/buscar"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Buscar Pets
                        </Link>
                     </li>
                     <li>
                        <Link
                           href="/dicas"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Dicas e Orientações
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* About */}
               <div>
                  <h3 className="mb-4 font-semibold text-foreground">Sobre</h3>
                  <ul className="space-y-3">
                     <li>
                        <Link
                           href="/sobre"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Quem Somos
                        </Link>
                     </li>
                     <li>
                        <Link
                           href="/como-funciona"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Como Funciona
                        </Link>
                     </li>
                     <li>
                        <Link
                           href="/parceiros"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Parceiros
                        </Link>
                     </li>
                     <li>
                        <Link
                           href="/contato"
                           className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                           Contato
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Contact */}
               <div>
                  <h3 className="mb-4 font-semibold text-foreground">Contato</h3>
                  <ul className="space-y-3">
                     <li className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Mail className="h-4 w-4" />
                        <a
                           href="mailto:contato@encontrapet.com.br"
                           className="transition-colors hover:text-foreground"
                        >
                           contato@encontrapet.com.br
                        </a>
                     </li>
                     <li className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Phone className="h-4 w-4" />
                        <a
                           href="tel:+5567999999999"
                           className="transition-colors hover:text-foreground"
                        >
                           (67) 99999-9999
                        </a>
                     </li>
                  </ul>
               </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col items-center justify-between gap-4 border-border border-t pt-8 sm:flex-row">
               <p className="text-muted-foreground text-sm">
                  © 2025 EncontraPet. Todos os direitos reservados.
               </p>
               <div className="flex gap-6">
                  <Link
                     href="/privacidade"
                     className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                     Privacidade
                  </Link>
                  <Link
                     href="/termos"
                     className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                     Termos de Uso
                  </Link>
                  <Link
                     href="/lgpd"
                     className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                     LGPD
                  </Link>
               </div>
            </div>
         </div>
      </footer>
   );
}
