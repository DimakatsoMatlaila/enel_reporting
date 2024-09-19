import { Analytics } from '@vercel/analytics/react';
import AdminMenu from "./admin-menu";
import Footer from "./footer";
import Header from "./header";


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <>
        <Header />
        <div style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
        <AdminMenu/>
        <main style={{
            padding: '1rem',
            flexGrow: 1,
        }}>
            {children}
            <Analytics />   
        </main>
        </div>
        <Footer />
        </>
    );
}

export default AdminLayout;