import './App.css'
import {Route, Routes} from "react-router-dom";
import {LoginForm} from "@/components/login-form.tsx";
import {Signup} from "@/components/signup.tsx";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<div />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Signup  />} />
        </Routes>
    )
}