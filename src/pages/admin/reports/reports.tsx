import React, { useEffect } from 'react';

const MainReports: React.FC = () => {
    useEffect(() => {
        window.location.href = "http://8.210.71.214/public/dashboard/80808704-39c2-49e6-8806-59b0deb75fe8";
    }, []);

    return <div>Redirecting to the dashboard...</div>;
}

export default MainReports;
