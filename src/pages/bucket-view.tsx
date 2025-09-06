"use client"

import { useEffect, useRef, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FileIcon, FolderIcon, PlusIcon, UploadIcon, Trash2Icon } from "lucide-react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { api } from "@/lib/axios.ts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {toast} from "sonner";

interface Item {
    id: string
    name: string
    kind: "file" | "folder"
    created_at?: string
    created_by?: string
    user_name?: string
    user_email?: string
    user_username?: string
}

interface FolderResponse {
    folder: {
        id: string
        name: string
        bucket_id: string
        parent_id: string | null
        created_by: string
        created_at: string
        updated_at?: string | null
    }
    items: Item[]
}

export function BucketTable() {
    const params = useParams<{ bucketId: string; organizationId: string; folderId?: string }>()
    const navigate = useNavigate()

    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [nextCursor, setNextCursor] = useState<{ id: string; kind: string } | null>(null)
    const [cursorStack, setCursorStack] = useState<({ id: string | null; kind: string | null })[]>([
        { id: null, kind: null },
    ])
    const [pageIndex, setPageIndex] = useState(0)
    const [search, setSearch] = useState("")
    const [newFolderOpen, setNewFolderOpen] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")
    const [currentFolder, setCurrentFolder] = useState<FolderResponse["folder"] | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchFolders = async (
        cursorValue?: { id: string | null; kind: string | null },
        reset = false
    ) => {
        if (!params.bucketId) return
        setLoading(true)
        try {
            const limit = 5
            const res = await api.get<FolderResponse>("/folder", {
                params: {
                    cursor: cursorValue?.id ?? undefined,
                    cursor_kind: cursorValue?.kind ?? undefined,
                    limit,
                    organization_id: params.organizationId,
                    bucket_id: params.bucketId,
                    folder_id: params.folderId, // ✅ send folder_id if present
                    keyword: search || undefined,
                },
            })

            setCurrentFolder(res.data.folder)

            if (res.data.items.length > 0) {
                setItems(res.data.items)

                if (res.data.items.length === limit) {
                    const last = res.data.items[limit - 1]
                    setNextCursor({ id: last.id, kind: last.kind })
                } else {
                    setNextCursor(null)
                }

                if (reset) {
                    setCursorStack([{ id: null, kind: null }])
                    setPageIndex(0)
                }
            } else {
                setItems([])
                setNextCursor(null)
            }
        } catch (err) {
            console.error("Failed to fetch folders:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFolders(null, true)
    }, [params.bucketId, params.organizationId, params.folderId, search])


    const handleCreateFolder = async () => {
        if (!params.bucketId || !currentFolder) return
        try {
            await api.post("/folder", {
                name: newFolderName,
                bucket_id: params.bucketId,
                parent_id: currentFolder.id,
            })
            setNewFolderName("")
            setNewFolderOpen(false)
            await fetchFolders(null, true)
        } catch (err) {
            toast("Failed to create folder")
        }
    }

    const handleDelete = async (item: Item) => {
        try {
            const endpoint = item.kind === "folder" ? `/folder/${item.id}` : `/file/${item.id}`
            await api.delete(endpoint)
            await fetchFolders(null, true) // refresh after delete
        } catch (err) {
            toast("Failed to delete")
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !currentFolder) return
        const file = e.target.files[0]
        try {
            await api.put(`/file/${currentFolder.id}`, file, {
                params: { file_name: file.name },
                headers: {
                    "Content-Type": file.type || "application/octet-stream",
                },
            })
            fetchFolders(null, true)
        } catch (err) {
            toast("Failed to upload file")
        }
    }

    const handleDownload = async (file: Item) => {
        try {
            const res = await api.get(`/file/${file.id}`, {
                responseType: "blob", // important for binary data
            })

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", file.name) // file name preserved
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            toast("Failed to download file")
        }
    }


    return (
        <div className="rounded border shadow-sm">
            {/* Folder name */}
            <div className="px-4 py-2 border-b bg-muted/40 font-semibold">
                {currentFolder ? currentFolder.name : "Root"}
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b gap-2">
                <Input
                    placeholder="Search files and folders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <PlusIcon className="h-4 w-4 mr-1" />
                                New Folder
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Folder</DialogTitle>
                            </DialogHeader>
                            <Input
                                placeholder="Folder name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setNewFolderOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                                    Create
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon className="h-4 w-4 mr-1" />
                        Upload
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleUpload}
                    />
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30%]">Name</TableHead>
                        <TableHead className="w-[15%]">Type</TableHead>
                        <TableHead className="w-[25%]">Created By</TableHead>
                        <TableHead className="w-[15%]">Created At</TableHead>
                        <TableHead className="w-[15%]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-6">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center py-6 text-muted-foreground"
                            >
                                No files or folders found
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow
                                key={item.id}
                                className="cursor-pointer hover:bg-muted/40"
                                onClick={() => {
                                    if (item.kind === "file") {
                                        handleDownload(item)
                                    }
                                }}
                            >
                                <TableCell className="flex items-center gap-2 font-medium">
                                    {item.kind === "folder" ? (
                                        <>
                                            <FolderIcon className="h-4 w-4 text-blue-600" />
                                            <Link
                                                to={`/app/${params.organizationId}/bucket/${params.bucketId}/${item.id}`}
                                                className="hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <FileIcon className="h-4 w-4 text-gray-600" />
                                            {item.name}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell className="capitalize">{item.kind}</TableCell>
                                <TableCell>
                                    {item.user_name
                                        ? `${item.user_name} (${item.user_email})`
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    {item.created_at
                                        ? new Date(item.created_at).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <Trash2Icon className="h-4 w-4 text-red-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t">
                <button
                    className="text-sm text-muted-foreground disabled:opacity-50"
                    onClick={() => {
                        if (pageIndex > 0) {
                            const prev = cursorStack[pageIndex - 1]
                            fetchFolders(prev)
                            setPageIndex(pageIndex - 1)
                        }
                    }}
                    disabled={pageIndex === 0}
                >
                    ← Previous
                </button>

                <button
                    className="text-sm text-muted-foreground disabled:opacity-50"
                    onClick={() => {
                        if (nextCursor) {
                            fetchFolders(nextCursor)
                            setCursorStack([...cursorStack, nextCursor])
                            setPageIndex(pageIndex + 1)
                        }
                    }}
                    disabled={!nextCursor}
                >
                    Next →
                </button>
            </div>
        </div>
    )
}
