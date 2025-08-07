"use server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UserPage from "./_components/user-page";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <>
    <header>
      <NavigationMenu className="md:flex">
        <NavigationMenuList className="flex space-x-1">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/signout"
                className="px-3 py-2 text-gray-700 hover:text-green-600 focus:text-green-600 transition-colors font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign Out
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {isAdmin && <></>}
        {!isAdmin && (
          <UserPage
            email={user?.email || ""}
            name={user?.name || ""}
            userId={user?.id || ""}
          />
        )}
      </div>
    </>
  );
}
