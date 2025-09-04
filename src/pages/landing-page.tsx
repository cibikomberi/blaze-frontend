"use client"

import { Button } from "@/components/ui/button"
import {BubbleBackground} from "@/components/ui/shadcn-io/bubble-background";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                {/* Bubble background */}
                <BubbleBackground interactive className="absolute inset-0" />

                {/* Navbar */}
                <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
                    <div className="text-xl font-bold text-white drop-shadow">MyBrand</div>
                    <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30 border-white/40">
                        Login
                    </Button>
                </header>

                {/* Centered Call to Action */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
                    <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg">
                        Welcome to My App
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-white/80 drop-shadow">
                        A sleek and minimalist way to manage your apps, data, and workflow.
                    </p>
                    <Button size="lg" className="mt-8">
                        Get Started
                    </Button>
                </div>
            </section>

            {/* About Section */}
            <section
                id="about"
                className="container mx-auto flex flex-col items-center justify-center py-20 text-center gap-8"
            >
                {/*<Image*/}
                {/*    src="/me.jpg"  // replace with your actual image path*/}
                {/*    alt="Your Name"*/}
                {/*    width={160}*/}
                {/*    height={160}*/}
                {/*    className="rounded-full border shadow-md"*/}
                {/*/>*/}
                <div>
                    <h2 className="text-3xl font-bold mb-2">Your Name</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        I am a passionate developer experienced in building scalable apps,
                        cloud integrations, and clean frontend experiences. I enjoy crafting
                        seamless UIs with solid backend architecture.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t">
                <div
                    className="container flex h-16 items-center justify-between text-sm text-muted-foreground"
                >
                    <p>© {new Date().getFullYear()} MyBrand. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
