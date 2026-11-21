import { Compass } from 'lucide-react'
import { ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <div className="container-page pt-36">
      <EmptyState icon={<Compass className="h-6 w-6" />} title="This path leads nowhere" body="The page you’re looking for doesn’t exist. Let’s get you back somewhere beautiful." action={<ButtonLink to="/">Back to home</ButtonLink>} />
    </div>
  )
}
