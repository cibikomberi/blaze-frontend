import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Link} from "react-router-dom";

const Signup = ({
                     logo = {
                         url: "https://www.shadcnblocks.com",
                         src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
                         title: "shadcnblocks.com",
                     },
                 }) => {
    return (
            <div className="flex items-center justify-center  h-screen">
                {/* Logo */}
                <div className="flex flex-col items-center gap-6 lg:justify-start">
                    <a href={logo.url}>
                        <img
                            src={logo.src}
                            alt="logo"
                            title={logo.title}
                            className="h-10 dark:invert"
                        />
                    </a>
                    <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
                        <h1 className="text-xl font-semibold">Signup</h1>
                        <Input
                            type="email"
                            placeholder="Email"
                            className="text-sm"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="text-sm"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            className="text-sm"
                            required
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
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

