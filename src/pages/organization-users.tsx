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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Trash2Icon, PlusIcon } from "lucide-react"
import {toast} from "sonner";
import {cn} from "@/lib/utils.ts";

interface User {
    id: string
    username: string
    email: string
}

interface OrgUser {
    user_id: string
    role: string
    added_at: string
    username: string
    email: string
    added_by: {
        user_id: string
        username: string
        email: string
    } | null
    user: User
}

const ROLES = ["OWNER", "ADMIN", "EDITOR", "COMMENTER", "VIEWER"]

export function OrganizationUsersPage() {
    const { organizationId } = useParams<{ organizationId: string }>()
    const [users, setUsers] = useState<OrgUser[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)

    const [addOpen, setAddOpen] = useState(false)
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>("")
    const [newUserRole, setNewUserRole] = useState("VIEWER")

    // Assume we know current logged-in user's role (could be fetched from API / context)
    const [myRole, setMyRole] = useState<"OWNER" | "ADMIN" | "EDITOR" | "COMMENTER" | "VIEWER">(
        "VIEWER"
    )

    // fetch organization users
    const fetchUsers = async () => {
        if (!organizationId) return
        setLoading(true)
        try {
            const limit = 10;
            const res = await api.get(`/organization/users/${organizationId}`, {
                params: { keyword: search || undefined, limit },
            })
            setUsers(res.data)
        } catch {
            toast.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    // search users with cursor pagination
    const searchUsers = async (keyword: string, cursorValue: string | null = null) => {
        try {
            const res = await api.get(`/user/search`, {
                params: { keyword, cursor: cursorValue ?? undefined, limit: 10 },
            })
            setSearchResults(res.data)
            setCursor(res.data[res.data.length - 1])
            setHasMore(!!res.data.next_cursor)
        } catch {
            toast.error("Failed to search users")
        }
    }

    useEffect(() => {
        fetchUsers()
        // also fetch my role if backend provides endpoint
        api
            .get(`/organization/${organizationId}/my-role`)
            .then((res) => setMyRole(res.data.role))
            .catch(() => {})
    }, [organizationId])

    useEffect(() => {
        if (search.trim()) {
            searchUsers(search)
        } else {
            setSearchResults([])
        }
    }, [search])

    const handleAddUser = async () => {
        if (!organizationId || !selectedUserId) return
        try {
            await api.post(`/organization/user`, {
                user_id: selectedUserId,
                organization_id: organizationId,
                role: newUserRole,
            })
            setAddOpen(false)
            setSelectedUserId("")
            setNewUserRole("VIEWER")
            fetchUsers()
        } catch {
            toast.error("Failed to add user")
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!organizationId) return
        try {
            await api.delete(`/organization/user`, {
            data: {
                user_id: id,
                organization_id: organizationId,
            }})
            fetchUsers()
        } catch {
            toast.error("Failed to delete user")
        }
    }

    const handleRoleChange = async (userId: string, role: string) => {
        if (!organizationId) return
        console.log(userId)
        try {
            await api.put(`/organization/user`, {
                user_id: userId,
                organization_id: organizationId,
                role: role,
            })
            setUsers((prev) =>
                prev.map((u) => (u.user_id === userId ? { ...u, role } : u))
            )
        } catch {
            toast.error("Failed to update role")
        }
    }

    const canManageRoles = myRole === "ADMIN" || myRole === "OWNER"

    return (
        <div className="rounded border shadow-sm">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b gap-2">
                <h2 className="font-semibold text-lg">Organization Users</h2>

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


                        {/* User select dropdown */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                >
                                    {selectedUserId
                                        ? searchResults.find((u) => u.id === selectedUserId)?.email
                                        : "Select user..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search users..."
                                        value={search}
                                        onValueChange={(val) => setSearch(val)}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No user found.</CommandEmpty>
                                        <CommandGroup>
                                            {searchResults.map((u) => (
                                                <CommandItem
                                                    key={u.id}
                                                    value={u.email}
                                                    onSelect={() => setSelectedUserId(u.id)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedUserId === u.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {u.username} ({u.email})
                                                </CommandItem>
                                            ))}
                                            {hasMore && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-full"
                                                    onClick={() => searchUsers(search, cursor)}
                                                >
                                                    Load more
                                                </Button>
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Role select */}
                        <Select value={newUserRole} onValueChange={setNewUserRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddUser} disabled={!selectedUserId}>
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
                            <TableRow key={u.user_id}>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={u.role}
                                        onValueChange={(val) => handleRoleChange(u.user_id, val)}
                                        disabled={canManageRoles}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLES.map((r) => (
                                                <SelectItem key={r} value={r}>
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
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
                                        onClick={() => handleDeleteUser(u.user_id)}
                                        disabled={canManageRoles}
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
