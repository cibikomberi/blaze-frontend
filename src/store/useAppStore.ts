import { create } from "zustand"

interface User {
    id: string
    name: string
    email: string
}

interface Organization {
    id: string
    name: string
    logo: string
}

interface Bucket {
    id: string
    name: string
}

interface AppState {
    user: User | null
    organizations: Organization[]
    buckets: Bucket[]
    activeOrganization: Organization | null
    setUser: (user: User | null) => void
    setOrganizations: (orgs: Organization[]) => void
    setBuckets: (buckets: Bucket[]) => void
    setActiveOrganization: (org: Organization | null) => void
}

export const useAppStore = create<AppState>((set) => ({
    user: null,
    organizations: [],
    buckets: [],
    activeOrganization: null,
    setUser: (user) => set({ user }),
    setOrganizations: (orgs) => set({ organizations: orgs }),
    setBuckets: (buckets) => set({ buckets }),
    setActiveOrganization: (org) => set({ activeOrganization: org }),
}))
