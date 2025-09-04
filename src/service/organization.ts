import {api} from "@/lib/axios.ts";

export async function create(name: string) {
    const response = await api.post('organization', { name });
    return response.data;
}