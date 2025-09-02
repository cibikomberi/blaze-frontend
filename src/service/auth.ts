import api from "@/lib/axios";

export async function login(username: string, password: string) {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
}

export async function signup(payload: {
    name: string;
    username: string;
    email: string;
    password: string;
}) {
    const res = await api.post("/auth/signup", payload);
    return res.data;
}
