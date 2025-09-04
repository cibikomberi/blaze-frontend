import { useEffect } from "react"
import { api } from "@/lib/axios"
import {useAppStore} from "@/store/useAppStore.ts";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/auth.ts";

export function useInitialData() {
    const navigate = useNavigate()
    const activeOrganization = useAppStore((s) => s.activeOrganization)
    const setUser = useAppStore((s) => s.setUser)
    const user = useAppStore((s) => s.user)
    const token = useAuthStore((state) => state.token)
    const setOrganizations = useAppStore((s) => s.setOrganizations)
    const setBuckets = useAppStore((s) => s.setBuckets)
    const setActiveOrganization = useAppStore((state) => state.setActiveOrganization)

    useEffect(() => {
        async function loadData() {
            if (!token) return;
            try {
                const [user, organizations] = await Promise.all([
                    api("/auth/me"),
                    api("/organization?limit=10"),
                ])
                setUser(user.data)
                if (organizations.data.length <= 0) navigate("/organization/new")
                setOrganizations(organizations.data)
                setActiveOrganization(organizations.data[0])

                
            } catch (err) {
                console.error("Failed to load initial data", err)
            }
        }
        loadData()
    }, [setUser, setOrganizations, setBuckets, setActiveOrganization, token])
    
    useEffect(() => {
        async function loadBuckets() {
            if (!activeOrganization) return;
            const buckets = await api(`/bucket?organization_id=${activeOrganization.id}&limit=10`);
            setBuckets(buckets.data)
        }
        loadBuckets()
    }, [activeOrganization, setBuckets])


}
