import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {api} from "@/lib/axios" // assuming you have axios wrapper
import {Check, Copy, Plus, Trash2} from "lucide-react"
import {useParams} from "react-router-dom";

type Secret = {
    id: string
    secret: string
}

export default function SecretsPage() {
    const { organizationId } = useParams();
    const [secrets, setSecrets] = useState<Secret[]>([])
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState<string | null>(null) // track copied field

    const fetchSecrets = async () => {
        setLoading(true)
        try {
            const res = await api.get("/organization/secret", { params:{
                organization_id: organizationId,
                limit,
                page,
            }})
            console.log(res.data)
            setSecrets(res.data || [])
        } finally {
            setLoading(false)
        }
    }

    const createSecret = async () => {
        await api.post("/organization/secret", {
            organization_id: organizationId,
        })
        fetchSecrets()
    }

    const deleteSecret = async (id: string) => {
        await api.delete("/organization/secret", {
            data: { id, organization_id: organizationId },
        })
        fetchSecrets()
    }
    const copyToClipboard = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(null), 1500) // reset after 1.5s
    }

    useEffect(() => {
        fetchSecrets()
    }, [page])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Secrets
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                New Secret
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Secret</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                Do you want to create a new secret?
                            </div>
                            <DialogFooter>
                                <Button onClick={createSecret}>Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {secrets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                                        No secrets found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                secrets.map((secret) => (
                                    <TableRow key={secret.id}>

                                        <TableCell>{secret.id}
                                            <span className="truncate" onClick={() => copyToClipboard(secret.id, `${secret.id}`)}>{secret.id}</span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(secret.id, `${secret.id}`)}
                                            >
                                                {copied === `${secret.id}` ? (
                                                    <Check className="h-4 w-4" />
                                                ): (<Copy className="h-4 w-4" />)}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <span className="truncate" onClick={() => copyToClipboard(secret.secret, `${secret.secret}`)}>{secret.secret}</span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(secret.secret, `${secret.secret}`)}
                                            >
                                                {copied === `${secret.secret}` ? (
                                                    <Check className="h-4 w-4" />
                                                ): (<Copy className="h-4 w-4" />)}
                                            </Button></TableCell>
                                        <TableCell>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => deleteSecret(secret.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* Pagination controls */}
                <div className="flex justify-between items-center mt-4">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                        Previous
                    </Button>
                    <span className="text-sm">Page {page}</span>
                    <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)}>
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
