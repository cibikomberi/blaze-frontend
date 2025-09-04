"use client"

import {useState} from "react"
// import {createOrganization} from "@/lib/api"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {toast, Toaster} from "sonner"
import {useAppStore} from "@/store/useAppStore.ts";
import {create} from "@/service/organization.ts";
import {useNavigate} from "react-router-dom";

export default function CreateOrganizationPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const setOrganizations = useAppStore((state) => state.setOrganizations)
    const setActiveOrganization = useAppStore((state) => state.setActiveOrganization)
    const organizations = useAppStore((state) => state.organizations)

    const handleCreate = async () => {
        console.log(name)
        if (name.trim().length < 4) {
            toast.error("Organization name must be at least 4 characters")
            return
        }

        setLoading(true)
        try {
            const org = await create(name);
            setOrganizations([...organizations, org]);
            setActiveOrganization(org);
            toast.success("Organization created successfully")
            navigate("/home")
        } catch (err: any) {
            toast.error(err.message || "Failed to create organization")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Toaster  position="top-center" />

            <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
            <CardTitle className="text-xl">Create Organization</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
    <div className="grid gap-2">
    <Label htmlFor="org-name">Organization Name</Label>
    <Input
    id="org-name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Enter organization name"
        />
        </div>
        <Button
    className="w-full"
    onClick={handleCreate}
    disabled={loading}
        >
        {loading ? "Creating..." : "Create"}
        </Button>
        </CardContent>
        </Card>
        </div>
)
}
