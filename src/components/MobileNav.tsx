// components/MobileNav.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function MobileNav() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col gap-4 mt-8">
          <Link href="/" className="text-lg font-semibold">
            Home
          </Link>
          <Link href="/search" className="text-lg">
            Search
          </Link>
          <Link href="/following" className="text-lg">
            Following
          </Link>
          <Link href="/profile" className="text-lg">
            Profile
          </Link>
          <Link href="/create-post" className="text-lg">
            Create Post
          </Link>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
