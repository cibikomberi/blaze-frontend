import * as React from "react"
import {FilesIcon, Home, KeyRoundIcon, User2Icon} from "lucide-react"
import {NavUser} from "@/components/nav-user"
import {OrganizationSwitcher} from "@/components/organization-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {NavMain} from "@/components/nav-main"
import {useAppStore} from "@/store/useAppStore"
import {useParams} from "react-router-dom"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { organizationId } = useParams<{ organizationId: string }>()
    const user = useAppStore((s) => s.user)
    const buckets = useAppStore((s) => s.buckets)

    // If org isn't known yet, you can render nothing or a skeleton.
    // Your initial-data hook will redirect to a valid org.
    if (!organizationId || !user) {
        return null
    }

    const base = `/app/${organizationId}`

    const data = {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: "/avatars/shadcn.jpg",
        },
        options: [
            {
                title: "Home",
                url: `${base}/home`,
                icon: Home,
            },
            {
                title: "Users",
                url: `${base}/user`,
                icon: User2Icon,
            },
            {
                title: "Secrets",
                url: `${base}/secret`,
                icon: KeyRoundIcon,
            },
            {
                title: "Browse",
                url: `${base}/bucket`,
                icon: FilesIcon,
                items: [
                    {
                        title: "All buckets",
                        url: `${base}/bucket`,
                    },
                    ...buckets.map((bucket) => ({
                        title: bucket.name,
                        url: `${base}/bucket/${bucket.id}`,
                    })),
                ],
            },
        ],
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <OrganizationSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.options} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
