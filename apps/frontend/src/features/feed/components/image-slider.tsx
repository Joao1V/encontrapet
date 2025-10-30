'use client';

import { useState } from 'react';
import { Button, Chip } from '@heroui/react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PanInfo } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';

interface ImageSliderProps {
   images: string[];
   aspectClass?: string;
   showDots?: boolean;
   showCountChip?: boolean;
   className?: string;
   children?: React.ReactNode;
}

export function ImageSlider({
   images,
   aspectClass = 'aspect-[4/3]',
   showDots = true,
   showCountChip = true,
   className,
   children,
}: ImageSliderProps) {
   const [index, setIndex] = useState(0);
   const [direction, setDirection] = useState(0);

   const goTo = (next: number, dir: number) => {
      setDirection(dir);
      setIndex(next);
   };

   const next = () => {
      goTo(index === images.length - 1 ? 0 : index + 1, 1);
   };

   const prev = () => {
      goTo(index === 0 ? images.length - 1 : index - 1, -1);
   };

   const variants = {
      enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
   };

   const canSwipe = images.length > 1;
   const swipeConfidenceThreshold = 800;
   const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

   const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!canSwipe) return;
      const offsetX = info.offset.x;
      const velocityX = info.velocity.x;
      const power = swipePower(offsetX, velocityX);

      if (power > swipeConfidenceThreshold || Math.abs(offsetX) > 80) {
         if (offsetX < 0) {
            next();
         } else {
            prev();
         }
      }
   };

   return (
      <div className={`relative ${aspectClass} bg-default-100 ${className ?? ''}`}>
         {showCountChip && images.length > 1 && (
            <Chip
               size="sm"
               variant="flat"
               className="absolute top-3 right-3 z-20 bg-content1/80 backdrop-blur-sm"
            >
               ({index + 1}/{images.length})
            </Chip>
         )}

         <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
               <motion.img
                  key={images[index] || index}
                  src={images[index] || '/placeholder.svg'}
                  alt={`foto ${index + 1}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'tween', ease: 'easeInOut', duration: 0.35 }}
                  className="h-full w-full cursor-grab touch-pan-y object-cover active:cursor-grabbing"
                  drag={canSwipe ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
               />
            </AnimatePresence>
         </div>

         {/* Overlay content (e.g., pet name) */}
         {children && <div className="pointer-events-none absolute inset-0 z-20">{children}</div>}

         {/* Navigation */}
         {images.length > 1 && (
            <>
               <Button
                  variant="flat"
                  isIconOnly
                  className="-translate-y-1/2 absolute top-1/2 left-2 z-20 rounded-full bg-content1/80 shadow-lg backdrop-blur-sm hover:bg-content1"
                  onPress={prev}
                  aria-label="Imagem anterior"
               >
                  <ChevronLeft className="h-5 w-5" />
               </Button>
               <Button
                  variant="flat"
                  isIconOnly
                  className="-translate-y-1/2 absolute top-1/2 right-2 z-20 rounded-full bg-content1/80 shadow-lg backdrop-blur-sm hover:bg-content1"
                  onPress={next}
                  aria-label="Próxima imagem"
               >
                  <ChevronRight className="h-5 w-5" />
               </Button>
            </>
         )}

         {/* Dots */}
         {showDots && images.length > 1 && (
            <div className="-translate-x-1/2 absolute bottom-3 left-1/2 z-20 flex gap-1.5">
               {images.map((_, i) => (
                  <div
                     key={i}
                     className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-1.5 bg-content1/60'}`}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
