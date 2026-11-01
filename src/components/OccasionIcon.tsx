import { BedDouble, Briefcase, Cake, Clapperboard, type LucideIcon, PartyPopper, Sparkles, UsersRound, Wine } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  'House party': PartyPopper,
  Birthday: Cake,
  'Office party': Briefcase,
  'Get-together': UsersRound,
  'Movie night': Clapperboard,
  'Date night': Wine,
  Staycation: BedDouble,
}

export const occasionIcon = (o: string): LucideIcon => icons[o] ?? Sparkles

export function OccasionIcon({ name, className = 'h-4 w-4' }: { name: string; className?: string }) {
  const I = occasionIcon(name)
  return <I className={className} aria-hidden="true" />
}
