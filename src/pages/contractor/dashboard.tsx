import { useAuth } from "@/auth-context";
import Menu from "@/components/menu";

const ContractorDashboard: React.FC = () => {
  const { userInfo } = useAuth();
  
  //@ts-ignore
  const username = userInfo?.user.first_name;
  
  const canAddSupervisor = true;

  const routes = {
    "Manage Timesheet Records": "/timesheets",
    "Manage Documents": "/manage-documents",
    "Add New Employee": "/new-employee",
    "Add Supervisor": "/add-supervisor",
  };

  return (
    <Menu username={username} routes={routes} />
  );
};

export default ContractorDashboard;
