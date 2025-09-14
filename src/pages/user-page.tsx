"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {useAppStore} from "@/store/useAppStore.ts";

export default function UserPage() {
    const user = useAppStore((s) => s.user)

    if (!user) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading user...
            </div>
        )
    }

    return (
        <div className="flex h-[100%] w-full p-6">
            <div className="flex w-full h-full items-center justify-center">
                <div className="flex w-[70%] items-center justify-center  p-6 rounded-l-xl">
                    <Avatar className="h-100 w-100 ">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="text-6xl rounded-xl">
                            {user.name?.at(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Right side (30%) */}
                <div className="flex w-[30%] flex-col gap-4 p-6">
                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                    <Separator />
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.username}</p>
                    </div>



                </div>
            </div>
        </div>
    )
}
