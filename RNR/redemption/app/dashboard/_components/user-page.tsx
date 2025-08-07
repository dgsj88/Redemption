import { Suspense } from "react";
import UserCard from "./user-info-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage({
  name,
  userId,
  email,
}: {
  name: string;
  userId: string;
  email: string;
}) {
  return (
    <Suspense
      fallback={<Skeleton className="h-[20px] w-[100px] rounded-full" />}
    >
      <UserCard name={name} userId={userId} email={email} />
    </Suspense>
    
  );
}
