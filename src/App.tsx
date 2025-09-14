import './App.css'
import { Route, Routes } from "react-router-dom";
import { LoginForm } from "@/components/login-form.tsx";
import { Signup } from "@/components/signup.tsx";
import { MainLayout } from "@/pages/mainLayout.tsx";
import CreateOrganizationPage from "@/pages/new-organization.tsx";
import BucketsPage from "@/pages/buckets-list.tsx";
import LandingPage from "@/pages/landing-page.tsx";
import { BucketTable } from "@/pages/bucket-view.tsx";
import NotFoundPage from "@/pages/404.tsx";
import { AuthGate } from "@/components/auth-gate.tsx";
import { OrganizationUsersPage } from "@/pages/organization-users.tsx";
import SecretsPage from "@/pages/secrets.tsx";
import { AuthSuccess } from "@/pages/auth-success.tsx";
import UserPage from "@/pages/user-page.tsx";

export function App() {
    // useTokenRefresher()
    return (
        <Routes>
            {/*<React.Fragment>            <Toaster />*/}
            {/*</React.Fragment>*/}
            <Route path="" element={<LandingPage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<Signup />} />
            <Route path="auth/success" element={<AuthSuccess />} />
            <Route path="organization/new" element={<CreateOrganizationPage />} />
            <Route path="" element={<AuthGate />} >
                <Route path="app" element={<MainLayout />}>
                    <Route path="user/:userId" element={<UserPage />} />
                    <Route path=":organizationId">
                        <Route path="home" element={<div />} />
                        <Route path="user">
                            <Route index element={<OrganizationUsersPage />} />
                            <Route path=":userId" element={<UserPage />} />
                        </Route>
                        <Route path="secret" element={<SecretsPage />} />
                        <Route path="bucket">
                            <Route index element={<BucketsPage />} />
                            <Route path=":bucketId" >
                                <Route index element={<BucketTable />} />
                                <Route path=":folderId" element={<BucketTable />} />
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>

            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    )
}