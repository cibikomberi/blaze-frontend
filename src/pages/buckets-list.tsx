"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { api } from "@/lib/axios.ts"
import { useAppStore } from "@/store/useAppStore.ts"

// simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

type Bucket = {
    id: string
    name: string
    created_at: string
    visibility: "PRIVATE" | "PUBLIC"
}

export default function BucketsPage() {
    const activeOrganization = useAppStore((store) => store.activeOrganization)

    const [buckets, setBuckets] = useState<Bucket[]>([])
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // dialog state
    const [open, setOpen] = useState(false)
    const [newBucketName, setNewBucketName] = useState("")
    const [creating, setCreating] = useState(false)

    // pagination stack
    const [cursorStack, setCursorStack] = useState<(string | null)[]>([null])
    const [pageIndex, setPageIndex] = useState(0)

    // search
    const [searchInput, setSearchInput] = useState("")
    const keyword = useDebounce(searchInput, 300)

    const fetchBuckets = async (cursorValue?: string | null, reset = false) => {
        if (!activeOrganization) return
        setLoading(true)
        try {
            const limit = 5
            const res = await api.get<Bucket[]>("/bucket", {
                params: {
                    cursor: cursorValue ?? undefined,
                    limit,
                    organization_id: activeOrganization.id,
                    keyword: keyword || undefined,
                },
            })

            if (res.data.length > 0) {
                setBuckets(res.data)
                if (res.data.length === limit) {
                    setNextCursor(res.data[limit - 1].id)
                } else {
                    setNextCursor(null)
                }
                if (reset) {
                    setCursorStack([null])
                    setPageIndex(0)
                }
            } else {
                setBuckets([])
                setNextCursor(null)
            }
        } catch (err) {
            console.error("Failed to fetch buckets:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBuckets(null, true)
    }, [activeOrganization, keyword])

    // handle next
    const handleNext = () => {
        if (!nextCursor) return
        setCursorStack((prev) => [...prev, nextCursor])
        setPageIndex((prev) => prev + 1)
        fetchBuckets(nextCursor)
    }

    // handle prev
    const handlePrev = () => {
        if (pageIndex === 0) return
        const prevStack = [...cursorStack]
        prevStack.pop()
        const prevCursor = prevStack[prevStack.length - 1]
        setCursorStack(prevStack)
        setPageIndex((prev) => prev - 1)
        fetchBuckets(prevCursor)
    }

    const handleCreateBucket = async () => {
        if (!newBucketName.trim() || !activeOrganization) return
        setCreating(true)
        try {
            await api.post("/bucket", {
                name: newBucketName,
                organization_id: activeOrganization.id,
            })
            setNewBucketName("")
            setOpen(false)
            fetchBuckets(null, true) // refetch from start
        } catch (err) {
            console.error("Failed to create bucket:", err)
        } finally {
            setCreating(false)
        }
    }

    const handleVisibilityChange = async (bucketId: string, visibility: "PRIVATE" | "PUBLIC") => {
        try {
            await api.put(`/bucket`, {
                bucket_id: bucketId,
                visibility
            })
            setBuckets((prev) =>
                prev.map((b) =>
                    b.id === bucketId ? { ...b, visibility } : b
                )
            )
        } catch (err) {
            console.error("Failed to update visibility:", err)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Search Box */}
                    <Input
                        placeholder="Search buckets..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-64"
                    />

                    {/* + Button for Create */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a new bucket</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Bucket Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter bucket name"
                                        value={newBucketName}
                                        onChange={(e) => setNewBucketName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateBucket} disabled={creating}>
                                    {creating ? "Creating..." : "Create"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Visibility</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {buckets.map((bucket) => (
                                <TableRow key={bucket.id}>
                                    <TableCell className="font-medium">{bucket.name}</TableCell>
                                    <TableCell>
                                        {bucket.created_at
                                            ? new Date(bucket.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : ""}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={bucket.visibility}
                                            onValueChange={(val) =>
                                                handleVisibilityChange(bucket.id, val as "PRIVATE" | "PUBLIC")
                                            }
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                                                <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to={bucket.id}>
                                            <Button variant="outline" size="sm">
                                                Open
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {buckets.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                        No buckets found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex justify-center mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={handlePrev}
                                        className={pageIndex === 0 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={handleNext}
                                        className={!nextCursor ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
