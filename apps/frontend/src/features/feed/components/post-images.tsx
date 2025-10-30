interface PostImagesProps {
   images: string[];
   petName: string;
}

export function PostImages({ images, petName }: PostImagesProps) {
   const gridCols =
      images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

   return (
      <div className={`grid gap-2 ${gridCols}`}>
         {images.map((image, idx) => (
            <img
               key={idx}
               src={image || '/placeholder.svg'}
               alt={`${petName} - foto ${idx + 1}`}
               className="h-64 w-full rounded-lg object-cover"
            />
         ))}
      </div>
   );
}
