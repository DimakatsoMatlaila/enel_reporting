export type Admin = {
    id: any;
    first_name?: any;
    last_name?: any;
    email?: any;
    password?: any;
}

export type AdminInput = {
    id?: any;
    first_name?: any;
    last_name?: any;
    email?: any;
    password?: any;
}

export type Contractor = {
    id: any;
    address?: any;
    service?: any;
    company_name?: any;
}

export type ContractorInput = {
    id?: any;
    address?: any;
    service?: any;
    company_name?: any;
}

export type ContractorProjects = {
    contractor_id: any;
    project_id: any;
}

export type ContractorProjectsInput = {
    contractor_id: any;
    project_id: any;
}

export type Documents = {
    id: any;
    document_url?: any;
    status?: any;
    email?: any;
    document?: any;
}

export type DocumentsInput = {
    id?: any;
    document_url?: any;
    status?: any;
    email?: any;
    document?: any;
}

export type Employee = {
    id: any;
    first_name?: any;
    last_name?: any;
    job_title?: any;
    email?: any;
    id_no?: any;
    race?: any;
    skilled?: boolean;
    local?: boolean;
    disabled?: boolean;
    town?: any;
    contractor_id?: any;
    project_id?: any;
    gender?: any;
}

export type EmployeeInput = {
    id?: any;
    first_name?: any;
    last_name?: any;
    job_title?: any;
    email?: any;
    id_no?: any;
    race?: any;
    skilled?: boolean;
    local?: boolean;
    disabled?: boolean;
    town?: any;
    contractor_id?: any;
    project_id?: any;
    gender?: any;
}

export type Projects = {
    id: any;
    name?: any;
    town?: any;
    description?: any;
    start_date?: Date | string;
    end_date?: Date | string;
    project_status?: any;
}

export type ProjectsInput = {
    id?: any;
    name?: any;
    town?: any;
    description?: any;
    start_date?: Date | string;
    end_date?: Date | string;
    project_status?: any;
}

export type Supervisor = {
    id: any;
    project_id?: any;
    password?: any;
    profile_pic_url?: any;
    disabled_status?: boolean;
    is_admin?: boolean;
    employee_id?: any;
}

export type SupervisorInput = {
    id?: any;
    project_id?: any;
    password?: any;
    profile_pic_url?: any;
    disabled_status?: boolean;
    is_admin?: boolean;
    employee_id?: any;
}

export type Timesheets = {
    id: any;
    employee_id?: any;
    hours_worked?: any;
    date?: Date | string;
}

export type TimesheetsInput = {
    id?: any;
    employee_id?: any;
    hours_worked?: any;
    date?: Date | string;
}

