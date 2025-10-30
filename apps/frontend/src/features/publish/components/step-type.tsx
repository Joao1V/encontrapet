'use client';
import { Card, CardBody } from '@heroui/react';
import { PUBLICATION_TYPE_OPTIONS } from '@encontra-pet/utils';

import { HandHeart, Search } from 'lucide-react';

type Props = {
   value?: 'lost' | 'found';
   onChange(value: 'lost' | 'found'): void;
};

export default function StepType({ value, onChange }: Props) {
   return (
      <div className="flex flex-col gap-6">
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PUBLICATION_TYPE_OPTIONS.filter((o) => o.value === 'lost' || o.value === 'found').map(
               (opt) => {
                  const selected = value === opt.value;
                  const Icon = opt.value === 'lost' ? Search : HandHeart;
                  const subtitle =
                     opt.value === 'lost' ? 'Perdi meu animal' : 'Encontrei um animal';
                  const description =
                     opt.value === 'lost'
                        ? 'Avise que seu pet está perdido e receba ajuda para encontrá-lo.'
                        : 'Compartilhe que você encontrou um animal para que o tutor o encontre.';
                  return (
                     <Card
                        key={opt.value}
                        isPressable
                        shadow={'sm'}
                        onPress={() => onChange(opt.value as 'lost' | 'found')}
                        className={'transition-shadow hover:shadow-md'}
                     >
                        <CardBody className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                           <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Icon className="h-7 w-7" />
                           </div>
                           <div className="font-semibold text-lg">{subtitle}</div>
                           <div className="max-w-[28ch] text-default-500 text-sm">
                              {description}
                           </div>
                        </CardBody>
                     </Card>
                  );
               },
            )}
         </div>
      </div>
   );
}
