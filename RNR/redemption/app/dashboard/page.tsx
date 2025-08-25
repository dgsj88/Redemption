"use server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserDashboard } from "./_components/user-dashboard";
import { AdminDashboard } from "./_components/admin-dashboard";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { User } from "@/types/user"; // Adjust the import path as needed

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
        {isAdmin && <AdminDashboard/>}
        {!isAdmin && (
          <UserDashboard
            user={user as User}
            name={user?.name || ""}
            userId={user?.id || ""}
              
          />
        )}
    </>
  );
}                                                                                                                                                                                                                                                         
