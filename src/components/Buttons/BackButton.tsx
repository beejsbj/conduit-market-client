import { Link } from 'wouter'

export default function BackButton({
  text,
  destination = '/'
}: {
  text: string
  destination?: string
}) {
  return (
    <Link
      to={destination}
      className="flex items-center text-primary mb-4 hover:underline"
    >
      <span className="mr-2">←</span> {text}
    </Link>
  )
}
