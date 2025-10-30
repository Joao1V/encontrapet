'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Skeleton } from '@heroui/react';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { publishApi } from '../services/api';
import { useAnimals } from '../services/queries';
import AnimalForm from './animal-form';
import AnimalPicker from './animal-picker';
import PublicationForm from './publication-form';
import StepType from './step-type';

export type WizardStep = 1 | 2 | 3;

export default function Wizard() {
   const router = useRouter();
   const [step, setStep] = useState<WizardStep>(1);
   const [type, setType] = useState<'lost' | 'found' | undefined>(undefined);
   const [animalId, setAnimalId] = useState<string | undefined>(undefined);
   const [creatingPublication, setCreatingPublication] = useState(false);
   const [mode, setMode] = useState<'pick' | 'create'>('pick');

   const { data: animals, isLoading } = useAnimals({ enabled: step === 2 });

   useEffect(() => {
      if (step === 2 && !isLoading) {
         const count = animals?.length ?? 0;
         if (count === 0 && mode !== 'create') {
            setMode('create');
         }
      }
   }, [step, isLoading, animals, mode]);

   const canContinueToPublication = !!animalId;

   const handleTypeChosen = (t: 'lost' | 'found') => {
      setType(t);
      if (t === 'found') {
         setAnimalId(undefined);
         setStep(3);
      } else {
         setStep(2);
      }
   };

   const handleAnimalSelected = (id: string) => {
      setAnimalId(id);
      setStep(3);
   };

   const handleAnimalCreated = (animal: { id: string; name: string }) => {
      setAnimalId(animal.id);
      setMode('pick');
      setStep(3);
   };

   const showBack = step > 1;

   const handleGoBack = () => {
      setStep((s) => {
         if (s === 3 && type === 'found') return 1 as WizardStep;
         return s > 1 ? ((s - 1) as WizardStep) : s;
      });
   };

   return (
      <div className="mx-auto max-w-2xl">
         <Card className="relative shadow-lg">
            <CardHeader className="flex items-center gap-3 px-8 pt-8 pb-4">
               {showBack ? (
                  <Button
                     isIconOnly
                     variant="light"
                     onPress={handleGoBack}
                     className="absolute top-2 left-4 z-10"
                  >
                     <ArrowLeft className="h-5 w-5" />
                  </Button>
               ) : null}
               <div className="flex flex-col items-start">
                  <h1 className="font-bold text-2xl">Nova Publicação</h1>
                  <p className="text-default-500 text-sm">
                     {step === 1 && 'Deseja publicar um animal:'}
                     {step === 2 && 'Selecione um animal cadastrado ou cadastre um novo'}
                     {step === 3 && 'Detalhes da publicação'}
                  </p>
               </div>
            </CardHeader>
            <CardBody className="px-8 pb-8">
               {step === 1 && <StepType value={type} onChange={handleTypeChosen} />}

               {step === 2 && (
                  <div className="flex flex-col gap-6">
                     {mode === 'pick' ? (
                        <>
                           {isLoading ? (
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                 <Skeleton className="h-24 rounded-sm" />
                                 <Skeleton className="h-24 rounded-sm" />
                              </div>
                           ) : (
                              <>
                                 <AnimalPicker
                                    animals={animals}
                                    loading={isLoading}
                                    selectedId={animalId}
                                    onSelect={handleAnimalSelected}
                                 />
                                 <div className="flex justify-between">
                                    <Button variant="bordered" onPress={() => setStep(1)}>
                                       Voltar
                                    </Button>
                                    <div className="flex gap-3">
                                       <Button onPress={() => setMode('create')}>
                                          Cadastrar novo animal
                                       </Button>
                                       <Button
                                          color="primary"
                                          isDisabled={!canContinueToPublication}
                                          onPress={() => animalId && setStep(3)}
                                       >
                                          Continuar
                                       </Button>
                                    </div>
                                 </div>
                              </>
                           )}
                        </>
                     ) : (
                        <AnimalForm
                           onCreated={handleAnimalCreated}
                           onCancel={() => setMode('pick')}
                        />
                     )}
                  </div>
               )}

               {step === 3 && type && (type === 'found' || !!animalId) && (
                  <div className="flex flex-col gap-6">
                     <PublicationForm
                        defaultType={type}
                        animalId={animalId}
                        isSubmitting={creatingPublication}
                     />
                     <div className="flex justify-between">
                        <Button
                           variant="bordered"
                           onPress={() => setStep(type === 'found' ? 1 : 2)}
                        >
                           Voltar
                        </Button>
                     </div>
                  </div>
               )}
            </CardBody>
         </Card>
      </div>
   );
}
