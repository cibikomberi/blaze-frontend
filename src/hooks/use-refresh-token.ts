"use client"

import {useEffect} from "react"
import {useAuthStore} from "@/store/auth.ts";
import {api} from "@/lib/axios.ts";

export function useTokenRefresher() {
    const setToken = useAuthStore((state) => state.setToken)
    const clearAuth = useAuthStore((state) => state.clearToken)

    useEffect(() => {
        let interval: NodeJS.Timeout

        const refresh = async () => {
            try {
                const res = await api.post("/auth/refresh_token")
                const newToken = res.data.token

                api.defaults.headers.common["Authorization"] = `${newToken}`
                setToken(newToken)
            } catch (err) {
                console.error("Failed to refresh token", err)
                // navigate("/login")
            }
        }

        // run immediately on mount
        refresh()

        // then repeat every 5 minutes
        interval = setInterval(refresh, 5 * 60 * 1000)

        return () => clearInterval(interval)
    }, [setToken, clearAuth])
}
