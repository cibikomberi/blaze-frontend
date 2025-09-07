import { useEffect, useState } from "react"
import {Outlet, useNavigate} from "react-router-dom"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/store/auth"

export function AuthGate() {
    const [loading, setLoading] = useState(true)
    const setToken = useAuthStore((s) => s.setToken)
    const clearToken = useAuthStore((s) => s.clearToken)
    const navigate = useNavigate()

    useEffect(() => {
        async function refresh() {
            try {
                const res = await api.post("/auth/refresh_token")
                const newToken = res.data.token
                api.defaults.headers.common["Authorization"] = newToken
                setToken(newToken)
            } catch (err) {
                console.error("Failed to refresh token", err)
                clearToken()
                navigate("/login", { replace: true })
            } finally {
                setLoading(false)
            }
        }
        refresh()
    }, [setToken, clearToken])

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                Loading...
            </div>
        )
    }

    return <Outlet />
}
