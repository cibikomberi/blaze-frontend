import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/service/auth.ts";

const Signup = ({
                    logo = {
                        url: "https://www.shadcnblocks.com",
                        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
                        title: "shadcnblocks.com",
                    },
                }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.username || !form.email) {
            setError("All fields are required");
            return;
        }
        setError("");
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await signup({
                name: form.name,
                username: form.username,
                email: form.email,
                password: form.password,
            });
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-6 lg:justify-start">
                <a href={logo.url}>
                    <img
                        src={logo.src}
                        alt="logo"
                        title={logo.title}
                        className="h-10 dark:invert"
                    />
                </a>

                <form
                    onSubmit={step === 1 ? handleNext : handleSubmit}
                    className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md"
                >
                    <h1 className="text-xl font-semibold">
                        Signup
                    </h1>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {step === 1 && (
                        <>
                            <Input
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <Button type="submit" className="w-full">
                                Next →
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                            <div className="flex w-full gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-1/2"
                                    onClick={() => setStep(1)}
                                >
                                    ← Back
                                </Button>
                                <Button type="submit" disabled={loading} className="w-1/2">
                                    {loading ? "Creating..." : "Create Account"}
                                </Button>
                            </div>
                        </>
                    )}
                </form>

                <div className="text-muted-foreground flex justify-center gap-1 text-sm">
                    <p>Already a user?</p>
                    <Link
                        to="/login"
                        className="text-primary font-medium hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export { Signup };
