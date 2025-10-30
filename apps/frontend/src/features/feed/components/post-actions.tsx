import { Button } from '@heroui/react';

import { MessageCircle, Share2 } from 'lucide-react';

interface PostActionsProps {
   comments: number;
   onShare: () => void;
   onCommentClick: () => void;
}

export function PostActions({ comments, onShare, onCommentClick }: PostActionsProps) {
   return (
      <div className="flex items-center justify-between px-6 py-4">
         <Button
            variant="light"
            startContent={<MessageCircle className="h-5 w-5" />}
            className="font-medium text-default-700"
            onPress={onCommentClick}
         >
            {comments} {comments === 1 ? 'comentário' : 'comentários'}
         </Button>
         <Button
            variant="light"
            startContent={<Share2 className="h-5 w-5" />}
            className="text-default-600"
            onPress={onShare}
         >
            Compartilhar
         </Button>
      </div>
   );
}
