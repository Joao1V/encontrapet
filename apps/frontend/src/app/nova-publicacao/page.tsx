'use client';

import { Button } from '@heroui/react';

import Wizard from '@/features/publish/components/Wizard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPublicationPage() {
   return (
      <div className="min-h-screen bg-default-50 py-8">
         <div className="container mx-auto max-w-2xl px-4">
            <Button
               as={Link}
               href="/feed"
               variant="light"
               startContent={<ArrowLeft className={'h-4 w-4'} />}
               className="mb-6"
            >
               Voltar ao Feed
            </Button>
            <Wizard />
         </div>
      </div>
   );
}
