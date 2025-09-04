import axios from "axios";

export const api = axios.create({
    baseURL: "/api", // proxy handles this in dev, same origin in prod
    withCredentials: true, // if you use cookies/JWT in HttpOnly cookies
    headers: {
        "Content-Type": "application/json",
    },
});

