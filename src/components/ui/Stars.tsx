import { Star } from 'lucide-react'

export function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(rating) ? 'fill-accent text-accent' : 'text-sand'}`} />
      ))}
    </div>
  )
}
