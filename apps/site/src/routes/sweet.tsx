import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sweet')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sweet"!</div>
}
