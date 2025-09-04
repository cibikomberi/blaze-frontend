import * as React from "react"
import {Command, FilesIcon, Home, User2Icon,} from "lucide-react"
import {NavUser} from "@/components/nav-user"
import {OrganizationSwitcher} from "@/components/organization-switcher.tsx"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {NavMain} from "@/components/nav-main.tsx";
import {useAppStore} from "@/store/useAppStore.ts";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = useAppStore((s) => s.user);
    const buckets = useAppStore((s) => s.buckets);
    const data = {
        user: {
            name: user?.name,
            email: user?.email,
            avatar: "/avatars/shadcn.jpg",
        },
        options: [
            {
                title: "Home",
                url: "/home",
                icon: Home,
            },
            {
                title: "Users",
                url: "/app/home",
                icon: User2Icon,
                items: [
                    {
                        title: "Manage users",
                        url: "/app/user"
                    },
                    {
                        title: "Add user",
                        url: "/app/user/add"
                    }
                ]
            },
            {
                title: "Browse",
                url: "/files",
                icon: FilesIcon,
                items: [
                    {
                        title: "All buckets",
                        url: "/app/bucket",
                    },
                ...buckets.map((bucket) => ({
                    title: bucket.name,
                    url: `/app/bucket/${bucket.id}`,
                }))]
            },

        ],

    }
    console.log(data)
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <OrganizationSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.options} />
                {/*<NavProjects options={data.options} />*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
