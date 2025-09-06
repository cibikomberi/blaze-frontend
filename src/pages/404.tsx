import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { GhostIcon } from "lucide-react"
import {useEffect} from "react";

export default function NotFoundPage() {
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
        <div className="flex h-screen items-center justify-center bg-background">
            <Card className="max-w-md w-full text-center shadow-lg">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <GhostIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-6xl font-bold">404</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-muted-foreground mb-6">
                        Oops! The page you’re looking for doesn’t exist.
                    </p>
                    <Button asChild>
                        <Link to="/">Go Back Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
