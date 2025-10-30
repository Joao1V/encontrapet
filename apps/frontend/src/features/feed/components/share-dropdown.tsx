'use client';

import * as React from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';

import { Share2 } from 'lucide-react';
import { SiFacebook, SiInstagram, SiWhatsapp } from 'react-icons/si';

export interface ShareDropdownProps {
   title: string; // e.g., "Pet Perdido: Rex"
   description?: string; // short description
   url?: string; // custom url; defaults to window.location.href
   className?: string;
   buttonAriaLabel?: string;
   onShared?: (network: 'whatsapp' | 'facebook' | 'instagram') => void;
}

function getCurrentUrl() {
   if (typeof window === 'undefined') return '';
   return window.location.href;
}

function openInNewTab(url: string) {
   if (!url) return;
   window.open(url, '_blank');
}

export function ShareDropdown({
   title,
   description,
   url,
   className,
   buttonAriaLabel = 'Compartilhar',
   onShared,
}: ShareDropdownProps) {
   const currentUrl = React.useMemo(() => encodeURI(url || getCurrentUrl()), [url]);
   const shareText = React.useMemo(() => {
      const base = `${title}${description ? ` - ${description.slice(0, 100)}...` : ''}`;
      return base;
   }, [title, description]);

   const handleWhatsApp = () => {
      const text = encodeURIComponent(`${shareText}\n${url || getCurrentUrl()}`);
      openInNewTab(`https://wa.me/?text=${text}`);
      onShared?.('whatsapp');
   };

   const handleFacebook = () => {
      const u = encodeURIComponent(url || getCurrentUrl());
      openInNewTab(`https://www.facebook.com/sharer/sharer.php?u=${u}`);
      onShared?.('facebook');
   };

   const handleInstagram = async () => {
      const data: ShareData = { title, text: description, url: url || getCurrentUrl() };
      if (navigator.share) {
         try {
            await navigator.share(data);
            onShared?.('instagram');
            return;
         } catch (_) {
            // fallback below
         }
      }
      // Fallback: open URL (Instagram não possui endpoint público de share via web)
      openInNewTab(data.url || getCurrentUrl());
      onShared?.('instagram');
   };

   return (
      <Dropdown>
         <DropdownTrigger>
            <Button
               variant="bordered"
               isIconOnly
               aria-label={buttonAriaLabel}
               className={className ?? 'bg-transparent'}
            >
               <Share2 className="h-4 w-4" />
            </Button>
         </DropdownTrigger>
         <DropdownMenu
            aria-label="Compartilhar"
            onAction={(key) => {
               if (key === 'whatsapp') return handleWhatsApp();
               if (key === 'facebook') return handleFacebook();
               if (key === 'instagram') return handleInstagram();
            }}
         >
            <DropdownItem
               key="whatsapp"
               startContent={<SiWhatsapp className="h-4 w-4 text-[#25D366]" />}
            >
               WhatsApp
            </DropdownItem>
            <DropdownItem
               key="facebook"
               startContent={<SiFacebook className="h-4 w-4 text-[#1877F2]" />}
            >
               Facebook
            </DropdownItem>
            <DropdownItem
               key="instagram"
               startContent={<SiInstagram className="h-4 w-4 text-[#E1306C]" />}
            >
               Instagram
            </DropdownItem>
         </DropdownMenu>
      </Dropdown>
   );
}
