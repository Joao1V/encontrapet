import { Heart, MapPin, TrendingUp, Users } from 'lucide-react';

const stats = [
   {
      icon: Heart,
      value: '200+',
      label: 'Reencontros realizados',
      description: 'Pets felizes de volta para casa',
   },
   {
      icon: Users,
      value: '1.500+',
      label: 'Usuários ativos',
      description: 'Comunidade crescendo diariamente',
   },
   {
      icon: MapPin,
      value: '50+',
      label: 'Cidades atendidas',
      description: 'Expandindo por todo Brasil',
   },
   {
      icon: TrendingUp,
      value: '85%',
      label: 'Taxa de sucesso',
      description: 'Pets encontrados em até 7 dias',
   },
];

export function StatsSection() {
   return (
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 sm:py-28">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
               <h2 className="mb-4 text-balance font-bold text-3xl text-foreground sm:text-4xl lg:text-5xl">
                  Nosso impacto na comunidade
               </h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                  Números que mostram a força da solidariedade e do trabalho em rede
               </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
               {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                     <div
                        key={index}
                        className="rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                     >
                        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                           <Icon className="h-7 w-7" />
                        </div>
                        <div className="mb-2 font-bold text-4xl text-foreground">{stat.value}</div>
                        <div className="mb-2 font-semibold text-base text-card-foreground">
                           {stat.label}
                        </div>
                        <div className="text-muted-foreground text-sm">{stat.description}</div>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
