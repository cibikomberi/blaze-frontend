import { useEffect } from "react"
import { api } from "@/lib/axios"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/auth"
import { useNavigate, useParams } from "react-router-dom"

export function useInitialData() {
    const navigate = useNavigate()
    const { organizationId } = useParams<{ organizationId: string }>()

    const token = useAuthStore((s) => s.token)

    const setUser = useAppStore((s) => s.setUser)
    const setOrganizations = useAppStore((s) => s.setOrganizations)
    const setBuckets = useAppStore((s) => s.setBuckets)
    const setActiveOrganization = useAppStore((s) => s.setActiveOrganization)

    const activeOrganization = useAppStore((s) => s.activeOrganization)
    const organizations = useAppStore((s) => s.organizations)

    // Load user and organizations
    useEffect(() => {
        async function loadBaseData() {
            if (!token) return
            try {
                const [userRes, orgsRes] = await Promise.all([
                    api("/auth/me"),
                    api("/organization?limit=10"),
                ])

                setUser(userRes.data)
                setOrganizations(orgsRes.data)

                if (orgsRes.data.length === 0) {
                    navigate("/organization/new")
                    return
                }

                // If no org in URL → redirect to first org
                if (!organizationId) {
                    navigate(`/app/${orgsRes.data[0].id}/home`, { replace: true })
                }
            } catch (err) {
                console.error("Failed to load initial data", err)
            }
        }

        loadBaseData()
    }, [token])

    // Validate organizationId and fetch details
    useEffect(() => {
        async function validateOrg() {
            if (!token || !organizations.length) return
            if (!organizationId) return

            try {
                const res = await api(`/organization/${organizationId}`)
                setActiveOrganization(res.data)
            } catch (err) {
                console.warn("Invalid org, redirecting to first")
                if (organizations.length > 0) {
                    navigate(`/app/${organizations[0].id}/home`, { replace: true })
                }
            }
        }
        validateOrg()
    }, [organizationId, organizations, token])

    // Fetch buckets for active organization
    useEffect(() => {
        async function loadBuckets() {
            if (!activeOrganization) return
            try {
                const bucketsRes = await api(
                    `/bucket?organization_id=${activeOrganization.id}&limit=10`
                )
                setBuckets(bucketsRes.data)
            } catch (err) {
                console.error("Failed to load buckets", err)
            }
        }

        loadBuckets()
    }, [activeOrganization])
}
