import {api} from "@/lib/axios.ts";

export async function login(username: string, password: string) {
    const response = await api.post("/auth/login", { username, password });
    api.defaults.headers.common["Authorization"] = response.data.token;
    return response.data;
}

export async function signup(payload: {
    name: string;
    username: string;
    email: string;
    password: string;
}) {
    const res = await api.post("/user", payload);
    return res.data;
}
