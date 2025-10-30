'use client';

import { Avatar, Button, Divider, Textarea } from '@heroui/react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface Comment {
   id: number;
   author: string;
   authorAvatar: string;
   content: string;
   date: string;
}

interface CommentsSectionProps {
   postId: number;
   initialComments?: Comment[];
}

export function CommentsSection({ postId, initialComments = [] }: CommentsSectionProps) {
   const [comments, setComments] = useState<Comment[]>(initialComments);
   const [newComment, setNewComment] = useState('');

   const handleSubmit = () => {
      if (!newComment.trim()) return;

      const comment: Comment = {
         id: Date.now(),
         author: 'Você',
         authorAvatar: '/placeholder-user.jpg',
         content: newComment,
         date: new Date().toISOString(),
      };

      setComments([comment, ...comments]);
      setNewComment('');
   };

   return (
      <div className="flex flex-col gap-4 px-6 pb-6">
         {/* Comment Input */}
         <div className="flex gap-3">
            <Avatar src="/placeholder-user.jpg" size="sm" />
            <div className="flex flex-1 gap-2">
               <Textarea
                  placeholder="Escreva um comentário..."
                  value={newComment}
                  onValueChange={setNewComment}
                  minRows={1}
                  maxRows={4}
                  classNames={{
                     input: 'text-sm',
                  }}
               />
               <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  onPress={handleSubmit}
                  isDisabled={!newComment.trim()}
               >
                  <Send className="h-4 w-4" />
               </Button>
            </div>
         </div>

         {/* Comments List */}
         {comments.length > 0 && (
            <div className="flex flex-col gap-4">
               <Divider />
               {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                     <Avatar src={comment.authorAvatar} size="sm" />
                     <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                           <span className="font-semibold text-sm">{comment.author}</span>
                           <span className="text-default-400 text-xs">
                              {formatDistanceToNow(new Date(comment.date), {
                                 addSuffix: true,
                                 locale: ptBR,
                              })}
                           </span>
                        </div>
                        <p className="text-default-700 text-sm">{comment.content}</p>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
