import './App.css'
import {Route, Routes} from "react-router-dom";
import {LoginForm} from "@/components/login-form.tsx";
import {Signup} from "@/components/signup.tsx";
import {MainLayout} from "@/pages/mainLayout.tsx";
import CreateOrganizationPage from "@/pages/new-organization.tsx";
import {useTokenRefresher} from "@/hooks/use-refresh-token.ts";
import BucketsPage from "@/pages/buckets-list.tsx";
import LandingPage from "@/pages/landing-page.tsx";

export function App() {
    useTokenRefresher()
    return (
        <Routes>
            {/*<React.Fragment>            <Toaster />*/}
            {/*</React.Fragment>*/}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Signup  />} />
            <Route path="organization/new" element={<CreateOrganizationPage />} />
            <Route path="app" element={<MainLayout />}>
                <Route path="home" element={<div />} />
                {/*<Route path="organization">*/}
                {/*    <Route path="new" element={<CreateOrganizationPage />} />*/}
                {/*</Route>*/}
                <Route path="bucket">
                    <Route index element={<BucketsPage />} />
                </Route>
            </Route>

            <Route path='*' element={<MainLayout />} />
        </Routes>
    )
}