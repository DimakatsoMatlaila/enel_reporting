import Footer from "./footer";
import Header from "./header";

import { Analytics } from '@vercel/analytics/react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <>
        <Header />
        <main>
            {children}
            <Analytics />
        </main>
        <Footer />
        </>
    );
}

export default MainLayout;