--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: project_status_type; Type: TYPE; Schema: public; Owner: eneldb_owner
--

CREATE TYPE public.project_status_type AS ENUM (
    'inactive',
    'active',
    'complete'
);


ALTER TYPE public.project_status_type OWNER TO eneldb_owner;

--
-- Name: generate_supervisor_id(); Type: FUNCTION; Schema: public; Owner: eneldb_owner
--

CREATE FUNCTION public.generate_supervisor_id() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_id text;
    seq_value integer;
BEGIN
    -- Get the next value from the sequence
    seq_value := nextval('supervisor_id_seq');
    
    -- Format it into 'SXXXXXX'
    new_id := 'S' || LPAD(seq_value::text, 6, '0');
    
    RETURN new_id;
END;
$$;


ALTER FUNCTION public.generate_supervisor_id() OWNER TO eneldb_owner;

--
-- Name: set_supervisor_id(); Type: FUNCTION; Schema: public; Owner: eneldb_owner
--

CREATE FUNCTION public.set_supervisor_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Set the ID using the generate_supervisor_id function
    NEW.id := generate_supervisor_id();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_supervisor_id() OWNER TO eneldb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.admin (
    id character varying(6) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(100),
    password character varying(255),
    CONSTRAINT admin_id_format CHECK (((id)::text ~ '^A0[0-9]{4}$'::text))
);


ALTER TABLE public.admin OWNER TO eneldb_owner;

--
-- Name: contractor; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.contractor (
    id integer NOT NULL,
    address character varying(100),
    service character varying(100),
    company_name character varying(255)
);


ALTER TABLE public.contractor OWNER TO eneldb_owner;

--
-- Name: contractor_id_seq; Type: SEQUENCE; Schema: public; Owner: eneldb_owner
--

CREATE SEQUENCE public.contractor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contractor_id_seq OWNER TO eneldb_owner;

--
-- Name: contractor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eneldb_owner
--

ALTER SEQUENCE public.contractor_id_seq OWNED BY public.contractor.id;


--
-- Name: contractor_projects; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.contractor_projects (
    contractor_id integer NOT NULL,
    project_id integer NOT NULL
);


ALTER TABLE public.contractor_projects OWNER TO eneldb_owner;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    document_url character varying(255),
    status character varying(10),
    email character varying(255),
    document character varying(255),
    CONSTRAINT documents_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('approved'::character varying)::text, ('rejected'::character varying)::text])))
);


ALTER TABLE public.documents OWNER TO eneldb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: eneldb_owner
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO eneldb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eneldb_owner
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: employee; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.employee (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    job_title character varying(50),
    email character varying(100),
    id_no character varying(20),
    race character varying(20),
    skilled boolean,
    local boolean,
    disabled boolean,
    town character varying(50),
    contractor_id integer,
    project_id integer,
    gender character varying(10)
);


ALTER TABLE public.employee OWNER TO eneldb_owner;

--
-- Name: employee_id_seq; Type: SEQUENCE; Schema: public; Owner: eneldb_owner
--

CREATE SEQUENCE public.employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_id_seq OWNER TO eneldb_owner;

--
-- Name: employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eneldb_owner
--

ALTER SEQUENCE public.employee_id_seq OWNED BY public.employee.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(100),
    town character varying(50),
    description character varying(255),
    start_date date,
    end_date date,
    project_status public.project_status_type DEFAULT 'active'::public.project_status_type
);


ALTER TABLE public.projects OWNER TO eneldb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: eneldb_owner
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO eneldb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eneldb_owner
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: supervisor; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.supervisor (
    id character varying(7) NOT NULL,
    project_id integer,
    password character varying(255),
    profile_pic_url character varying(255),
    disabled_status boolean,
    is_admin boolean,
    employee_id integer,
    CONSTRAINT supervisor_id_format CHECK (((id)::text ~ '^S[0-9]{6}$'::text))
);


ALTER TABLE public.supervisor OWNER TO eneldb_owner;

--
-- Name: supervisor_id_seq; Type: SEQUENCE; Schema: public; Owner: eneldb_owner
--

CREATE SEQUENCE public.supervisor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supervisor_id_seq OWNER TO eneldb_owner;

--
-- Name: supervisor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eneldb_owner
--

ALTER SEQUENCE public.supervisor_id_seq OWNED BY public.supervisor.id;


--
-- Name: timesheets; Type: TABLE; Schema: public; Owner: eneldb_owner
--

CREATE TABLE public.timesheets (
    id integer NOT NULL,
    employee_id integer,
    hours_worked numeric(5,2),
    date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.timesheets OWNER TO eneldb_owner;

--
-- Name: timesheets_id_seq; Type: SEQUENCE; Schema: public; Owner: eneldb_owner
--

CREATE SEQUENCE public.timesheets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timesheets_id_seq OWNER TO eneldb_owner;

--
-- Name: timesheets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eneldb_owner
--

ALTER SEQUENCE public.timesheets_id_seq OWNED BY public.timesheets.id;


--
-- Name: contractor id; Type: DEFAULT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.contractor ALTER COLUMN id SET DEFAULT nextval('public.contractor_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: employee id; Type: DEFAULT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.employee ALTER COLUMN id SET DEFAULT nextval('public.employee_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: timesheets id; Type: DEFAULT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.timesheets ALTER COLUMN id SET DEFAULT nextval('public.timesheets_id_seq'::regclass);


--
-- Name: admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: contractor contractor_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.contractor
    ADD CONSTRAINT contractor_pkey PRIMARY KEY (id);


--
-- Name: contractor_projects contractor_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.contractor_projects
    ADD CONSTRAINT contractor_projects_pkey PRIMARY KEY (contractor_id, project_id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: employee employee_email_key; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_email_key UNIQUE (email);


--
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: supervisor supervisor_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_pkey PRIMARY KEY (id);


--
-- Name: timesheets timesheets_pkey; Type: CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.timesheets
    ADD CONSTRAINT timesheets_pkey PRIMARY KEY (id);


--
-- Name: supervisor supervisor_id_trigger; Type: TRIGGER; Schema: public; Owner: eneldb_owner
--

CREATE TRIGGER supervisor_id_trigger BEFORE INSERT ON public.supervisor FOR EACH ROW EXECUTE FUNCTION public.set_supervisor_id();


--
-- Name: contractor_projects contractor_projects_contractor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.contractor_projects
    ADD CONSTRAINT contractor_projects_contractor_id_fkey FOREIGN KEY (contractor_id) REFERENCES public.contractor(id);


--
-- Name: contractor_projects contractor_projects_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.contractor_projects
    ADD CONSTRAINT contractor_projects_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: employee employee_contractor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_contractor_id_fkey FOREIGN KEY (contractor_id) REFERENCES public.contractor(id);


--
-- Name: supervisor fk_employee; Type: FK CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES public.employee(id);


--
-- Name: employee fk_project; Type: FK CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: supervisor supervisor_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: timesheets timesheets_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eneldb_owner
--

ALTER TABLE ONLY public.timesheets
    ADD CONSTRAINT timesheets_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employee(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

