import { Calendar, MapPin } from 'lucide-react';

interface PetDetailsProps {
   petName: string;
   species: string;
   size: string;
   color: string;
   location: string;
   disappearanceDate: string;
   description: string;
}

export function PetDetails({
   petName,
   species,
   size,
   color,
   location,
   disappearanceDate,
   description,
}: PetDetailsProps) {
   return (
      <div className="flex flex-col gap-4">
         {/* Pet Info Grid */}
         <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg bg-default-100 p-4">
            <div>
               <p className="font-medium text-default-500 text-xs uppercase">Nome</p>
               <p className="font-semibold text-default-900 text-sm">{petName}</p>
            </div>
            <div>
               <p className="font-medium text-default-500 text-xs uppercase">Espécie</p>
               <p className="font-semibold text-default-900 text-sm">{species}</p>
            </div>
            <div>
               <p className="font-medium text-default-500 text-xs uppercase">Porte</p>
               <p className="font-semibold text-default-900 text-sm">{size}</p>
            </div>
            <div>
               <p className="font-medium text-default-500 text-xs uppercase">Cor</p>
               <p className="font-semibold text-default-900 text-sm">{color}</p>
            </div>
         </div>

         {/* Location & Date */}
         <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-2 text-default-700">
               <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger-500" />
               <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-default-700">
               <Calendar className="h-4 w-4 flex-shrink-0 text-warning-500" />
               <span className="text-sm">
                  Desapareceu em: {new Date(disappearanceDate).toLocaleDateString('pt-BR')}
               </span>
            </div>
         </div>

         {/* Description */}
         <p className="text-default-800 text-sm leading-relaxed">{description}</p>
      </div>
   );
}
