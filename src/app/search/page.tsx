"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const search = (e) => {
    e.preventDefault();
    console.log(searchQuery);

    if (searchQuery.startsWith("@")) {
      const username = searchQuery.substring(1);
      router.push(`/users/@${username}`);
    } else {
      console.log("Performing search for:", searchQuery);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground">Find posts, users, and more</p>
        <div className="w-full max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <form onSubmit={search}>
              <Input
                placeholder="Search for anything..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full max-w-lg mx-auto">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex-1">
            Posts
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1">
            Users
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex-1">
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type to search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Trending searches">
                <CommandItem>@user2</CommandItem>
                <CommandItem>#chess</CommandItem>
                <CommandItem>@1</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
