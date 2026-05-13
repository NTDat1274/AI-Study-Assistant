"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

export function UserNav({ user, profile }: { user: any; profile: any }) {
  const initials =
    profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring hover:opacity-80 transition-opacity">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={profile?.avatar_url || ""}
            alt={profile?.full_name || user?.email}
          />
          <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.full_name || "Người dùng"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profile?.role === 'admin' && (
            <Link href="/admin" className="w-full cursor-pointer">
              <DropdownMenuItem className="font-semibold text-primary">Quản trị Hệ thống</DropdownMenuItem>
            </Link>
          )}
          <Link href="/dashboard" className="w-full cursor-pointer">
            <DropdownMenuItem>Bảng điều khiển</DropdownMenuItem>
          </Link>
          <Link href="/dashboard/profile" className="w-full cursor-pointer">
            <DropdownMenuItem>Cài đặt tài khoản</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout} className="w-full">
          <button type="submit" className="w-full text-left cursor-pointer">
            <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
