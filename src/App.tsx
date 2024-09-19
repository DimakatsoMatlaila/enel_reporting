import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth-context';
import { NotFoundPage, SignInPage } from './pages';

import { SpeedInsights } from "@vercel/speed-insights/react";
import { AdminLayout, ContractorLayout } from './components';
import AdminDashboard from './pages/admin/dashboard';
import ApproveDocuments from './pages/admin/documents/approve-documents';
import ContractorDocuments from './pages/admin/documents/ContractorDocuments';
import ProfileDocuments from './pages/admin/documents/profile-documents';
import CreateProject from './pages/admin/Projects/CreateProject';
import Projects from './pages/admin/Projects/Projects';
import MainReports from './pages/admin/reports/reports';
import CreateContractor from './pages/admin/suppliers/create-contractor';
import CreateSupplier from './pages/admin/suppliers/create-supplier';
import ListSuppliers from './pages/admin/suppliers/list-suppliers';
import ListSupplierProjects from './pages/admin/timesheets/list-supplierprojects';
import ListAllSuppliers from './pages/admin/timesheets/list-suppliers';
import SelectedProjectTimesheet from './pages/admin/timesheets/timesheet';
import AddSupervisor from './pages/contractor/add-supervisor';
import ContractorDashboard from './pages/contractor/dashboard';
import EmployeeForm from './pages/contractor/employee/create/create';
import CreateEmployeeDocuments from './pages/contractor/employee/create/employee-documents';
import Timesheets from './pages/contractor/employee/timesheets';
import EmployeeDocuments from './pages/contractor/manage-documents/employee-documents';
import ManageDocuments from './pages/contractor/manage-documents/manage-documents';

const AppContent: React.FC = () => {
  const { isLoaded, isSignedIn, userInfo } = useAuth();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const UserType = isSignedIn ? userInfo?.user.id[0] : null; // Either "A" (Admin) or "S" (Supervisor)

  return (
    <BrowserRouter>
      <Routes>
        {isSignedIn ? (
          <>

            {UserType === 'A' && (
              <Route element={<AdminLayout><Outlet /></AdminLayout>}>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path='/projects' element={<Projects/>}/>
                <Route path = '/manage-documents' element={<ContractorDocuments/>}/>
                <Route path = '/list-profiles' element={<ApproveDocuments/>}/>
                <Route path ='/profile-documents' element ={<ProfileDocuments />}/>
                <Route path = '/new-project' element={<CreateProject/>}/>
                <Route path ='/Contractors&Suppliers' element={<ListSuppliers/>}/>
                <Route path = '/create-supplier' element={<CreateSupplier/>}/>  
                <Route path = '/create-default-contractor' element={<CreateContractor/>}/>
                <Route path ='/list-suppliers' element={<ListAllSuppliers/>}/>
                <Route path = '/supplier-projects' element={<ListSupplierProjects/>}/>
                <Route path ='/timesheet' element={<SelectedProjectTimesheet/>}/> 
                <Route path ='/reports' element={<MainReports/>}/>
              </Route>
            )}
            {UserType === 'S' && (
              <Route element={<ContractorLayout><Outlet /></ContractorLayout>}>
                <Route path="dashboard" element={<ContractorDashboard />} />
                <Route path="/new-employee" element={<EmployeeForm />} />
                <Route path="/create-documents" element={<CreateEmployeeDocuments />} />
                <Route path="/timesheets" element={<Timesheets />} />
                <Route path="/manage-documents" element={<ManageDocuments />} />
                <Route path="/employee-documents" element={<EmployeeDocuments />} />
                <Route path="/add-supervisor" element={<AddSupervisor />} />
              </Route>
            )}
            <Route path="/" element={<Navigate to={"/dashboard"} />} />
            <Route path="/sign-in" element={<Navigate to={"/dashboard"} />} />
          </>
        ) : (
          <>
            <Route path="/timesheets" element={<Timesheets />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/" element={<Navigate to="/sign-in" />} />
          </>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
      <SpeedInsights />
    </AuthProvider>

  );
};

export default App;
