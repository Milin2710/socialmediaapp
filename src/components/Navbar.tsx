"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { MobileNav } from "./MobileNav";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3002/auth/logout', {}, {
        withCredentials: true
      });
      
      localStorage.removeItem('user');
      sessionStorage.clear();

      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="font-bold text-xl ml-2">
              TwitterClone
            </Link>
          </div>

          {/* Center Navigation - visible on medium and larger screens */}
          <div className="block max-md:hidden">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/search" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Search
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/following" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Following
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[200px] p-2">
                      <Link href="/profile" className="block p-2 hover:bg-accent rounded-md">
                        View Profile
                      </Link>
                      <Link href="/settings" className="block p-2 hover:bg-accent rounded-md">
                        Settings
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side buttons - always visible on medium and larger screens */}
          <div className="flex max-md:hidden items-center space-x-4">
            <Button 
              variant="outline" 
              className="cursor-pointer" 
              onClick={() => router.push("/create-post")}
            >
              Create Post
            </Button>
            <Button 
              variant="default"
              className="bg-gray-700 hover:bg-gray-600 cursor-pointer" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
