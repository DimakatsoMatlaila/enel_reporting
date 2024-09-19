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
    CONSTRAINT documents_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
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
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.admin (id, first_name, last_name, email, password) FROM stdin;
A01234	Admin	One	admin.one@example.com	admin123
A05678	Admin	Two	admin.two@example.com	admin456
\.


--
-- Data for Name: contractor; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.contractor (id, address, service, company_name) FROM stdin;
2	458 Oak Avenue, Springfield	Electrical	Bright Sparks Electrical Ltd.
1	126 Elm Street, Springfield	Plumbing	Acme Plumbing Co.
3	710 Pine Road, Springfield	HVAC	Cool Breeze HVAC Services
6	500 Industrial Parkway, Springfield	Electrical Maintenance	PowerGrid Electrical Services
7	765 Energy Lane, Springfield	Turbine Repair	TurbineTech Solutions
8	1200 Utility Road, Springfield	Cooling Systems	CoolPower Systems Inc.
9	Byldrift	Cleaning	WRS
\.


--
-- Data for Name: contractor_projects; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.contractor_projects (contractor_id, project_id) FROM stdin;
2	1
8	2
1	3
7	4
6	5
3	6
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.documents (id, document_url, status, email, document) FROM stdin;
15	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/Qualifications-0UbUxzrgp69zfwVRCEVQvP9PT9cVfz	pending	dimakatso.matlaila@wits.ac.za	Qualifications
21	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/ID-Uath2T9ZsedkzFdy2xPaMomD2ntmDN	pending	dimakatso.matlaila@wits.ac.za	ID
13	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/ID-yzfPTXp7Crw1Oh7Qxbe5kWNRvCNVtg	approved	alice.johnson@example.com	ID
23	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/ID-sIoiuvbo7Z9A6i1tB9Yt3RITnpHqw0	pending	jack.adams@example.com	ID
24	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/ID-N78DK2YSJQuYF4kvDBLFWJO4MeyFqV	approved	ethan.davis@example.com	ID
25	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/Qualifications-inLtLWKorzznoIi8LABQ0clba0LPdn	approved	david.goldstein@example.com	Qualifications
27	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/ID-6mRpMiRVgB2XXKoifLr8PxOuxOPc2h	pending	david.goldstein@example.com	ID
29	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/Qualifications-acH7Ovt622osiWlBOCU8SyUbgwrCUX	approved	tebogo.nkosi@example.com	Qualifications
30	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/Proof%20of%20Residence-UYUlBCV59aMkhRbORS64Sy55Q6z590	pending	tebogo.nkosi@example.com	Proof of Residence
31	https://pcgyhzbplxptutua.public.blob.vercel-storage.com/ID-9ROVGzr1HzEg4Sc1xspBHW6uxwqGfW	pending	tebogo.nkosi@example.com	ID
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.employee (id, first_name, last_name, job_title, email, id_no, race, skilled, local, disabled, town, contractor_id, project_id, gender) FROM stdin;
31	Michael	Brown	Turbine Technician	michael.brown@example.com	8412065112101	Caucasian	t	t	f	Springfield	2	1	male
32	Laura	Williams	Cooling Systems Specialist	laura.williams@example.com	9203140335100	African	t	f	f	Springfield	8	2	female
33	Ethan	Davis	Electrical Engineer	ethan.davis@example.com	7905276123011	Asian	t	t	t	Springfield	1	3	male
1	Dimakatso	Matlaila	Cybersecurity Analyst	dimakatso.matlaila@wits.ac.za	9210245136080	Caucasian	t	t	f	Springfield	7	4	male
2	Jane	Smith	Electrician	jane.smith@example.com	8405160315100	African American	t	t	t	Springfield	6	5	female
3	Alice	Johnson	HVAC Technician	alice.johnson@example.com	9002240423080	Hispanic	f	t	f	Springfield	3	6	female
34	Tebogo	Nkosi	Mechanical Engineer	tebogo.nkosi@example.com	8902156023080	African	t	t	f	Upington	7	4	male
35	Naledi	Molefe	Civil Engineer	naledi.molefe@example.com	9508170327080	African	t	t	f	Upington	7	4	female
36	Johan	Van Rensburg	Electrical Technician	johan.vanrensburg@example.com	8603295027080	Caucasian	f	t	f	Upington	7	4	male
37	Farah	Patel	Safety Officer	farah.patel@example.com	9201060123080	Asian	t	t	f	Upington	7	4	female
38	Linda	Ngwenya	Project Manager	linda.ngwenya@example.com	8807235237080	African	t	t	f	Upington	7	4	female
39	Sipho	Mahlangu	Site Supervisor	sipho.mahlangu@example.com	8404025112101	African	t	t	f	Upington	7	4	male
40	David	Goldstein	Structural Engineer	david.goldstein@example.com	9005266110080	Caucasian	t	f	f	Upington	7	4	male
41	Rashmi	Naidoo	Environmental Engineer	rashmi.naidoo@example.com	9302180233080	Indian	t	t	f	Upington	7	4	female
42	Thabo	Mokoena	Construction Worker	thabo.mokoena@example.com	8709135336080	African	f	t	f	Upington	7	4	male
43	Zanele	Mthembu	HR Officer	zanele.mthembu@example.com	9506270337080	African	t	t	f	Upington	7	4	female
44	Pieter	Botha	Welding Technician	pieter.botha@example.com	8205145134080	Caucasian	t	t	f	Upington	7	4	male
45	Chen	Wang	Electrical Engineer	chen.wang@example.com	8908116123080	Asian	t	t	f	Upington	7	4	male
46	Fatima	Hassan	Quality Assurance	fatima.hassan@example.com	9107120227080	African	t	t	f	Upington	7	4	female
47	Mohammed	Ismail	Logistics Coordinator	mohammed.ismail@example.com	8704216336080	Indian	f	t	f	Upington	7	4	male
48	Yvonne	Baloyi	Architect	yvonne.baloyi@example.com	9409210437080	African	t	t	f	Upington	7	4	female
49	Tumi	Johns	cleaner	tumiJohns@gmail.com	1907220067080	black	t	t	f	polokwane	1	3	female
80	Zane	Collins	Construction Manager	zane.collins@example.com	8902135427084	Caucasian	t	t	f	Pretoria	9	6	male
81	Ariana	Rivera	Site Inspector	ariana.rivera@example.com	8704235327083	Hispanic	t	t	f	Pretoria	9	6	female
82	Ethan	Gomez	Structural Engineer	ethan.gomez@example.com	8307195236081	Hispanic	t	t	f	Pretoria	9	6	male
83	Olivia	Barnes	Project Coordinator	olivia.barnes@example.com	8507125327080	Caucasian	t	t	f	Pretoria	9	6	female
84	Michael	Clark	Field Technician	michael.clark@example.com	8702115427084	African	t	t	f	Pretoria	9	6	male
85	Charlotte	Hughes	Safety Supervisor	charlotte.hughes@example.com	8603155327083	Caucasian	t	t	f	Pretoria	9	6	female
86	James	Foster	Electrical Technician	james.foster@example.com	8909115234082	African	t	t	f	Pretoria	9	6	male
87	Sophia	Harris	Quality Control	sophia.harris@example.com	8307015327081	Caucasian	t	t	f	Pretoria	9	6	female
88	Liam	Lee	Mechanical Specialist	liam.lee@example.com	8609225236083	Hispanic	t	t	f	Pretoria	9	6	male
89	Emma	Martinez	Safety Officer	emma.martinez@example.com	8504125327084	Caucasian	t	t	f	Pretoria	9	6	female
50	John	Doe	Electrical Technician	john.doe@example.com	8106215075083	African	t	t	f	Springfield	2	1	male
51	Sarah	Connor	Site Engineer	sarah.connor@example.com	8705020327082	African	t	t	f	Springfield	2	1	female
52	Ryan	Adams	Safety Officer	ryan.adams@example.com	9004165123085	African	t	t	f	Springfield	2	1	male
53	Kevin	Lee	Civil Engineer	kevin.lee@example.com	8207185027081	African	t	t	f	Springfield	2	1	male
60	Brandon	Smith	Cooling Specialist	brandon.smith@example.com	8407105236081	African	t	t	f	Springfield	8	2	male
61	Sophia	Kim	Safety Coordinator	sophia.kim@example.com	8607215235083	African	t	t	f	Springfield	8	2	female
63	Ava	Thompson	Field Engineer	ava.thompson@example.com	9005275234082	African	t	t	f	Springfield	8	2	female
64	Mason	Rodriguez	Quality Control Specialist	mason.rodriguez@example.com	8308115427083	African	t	t	f	Springfield	8	2	male
65	Liam	Garcia	Site Safety Officer	liam.garcia@example.com	8509145123084	African	t	t	f	Springfield	8	2	male
66	Isabella	Lopez	Project Assistant	isabella.lopez@example.com	8901115237081	African	t	t	f	Springfield	8	2	female
67	Elijah	Perez	Civil Technician	elijah.perez@example.com	8206035235083	African	t	t	f	Springfield	8	2	male
68	Emma	Hernandez	Environmental Specialist	emma.hernandez@example.com	8603155327080	African	t	t	f	Springfield	8	2	female
69	William	Nguyen	Project Engineer	william.nguyen@example.com	9006225427084	African	t	t	f	Springfield	8	2	male
70	James	King	Electrician	james.king@example.com	8805155123084	African	t	t	f	Springfield	1	3	male
71	Ella	Green	HVAC Technician	ella.green@example.com	8503105237082	African	t	t	f	Springfield	1	3	female
72	Jacob	Scott	Plumber	jacob.scott@example.com	8706095123083	African	t	t	f	Springfield	1	3	male
73	Aiden	Moore	Carpenter	aiden.moore@example.com	8307205427084	African	t	t	f	Springfield	1	3	male
74	Chloe	Taylor	Welder	chloe.taylor@example.com	9108115237085	African	t	t	f	Springfield	1	3	female
75	Daniel	White	Project Planner	daniel.white@example.com	8604215327080	African	t	t	f	Springfield	1	3	male
76	Mila	Walker	Electrical Supervisor	mila.walker@example.com	8201125123083	African	t	t	f	Springfield	1	3	female
77	Alexander	Young	Mechanical Supervisor	alexander.young@example.com	8907145235081	African	t	t	f	Springfield	1	3	male
78	Sophie	Allen	Safety Officer	sophie.allen@example.com	9304095236082	African	t	t	f	Springfield	1	3	female
54	Emily	Davis	Quality Inspector	emily.davis@example.com	8803165225083	African	t	t	f	Springfield	2	1	female
55	Henry	Kumar	Mechanical Engineer	henry.kumar@example.com	8409185227080	African	t	t	f	Springfield	2	1	male
56	Grace	Park	Project Coordinator	grace.park@example.com	8902115235082	African	t	t	f	Springfield	2	1	female
57	Dylan	Nguyen	Electrical Engineer	dylan.nguyen@example.com	8509235327083	African	t	t	f	Springfield	2	1	male
58	Olivia	Martinez	Site Supervisor	olivia.martinez@example.com	8107035027084	African	t	t	f	Springfield	2	1	female
59	Ethan	Wilson	Welder	ethan.wilson@example.com	8705105427083	African	t	t	f	Springfield	2	1	male
62	Lucas	Johnson	Mechanical Technician	lucas.johnson@example.com	8109195327080	African	t	t	f	Springfield	8	2	male
79	Jack	Adams	Plumbing Supervisor	jack.adams@example.com	8708135235083	African	t	t	f	Springfield	1	3	male
110	anathi	mdaki	cleaner	anathimdaki@gmail.com	0103220066080	black	t	t	f	braam	1	3	female
111	Siya	Nhlanhla	IT 	sianhlanhla@gmail.com	1111111111111	Black	t	f	f	Pretoria	6	5	female
112	mitch	john	cleaner	again@gmail.com	0202027890125	black	t	f	f	braam	1	3	male
114	diza	ssssss	IT 	anathi05@gmail.com	1111111111111	Black	t	f	f	Pretoria	8	2	female
115	John	Doe	Cleaner	1232@gmail.com	0203216783082	African	t	t	f	Polokwane	7	4	male
116	Dimakatso	Lamp	Admin Assistant	12342@gmail.com	0203216783182	African	t	f	f	Johannesburg	7	4	male
117	Gontse	Lekgwakgwe	IT Technician	gm8@gmail.com	0203021110011	Black	t	t	f	Soweto	8	2	female
118	Dimakatso	Matlaila	General	dkmatlaila@gmail.com	0307215774088	GROOTHOEK HOSPITAL	t	t	f	Polokwane	7	4	male
119	A	B	C	D@gmail.com	0908090978082	African	t	t	t	Polokwane	7	4	female
120	Mitch	Abc	General	dkmatlaila123@gmail.com	0303215774082	African	t	t	f	Polokwane	7	4	male
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.projects (id, name, town, description, start_date, end_date, project_status) FROM stdin;
3	Project Gamma	Capital City	Gamma project in Capital City focusing on technological innovation	2024-07-01	2028-12-31	active
4	Kusele Wind Farm	 Karoo Hoogland District, Northern Cape	In 2022, we connected the 147 MW Karusa wind farm to the electricity grid. 	2024-08-01	2027-11-30	active
1	Project Omega	Springfield	Alpha project in Springfield focusing on infrastructure development	2024-08-01	2028-12-31	active
2	Project Beta	Shelbyville	Beta project in Shelbyville focusing on renewable energy	2024-07-31	2028-12-31	active
5	Alpha Solar Farm	Upington,Northern Cape	Solar Power Station in Northern Cape	2024-08-01	2028-12-31	active
6	Drakensberg Hydro Farm	Drakensberg Power Station, Jagersrust	The Drakensberg Pumped Storage Scheme is an energy storage facility built in the South African provinces of Free State and KwaZulu-Natal starting in 1974 and completed by 1981. 	2024-08-01	2035-09-30	active
7	jaguar 	Pretoria	Windmill plant	2022-07-12	2024-07-01	active
8	GS Walllerce	Pretoria	hydropower plant	2022-01-11	2025-06-05	active
9	ProjectA	Joburg	Joburd Wind Farm	2024-09-30	2024-09-30	active
\.


--
-- Data for Name: supervisor; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.supervisor (id, project_id, password, profile_pic_url, disabled_status, is_admin, employee_id) FROM stdin;
S000006	1	securepassword1	http://example.com/pic1.jpg	f	t	31
S000007	2	securepassword2	http://example.com/pic2.jpg	f	t	32
S000008	3	securepassword3	http://example.com/pic3.jpg	f	t	33
S000009	4	securepassword4	http://example.com/pic4.jpg	f	t	1
S000010	5	securepassword5	http://example.com/pic5.jpg	f	t	2
S000011	6	securepassword6	http://example.com/pic6.jpg	f	t	3
\.


--
-- Data for Name: timesheets; Type: TABLE DATA; Schema: public; Owner: eneldb_owner
--

COPY public.timesheets (id, employee_id, hours_worked, date) FROM stdin;
36	1	13.00	2024-08-30
98	1	180.00	2024-09-01
99	34	160.00	2024-09-01
100	117	16.00	2024-09-12
101	35	120.00	2024-09-13
102	119	22.00	2024-09-13
103	120	180.00	2024-09-13
37	34	124.00	2024-08-30
38	35	125.00	2024-08-30
39	31	177.00	2024-08-30
40	32	150.00	2024-08-30
41	33	151.00	2024-08-30
42	2	174.00	2024-08-30
43	3	152.00	2024-08-30
44	36	173.00	2024-08-30
45	37	179.00	2024-08-30
46	38	129.00	2024-08-30
47	39	173.00	2024-08-30
48	40	170.00	2024-08-30
49	41	130.00	2024-08-30
50	42	163.00	2024-08-30
51	43	171.00	2024-08-30
52	44	142.00	2024-08-30
53	45	160.00	2024-08-30
54	46	171.00	2024-08-30
55	47	152.00	2024-08-30
56	48	152.00	2024-08-30
57	49	147.00	2024-08-30
58	80	135.00	2024-08-30
59	81	175.00	2024-08-30
60	82	177.00	2024-08-30
61	83	125.00	2024-08-30
62	84	158.00	2024-08-30
63	85	141.00	2024-08-30
64	86	131.00	2024-08-30
65	87	136.00	2024-08-30
66	88	168.00	2024-08-30
67	89	128.00	2024-08-30
68	50	144.00	2024-08-30
69	51	126.00	2024-08-30
70	52	152.00	2024-08-30
71	53	178.00	2024-08-30
72	60	154.00	2024-08-30
73	61	166.00	2024-08-30
74	63	177.00	2024-08-30
75	64	135.00	2024-08-30
76	65	158.00	2024-08-30
77	66	133.00	2024-08-30
78	67	178.00	2024-08-30
79	68	137.00	2024-08-30
80	69	135.00	2024-08-30
81	70	131.00	2024-08-30
82	71	128.00	2024-08-30
83	72	156.00	2024-08-30
84	73	125.00	2024-08-30
85	74	123.00	2024-08-30
86	75	159.00	2024-08-30
87	76	137.00	2024-08-30
88	77	121.00	2024-08-30
89	78	150.00	2024-08-30
90	54	144.00	2024-08-30
91	55	158.00	2024-08-30
92	56	163.00	2024-08-30
93	57	171.00	2024-08-30
94	58	152.00	2024-08-30
95	59	140.00	2024-08-30
96	62	153.00	2024-08-30
97	79	140.00	2024-08-30
\.


--
-- Name: contractor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eneldb_owner
--

SELECT pg_catalog.setval('public.contractor_id_seq', 9, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eneldb_owner
--

SELECT pg_catalog.setval('public.documents_id_seq', 31, true);


--
-- Name: employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eneldb_owner
--

SELECT pg_catalog.setval('public.employee_id_seq', 120, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eneldb_owner
--

SELECT pg_catalog.setval('public.projects_id_seq', 9, true);


--
-- Name: supervisor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eneldb_owner
--

SELECT pg_catalog.setval('public.supervisor_id_seq', 11, true);


--
-- Name: timesheets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eneldb_owner
--

SELECT pg_catalog.setval('public.timesheets_id_seq', 103, true);


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

