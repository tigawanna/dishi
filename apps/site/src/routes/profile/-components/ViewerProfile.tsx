import { Skeleton } from "@/components/ui/skeleton";
import { useViewer } from "@/data-access-layer/users/viewer";

export function ViewerProfile() {
    const { viewer } = useViewer();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center mx-auto gap-3 p-5">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
            {viewer.user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h1 className="text-base-content text-4xl font-bold">{viewer.user?.name}</h1>
          <p className="text-base-content/70" data-test="profile-email">
            {viewer.user?.email}
          </p>
          <p className="text-base-content/70" data-test="profile-role">
            {viewer.user?.role}
          </p>
        </div>
    );
}

export function ViewerProfileFallback() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mx-auto gap-3 p-5">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-10 w-[220px] rounded-md" />
        <Skeleton className="h-5 w-[180px] rounded-md" />
        <Skeleton className="h-5 w-[100px] rounded-md" />
      </div>
    );
}
