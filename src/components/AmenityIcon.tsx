import {
  Bath, Car, ChefHat, Coffee, Dog, Flame, Flower2, Laptop, Leaf, type LucideIcon, Snowflake, Sparkles, Thermometer,
  Trees, Tv, UserRound, Utensils, Waves, Wifi, Zap, Check, Dumbbell, ArrowUpDown, ShieldCheck, Building2, WashingMachine, KeyRound,
  Speaker, Projector, Lightbulb, Disc3, Sun, Music,
} from 'lucide-react'

const map: [RegExp, LucideIcon][] = [
  [/speaker|sound/i, Speaker],
  [/projector/i, Projector],
  [/lights|lighting/i, Lightbulb],
  [/\bdj\b/i, Disc3],
  [/terrace|rooftop/i, Sun],
  [/music/i, Music],
  [/wi-?fi|internet/i, Wifi],
  [/gym|fitness/i, Dumbbell],
  [/lift|elevator/i, ArrowUpDown],
  [/security|guard/i, ShieldCheck],
  [/balcony|terrace/i, Building2],
  [/washing|laundry/i, WashingMachine],
  [/self check-?in|smart lock/i, KeyRound],
  [/pool/i, Waves],
  [/air ?con|a\/c|\bac\b/i, Snowflake],
  [/kitchen/i, Utensils],
  [/chef/i, ChefHat],
  [/parking|car/i, Car],
  [/fire|bonfire|stove/i, Flame],
  [/heat/i, Thermometer],
  [/hot water|bath|shower/i, Bath],
  [/view/i, Building2],
  [/garden/i, Flower2],
  [/pet|dog/i, Dog],
  [/work|desk/i, Laptop],
  [/tv|television/i, Tv],
  [/breakfast|coffee/i, Coffee],
  [/caretaker|housekeep|staff/i, UserRound],
  [/power|backup|generator/i, Zap],
  [/plantation|walk|estate/i, Trees],
  [/spa|clean/i, Sparkles],
  [/eco|organic/i, Leaf],
]

export function amenityIcon(name: string): LucideIcon {
  return map.find(([re]) => re.test(name))?.[1] ?? Check
}

export function AmenityIcon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const I = amenityIcon(name)
  return <I className={className} aria-hidden="true" />
}
