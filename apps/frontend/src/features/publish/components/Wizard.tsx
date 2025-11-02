'use client';
import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Skeleton, useDisclosure } from '@heroui/react';
import { LABEL_BY_VALUE } from '@encontra-pet/utils';

import { ModalEditAnimal } from '@/features/animals/modal';
import { useMyAnimalsQuery } from '@/features/animals/services';
import { ArrowLeft } from 'lucide-react';
import AnimalPicker from './animal-picker';
import PublicationForm from './publication-form';
import StepType from './step-type';

export type WizardStep = 1 | 2 | 3;

export default function Wizard() {
   const [step, setStep] = useState<WizardStep>(1);
   const [type, setType] = useState<'lost' | 'found' | undefined>(undefined);
   const [animalId, setAnimalId] = useState<number | undefined>(undefined);

   const { data: animals, isLoading } = useMyAnimalsQuery();
   const disclosureCreateAnimal = useDisclosure();

   const handleTypeChosen = (t: 'lost' | 'found') => {
      setType(t);
      if (t === 'found') {
         setAnimalId(undefined);
         setStep(3);
      } else {
         setStep(2);
      }
   };

   const handleAnimalSelected = (id: number) => {
      setAnimalId(id);
      setStep(3);
   };

   const showBack = step > 1;

   const handleGoBack = () => {
      setStep((s) => {
         if (s === 3 && type === 'found') return 1;
         return s > 1 ? ((s - 1) as WizardStep) : s;
      });
   };

   return (
      <div className="mx-auto max-w-2xl">
         <Card className="relative shadow-lg">
            <CardHeader className="flex items-center gap-3 px-8 pt-8 pb-4">
               <div className="relative flex items-start">
                  {showBack ? (
                     <Button
                        isIconOnly
                        variant="light"
                        onPress={handleGoBack}
                        className="-left-7 absolute bottom-2 z-10"
                     >
                        <ArrowLeft className="h-5 w-5" />
                     </Button>
                  ) : null}
                  <div className={'ml-4'}>
                     <h1 className="font-bold text-2xl">Nova Publicação</h1>
                     <p className="text-default-500 text-sm">
                        {step === 1 && 'Deseja publicar:'}
                        {step === 2 && 'Selecione um animal cadastrado ou cadastre um novo'}
                        {step === 3 && 'Detalhes da publicação'}
                     </p>
                  </div>
               </div>
            </CardHeader>
            <CardBody className="px-8 pb-8">
               {step === 1 && <StepType value={type} onChange={handleTypeChosen} />}

               {step === 2 && (
                  <div className="flex flex-col gap-6">
                     <>
                        {isLoading ? (
                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <Skeleton className="h-24 rounded-sm" />
                              <Skeleton className="h-24 rounded-sm" />
                           </div>
                        ) : (
                           <>
                              <AnimalPicker
                                 animals={animals?.docs || null}
                                 loading={isLoading}
                                 selectedId={animalId}
                                 onSelect={handleAnimalSelected}
                              />
                              <div className="flex justify-between">
                                 <Button variant="bordered" onPress={() => setStep(1)}>
                                    Voltar
                                 </Button>
                                 <div className="flex gap-3">
                                    <Button
                                       onPress={() => disclosureCreateAnimal.onOpen()}
                                       color={'success'}
                                    >
                                       Cadastrar novo animal
                                    </Button>
                                 </div>
                                 <ModalEditAnimal
                                    {...disclosureCreateAnimal}
                                    isEditing={false}
                                    defaultValue={null}
                                 />
                              </div>
                           </>
                        )}
                     </>
                  </div>
               )}

               {step === 3 && type && (type === 'found' || !!animalId) && (
                  <div className="flex flex-col gap-6">
                     {/* Selected animal info */}
                     {animalId &&
                        animals &&
                        (() => {
                           const a = animals.docs.find((x) => x.id === animalId);
                           if (!a) return null;
                           return (
                              <div className="relative overflow-hidden rounded-large border bg-content1 p-4">
                                 <Chip
                                    color={type === 'lost' ? 'danger' : 'secondary'}
                                    className={
                                       'absolute top-0 right-0 rounded-t-none rounded-br-none rounded-bl-2xl'
                                    }
                                 >
                                    {type === 'lost' && 'Perdido'}
                                    {type === 'found' && 'Encontrado'}
                                 </Chip>
                                 <div className="text-default-600 text-sm">
                                    <div className="font-medium text-foreground">{a.name}</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                       <span>{LABEL_BY_VALUE.species[a.species]}</span>
                                       {a.size ? (
                                          <span>• {LABEL_BY_VALUE.size[a.size]}</span>
                                       ) : null}
                                       {a.color ? <span>• {a.color}</span> : null}
                                       {a.gender ? (
                                          <span>• {LABEL_BY_VALUE.gender[a.gender]}</span>
                                       ) : null}
                                       {a.has_collar ? <span>• Tem coleira</span> : null}
                                    </div>
                                 </div>
                              </div>
                           );
                        })()}

                     <PublicationForm defaultType={type} animalId={animalId} />
                  </div>
               )}
            </CardBody>
         </Card>
      </div>
   );
}
