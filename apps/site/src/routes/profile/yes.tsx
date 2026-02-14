import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/yes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/yes"!</div>
}
