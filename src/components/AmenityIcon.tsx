import {
  Bath, Car, ChefHat, Coffee, Dog, Flame, Flower2, Laptop, Leaf, type LucideIcon, Mountain, Snowflake, Sparkles, Thermometer,
  Trees, Tv, UserRound, Utensils, Waves, Wifi, Zap, Check,
} from 'lucide-react'

const map: [RegExp, LucideIcon][] = [
  [/wi-?fi|internet/i, Wifi],
  [/pool/i, Waves],
  [/air ?con|a\/c|\bac\b/i, Snowflake],
  [/kitchen/i, Utensils],
  [/chef/i, ChefHat],
  [/parking|car/i, Car],
  [/fire|bonfire|stove/i, Flame],
  [/heat/i, Thermometer],
  [/hot water|bath|shower/i, Bath],
  [/mountain|valley|view/i, Mountain],
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
