import { Avatar } from '@heroui/react';

import { formatRelative } from '@/helpers/date';
import { Clock } from 'lucide-react';

interface PostHeaderProps {
   author: string;
   authorAvatar: string;
   date: string;
}

export function PostHeader({ author, authorAvatar, date }: PostHeaderProps) {
   return (
      <div className="flex gap-3 px-6 pt-6">
         <Avatar src={authorAvatar} size="md" />
         <div className="flex flex-1 flex-col">
            <p className="font-semibold text-base">{author}</p>
            <p className="flex items-center gap-1.5 text-default-500 text-sm">
               <Clock className="h-3.5 w-3.5" />
               {formatRelative(date)}
            </p>
         </div>
      </div>
   );
}
