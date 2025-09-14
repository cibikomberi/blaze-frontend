import {Navigate, useSearchParams} from "react-router-dom";
import {useAuthStore} from "@/store/auth.ts";

export function AuthSuccess() {
    const [searchParams, _] = useSearchParams();
    const setToken = useAuthStore((s) => s.setToken)
    const token = searchParams.get("token");
    if (!token) return (<Navigate to={'/login'}></Navigate>)
    setToken(token)
    return (<Navigate to={'/app'}></Navigate>)
}