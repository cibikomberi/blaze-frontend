"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useParams } from "react-router-dom"
import { api } from "@/lib/axios.ts"

type User = {
    id: string
    username: string
    email: string
    role: string
    avatarUrl?: string
    joinedAt: string
    lastLogin?: string
}

export default function UserProfilePage() {
    const { userId } = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api(`/user/${userId}`)
                setUser(res.data)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [userId])

    if (loading)
        return (
            <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
                Loading user profile...
            </div>
        )

    if (!user)
        return (
            <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
                User not found
            </div>
        )

    return (
        <div className="p-6">
            <Card className="shadow-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="text-xl font-semibold">
                                {user.username[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground capitalize">
                        {user.role}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 mt-4">
                    <div className="grid gap-2">
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="text-base">{user.email}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-muted-foreground">Role</Label>
                        <p className="text-base capitalize">{user.role}</p>
                    </div>

                    <Separator />

                    <div className="grid gap-2">
                        <Label className="text-muted-foreground">Joined At</Label>
                        <p className="text-base">
                            {new Date(user.joinedAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    {user.lastLogin && (
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">Last Login</Label>
                            <p className="text-base">
                                {new Date(user.lastLogin).toLocaleString()}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
