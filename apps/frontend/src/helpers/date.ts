import { differenceInDays, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function toDate(input: string | Date): Date {
   if (input instanceof Date) return input;
   const iso = parseISO(input);
   if (isValid(iso)) return iso;
   const d = new Date(input);
   return isValid(d) ? d : new Date(NaN);
}

export function formatRelative(date: string | Date, options?: { addSuffix?: boolean }): string {
   const d = toDate(date);
   if (!isValid(d)) return '';
   return formatDistanceToNow(d, { addSuffix: options?.addSuffix ?? true, locale: ptBR });
}

export function daysSince(date: string | Date, now: Date = new Date()): number {
   const d = toDate(date);
   if (!isValid(d)) return 0;
   return Math.max(0, differenceInDays(now, d));
}

export function formatFullPtBR(date: string | Date): string {
   const d = toDate(date);
   if (!isValid(d)) return '';
   return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function disappearanceWithDays(date: string | Date): string {
   const dias = daysSince(date);
   const data = formatFullPtBR(date);
   if (!data) return '';
   return `há ${dias} dias - ${data}`;
}
