'use client';

import { Avatar, Button, Card, Chip } from '@heroui/react';

import type { Publication } from '@/features/publish/services';
import { disappearanceWithDays, formatRelative } from '@/helpers/date';
import { Calendar, Cat, Dog, MapPin, MessageCircle } from 'lucide-react';
import { ImageSlider } from './image-slider';
import { ShareDropdown } from './share-dropdown';

interface PostCardProps extends Publication {}

export function PostCard(props: PostCardProps) {
   const status = props.type === 'adoption' ? 'found' : props.type;
   const animal = typeof props.animal === 'object' ? props.animal : null;
   const user = typeof props.user === 'object' ? props.user : null;
   const location = typeof props.location === 'object' ? props.location : null;
   const images = props.photos?.map((photo) => photo.url || '').filter(Boolean) || [];

   const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, '');

   const handleWhatsApp = () => {
      const message = encodeURIComponent(
         `Olá! Vi seu anúncio sobre o pet ${animal?.name} no PetFinder.`,
      );
      const phone = user?.phone ? normalizePhone(user.phone) : '';
      if (!phone) return;
      window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
   };

   return (
      <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
         <div style={{ fontFamily: 'var(--font-fredoka)' }}>
            {/* Owner Info */}
            <div className="flex items-center justify-between p-4">
               <div className="flex items-center gap-3">
                  <Avatar name={user?.name} className="h-10 w-10 border-2 border-primary/20" />
                  <div>
                     <p
                        className="font-semibold text-foreground"
                        style={{ fontFamily: 'var(--font-geist-sans)' }}
                     >
                        {user?.name}
                     </p>
                     <p
                        className="text-default-500 text-sm"
                        style={{ fontFamily: 'var(--font-geist-sans)' }}
                     >
                        {formatRelative(props.createdAt)}
                     </p>
                  </div>
               </div>
               <Chip
                  color={status === 'lost' ? 'danger' : 'default'}
                  variant="flat"
                  className="font-semibold"
               >
                  {status === 'lost' ? 'Perdido' : 'Encontrado'}
               </Chip>
            </div>

            {/* Pet Images Slider (componentized with slide animation) */}
            <ImageSlider images={images} aspectClass="aspect-[4/3]">
               <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-white backdrop-blur-sm">
                     {animal?.species === 'cat' ? (
                        <Cat className="h-5 w-5" />
                     ) : (
                        <Dog className="h-5 w-5" />
                     )}
                     <span className="font-bold text-lg drop-shadow-md">{animal?.name}</span>
                  </div>
               </div>
            </ImageSlider>

            {/* Pet Info */}
            <div className="space-y-4 p-4">
               {/* Basic Info (pet name moved to image overlay) */}
               <div>
                  <div className="flex flex-wrap gap-2">
                     {animal?.size && (
                        <Chip variant="flat" className="font-medium">
                           Porte {animal.size}
                        </Chip>
                     )}
                     {animal?.color && (
                        <Chip variant="flat" className="font-medium">
                           {animal.color}
                        </Chip>
                     )}
                  </div>
               </div>

               {/* Location */}
               {location && (
                  <div className="flex items-start gap-2 text-sm">
                     <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                     <div>
                        <p className="font-semibold text-foreground">Visto pela última vez:</p>
                        <p className="text-default-500">
                           {location.district && `${location.district}, `}
                           {location.city} - {location.state}
                        </p>
                     </div>
                  </div>
               )}

               {/* Date */}
               {animal?.disappearance_date && (
                  <div className="flex items-center gap-2 text-sm">
                     <Calendar className="h-5 w-5 flex-shrink-0 text-primary" />
                     <div>
                        <p className="font-semibold text-foreground">
                           Data de {status === 'lost' ? 'desaparecimento' : 'encontro'}:
                        </p>
                        <p className="text-default-500">
                           {disappearanceWithDays(animal.disappearance_date)}
                        </p>
                     </div>
                  </div>
               )}

               {/* Description */}
               {props.description && (
                  <div>
                     <p className="text-foreground text-sm leading-relaxed">{props.description}</p>
                  </div>
               )}

               {/* Action Buttons */}
               <div className="flex gap-2 pt-2">
                  <Button
                     onPress={handleWhatsApp}
                     className="flex-1 gap-2 bg-[#25D366] font-semibold text-white hover:bg-[#20BA5A]"
                  >
                     <MessageCircle className="h-4 w-4" />
                     Contato WhatsApp
                  </Button>
                  <ShareDropdown
                     title={`${status === 'lost' ? 'Pet Perdido' : 'Pet Encontrado'}: ${animal?.name || 'Pet'}`}
                     description={props.description || ''}
                  />
               </div>
            </div>
         </div>
      </Card>
   );
}
