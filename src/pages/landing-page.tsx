import { Button } from "@/components/ui/button"
import {BackgroundBeams} from "@/components/ui/shadcn-io/background-beams";
import {useEffect} from "react";
import {Link} from "react-router-dom";

export default function LandingPage() {
    useEffect(() => {
        const root = document.getElementById("root");
        console.log(root);
        if (root) {
            root.id = ""
        }

        return () => {
            if (root) {
                root.id = "root"
            }
        };
    }, []);
    return (
        <div className="h-screen w-full snap-y snap-mandatory overflow-y-scroll">
            {/* Hero Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden text-center px-6 snap-start">
                <BackgroundBeams />
                <div className="relative z-10">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            Blaze
          </span>
                    <div className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-gray-700 to-gray-400/80 bg-clip-text font-extralight text-base md:text-4xl text-transparent dark:from-neutral-100 dark:to-slate-500/30 py-4">
                        Blazing-fast bucket storage, built for developers and teams.
                    </div>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/login">

                        <Button variant="secondary" size="lg">
                            Get Started
                        </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* About the Product */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-6 bg-background snap-start">
                <h2 className="text-4xl font-bold text-foreground">About Blaze</h2>
                <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                    Blaze is a simple and reliable storage solution. You can create buckets
                    to organize your files, store documents, images, or other assets, and
                    access them whenever you need. Built with developers in mind, Blaze
                    helps you manage data without complexity.
                </p>
            </section>

            {/* About Me */}
            <section className="h-screen flex items-center justify-center px-6 bg-muted snap-start">
                <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl">
                    {/* Image left */}
                    <img
                        src="/public/me.png" // put your image inside public/me.jpg
                        alt="My profile"
                        className="w-40 h-40 md:w-86 md:h-86 rounded-full border-primary shadow-lg object-cover"
                    />
                    {/* Content right */}
                    <div className="text-center md:text-left max-w-xl">
                        <h2 className="text-4xl font-bold text-foreground">About Me</h2>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Hi, I’m <span className="font-bold">cibi</span>.
                            I enjoy building developer tools, cloud solutions, and IoT
                            applications. Blaze is a project I created to make file storage
                            faster and more accessible. I love solving problems and creating
                            experiences that help others.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/*<footer className="h-screen flex items-center justify-center border-t text-center text-sm text-muted-foreground snap-start">*/}
            {/*    © {new Date().getFullYear()} Blaze. All rights reserved.*/}
            {/*</footer>*/}
        </div>
    )
}
