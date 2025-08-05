import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function UserCard({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string;
  email: string;
}) {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credits: true,
    },
  });
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome {name || email}!</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <strong>Credits: {typeof userInfo?.credits === "number" ? userInfo?.credits : "-"}</strong>
      </CardContent>
    </Card>
  );
}
