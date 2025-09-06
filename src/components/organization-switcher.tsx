import { ChevronsUpDown, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"

export function OrganizationSwitcher() {
    const { isMobile } = useSidebar()
    const organizations = useAppStore((state) => state.organizations)
    const activeOrganization = useAppStore((state) => state.activeOrganization)
    const navigate = useNavigate()

    if (!activeOrganization) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                {/* org logo placeholder */}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{activeOrganization.name}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Teams
                        </DropdownMenuLabel>
                        {organizations.map((organization, index) => (
                            <DropdownMenuItem
                                key={organization.id}
                                onClick={() => navigate(`/app/${organization.id}/home`)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    {/* org logo placeholder */}
                                </div>
                                {organization.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="gap-2 p-2">
                            <Link
                                to="/organization/new"
                                className="flex items-center gap-2 text-muted-foreground font-medium"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                    <Plus className="size-4" />
                                </div>
                                Create new organization
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
