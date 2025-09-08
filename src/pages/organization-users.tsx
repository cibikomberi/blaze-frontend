"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "@/lib/axios.ts"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Trash2Icon, PlusIcon } from "lucide-react"

interface User {
    id: string
    username: string
    email: string
    role: string
    added_at: string
    added_by: {
        id: string
        username: string
        email: string
    }
}

export function OrganizationUsersPage() {
    const { organizationId } = useParams<{ organizationId: string }>()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [newUserEmail, setNewUserEmail] = useState("")
    const [newUserRole, setNewUserRole] = useState("member")

    const fetchUsers = async () => {
        if (!organizationId) return
        setLoading(true)
        try {
            const limit = 10;
            const res = await api.get(`/organization/users/${organizationId}`, {
                params: { keyword: search || undefined, limit },
            })
            setUsers(res.data)
        } catch (err) {
            console.error("Failed to fetch users:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [organizationId, search])

    const handleAddUser = async () => {
        if (!organizationId) return
        try {
            await api.post(`/organization/${organizationId}/users`, {
                email: newUserEmail,
                role: newUserRole,
            })
            setNewUserEmail("")
            setNewUserRole("member")
            setAddOpen(false)
            fetchUsers()
        } catch (err) {
            console.error("Failed to add user:", err)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!organizationId) return
        try {
            await api.delete(`/organization/${organizationId}/users/${id}`)
            fetchUsers()
        } catch (err) {
            console.error("Failed to delete user:", err)
        }
    }

    return (
        <div className="rounded border shadow-sm">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b gap-2">
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>

                        <Input
                            placeholder="User email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                        <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value)}
                            className="border rounded px-2 py-1 mt-2"
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddUser} disabled={!newUserEmail.trim()}>
                                Add
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[20%]">Username</TableHead>
                        <TableHead className="w-[25%]">Email</TableHead>
                        <TableHead className="w-[15%]">Role</TableHead>
                        <TableHead className="w-[20%]">Added At</TableHead>
                        <TableHead className="w-[20%]">Added By</TableHead>
                        <TableHead className="w-[10%]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell className="capitalize">{u.role}</TableCell>
                                <TableCell>
                                    {new Date(u.added_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {u.added_by
                                        ? `${u.added_by.username} (${u.added_by.email})`
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteUser(u.id)}
                                    >
                                        <Trash2Icon className="h-4 w-4 text-red-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
