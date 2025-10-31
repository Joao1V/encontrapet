'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
};

export default function PhotoDropzone({ files, onChange, maxFiles = 3 }: PhotoDropzoneProps) {
   const [previews, setPreviews] = useState<string[]>([]);

   // Build previews from current files
   useEffect(() => {
      const urls = (files ?? []).map((f) => `data:${f.mimetype};base64,${f.data}`);
      setPreviews(urls);
   }, [files]);

   const canAddMore = (files?.length ?? 0) < maxFiles;

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

   return (
      <div>
         <div className="mb-4 grid grid-cols-3 gap-4">
            {previews.map((src, idx) => (
               <div key={idx} className="relative aspect-square">
                  <Image
                     src={src || '/placeholder.svg'}
                     alt={`Foto ${idx + 1}`}
                     fill
                     className="rounded-lg object-cover"
                  />
                  <button
                     type="button"
                     onClick={() => removeAt(idx)}
                     className="absolute top-1 right-1 rounded-full bg-danger p-1 text-white"
                  >
                     <X className="h-4 w-4" />
                  </button>
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
