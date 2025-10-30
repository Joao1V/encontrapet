import { Heart } from 'lucide-react';

export function AppLogo() {
   return (
      <div className="flex items-center gap-2">
         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-6 w-6 fill-current text-primary-foreground" />
         </div>
         <span className="font-bold font-heading text-xl">EncontraPet</span>
      </div>
   );
}
