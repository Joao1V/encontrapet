'use client';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@heroui/react';

import { QUERY_KEYS } from '@/config/constants';
import { useDeletePhoto } from '@/features/photos/services';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

export type PhotoItem = {
   data: string; // base64 (no prefix)
   mimetype: string;
   name: string;
};

export type PhotoDropzoneProps = {
   files: PhotoItem[];
   onChange: (files: PhotoItem[]) => void;
   maxFiles?: number;
   defaultValue?: { id: number; url: string }[];
};

export default function PhotoDropzone({
   files,
   onChange,
   defaultValue,
   maxFiles = 3,
}: PhotoDropzoneProps) {
   const [previews, setPreviews] = useState<string[]>([]);
   const [defaultPreview, setDefaultPreview] = useState(defaultValue ?? []);

   const qc = useQueryClient();
   const canAddMore = (files?.length ?? 0) < maxFiles;

   const deletePhoto = useDeletePhoto({
      onSuccess: async () => {
         await qc.invalidateQueries({ queryKey: [QUERY_KEYS.MY_ANIMALS] });
      },
   });

   const onDrop = useCallback(
      async (accepted: File[]) => {
         const remain = Math.max(0, maxFiles - (files?.length ?? 0));
         if (remain <= 0) return;
         const next = accepted.slice(0, remain);
         const converted = await Promise.all(next.map((f) => fileToPhotoItem(f)));
         onChange([...(files ?? []), ...converted]);
      },
      [files, maxFiles, onChange],
   );

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: { 'image/*': [] },
      multiple: true,
      onDrop,
   });

   const removeAt = (idx: number) => {
      const updated = (files ?? []).filter((_, i) => i !== idx);
      onChange(updated);
   };

   const removeFromApi = async (id: number) => {
      try {
         await deletePhoto.mutateAsync(id);
         setDefaultPreview(defaultPreview.filter((df) => df.id !== id));
      } catch (e) {}
   };

   useEffect(() => {
      const urls = (files ?? []).map((f) => `data:${f.mimetype};base64,${f.data}`);
      setPreviews(urls);
   }, [files]);

   return (
      <div>
         <div className="mb-4 grid grid-cols-3 gap-4">
            {previews.map((src, idx) => (
               <div key={idx} className="relative aspect-square">
                  <PreviewImage src={src} alt={`Foto ${idx + 1}`} onPress={() => removeAt(idx)} />
               </div>
            ))}
            {defaultPreview?.map((df, idx) => (
               <div key={idx} className="relative aspect-square">
                  <PreviewImage
                     src={df.url}
                     alt={`Foto ${idx + 1}`}
                     onPress={() => removeFromApi(df.id)}
                     isLoading={deletePhoto.isPending && deletePhoto.variables === df.id}
                  />
               </div>
            ))}
         </div>

         {canAddMore ? (
            <div
               {...getRootProps()}
               className={
                  'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-large border border-dashed p-6 text-center transition-colors' +
                  (isDragActive ? 'border-primary bg-primary/10' : 'hover:bg-default-100')
               }
            >
               <input {...getInputProps()} />
               <Upload className="h-5 w-5 text-default-500" />
               <div className="text-default-500 text-sm">
                  Arraste e solte imagens aqui, ou clique para selecionar (até {maxFiles} fotos)
               </div>
            </div>
         ) : null}
      </div>
   );
}

function PreviewImage({
   src,
   onPress,
   alt,
   isLoading,
}: {
   src: string;
   onPress: () => void;
   alt: string;
   isLoading?: boolean;
}) {
   return (
      <>
         <Image
            src={src || '/placeholder.svg'}
            alt={alt ?? `Foto`}
            fill
            className="rounded-lg object-cover"
         />
         <Button
            type="button"
            isIconOnly
            size="sm"
            color={'danger'}
            radius={'full'}
            isLoading={isLoading}
            onPress={onPress}
            className="absolute top-1 right-1"
         >
            <X className="h-4 w-4" />
         </Button>
      </>
   );
}
async function fileToPhotoItem(file: File): Promise<PhotoItem> {
   const reader = new FileReader();
   const dataUrl = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
   });
   // dataUrl format: data:<mimetype>;base64,<data>
   const [header, base64Data] = dataUrl.split(',');
   const mimetype = header.substring(5, header.indexOf(';'));
   return {
      data: base64Data,
      mimetype,
      name: file.name,
   };
}
