--
-- PostgreSQL database dump
--

\restrict sd1EO4g1Pn1BeptceDNGfdcpGppgegJtH9cAJUSUpIWpfnHGXiobfYJBwfAyseW

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.analytics (
    id integer NOT NULL,
    metric_name character varying(100) NOT NULL,
    metric_value numeric,
    date date NOT NULL,
    source character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.analytics OWNER TO dentodent;

--
-- Name: analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_id_seq OWNER TO dentodent;

--
-- Name: analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.analytics_id_seq OWNED BY public.analytics.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(100) NOT NULL,
    table_name character varying(100),
    record_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO dentodent;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO dentodent;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    title character varying(255),
    subtitle text,
    image_url text NOT NULL,
    mobile_image_url text,
    link_url text,
    alt_text character varying(255),
    "position" character varying(100) DEFAULT 'homepage'::character varying,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.banners OWNER TO dentodent;

--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.banners_id_seq OWNER TO dentodent;

--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: carousel_items; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.carousel_items (
    id integer NOT NULL,
    carousel_id integer,
    title character varying(255),
    description text,
    image_url character varying(500),
    link_url character varying(500),
    target character varying(20) DEFAULT '_self'::character varying,
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carousel_items OWNER TO dentodent;

--
-- Name: carousel_items_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.carousel_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carousel_items_id_seq OWNER TO dentodent;

--
-- Name: carousel_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.carousel_items_id_seq OWNED BY public.carousel_items.id;


--
-- Name: carousels; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.carousels (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carousels OWNER TO dentodent;

--
-- Name: carousels_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.carousels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carousels_id_seq OWNER TO dentodent;

--
-- Name: carousels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.carousels_id_seq OWNED BY public.carousels.id;


--
-- Name: content; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.content (
    id integer NOT NULL,
    section character varying(100) NOT NULL,
    data jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.content OWNER TO dentodent;

--
-- Name: content_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_id_seq OWNER TO dentodent;

--
-- Name: content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.content_id_seq OWNED BY public.content.id;


--
-- Name: content_sections; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.content_sections (
    section_id character varying(255) NOT NULL,
    content_data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.content_sections OWNER TO dentodent;

--
-- Name: form_schemas; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.form_schemas (
    id integer NOT NULL,
    form_type character varying(100) NOT NULL,
    schema jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.form_schemas OWNER TO dentodent;

--
-- Name: form_schemas_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.form_schemas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_schemas_id_seq OWNER TO dentodent;

--
-- Name: form_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.form_schemas_id_seq OWNED BY public.form_schemas.id;


--
-- Name: form_submissions; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.form_submissions (
    id integer NOT NULL,
    form_type character varying(100) NOT NULL,
    submission jsonb NOT NULL,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.form_submissions OWNER TO dentodent;

--
-- Name: form_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.form_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_submissions_id_seq OWNER TO dentodent;

--
-- Name: form_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.form_submissions_id_seq OWNED BY public.form_submissions.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.images (
    id integer NOT NULL,
    path text,
    name text,
    section character varying(100),
    category character varying(100),
    url text,
    alt text,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.images OWNER TO dentodent;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.images_id_seq OWNER TO dentodent;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: media_items; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.media_items (
    id integer NOT NULL,
    title text,
    caption text,
    alt_text text,
    url text,
    category character varying(100),
    file_path text,
    file_type character varying(100),
    file_size integer,
    original_name text,
    tags jsonb DEFAULT '[]'::jsonb,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.media_items OWNER TO dentodent;

--
-- Name: media_items_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.media_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_items_id_seq OWNER TO dentodent;

--
-- Name: media_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.media_items_id_seq OWNED BY public.media_items.id;


--
-- Name: media_library; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.media_library (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_type character varying(50),
    file_size integer,
    alt_text character varying(255),
    caption text,
    tags text,
    is_active boolean DEFAULT true,
    uploaded_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.media_library OWNER TO dentodent;

--
-- Name: media_library_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.media_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_library_id_seq OWNER TO dentodent;

--
-- Name: media_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.media_library_id_seq OWNED BY public.media_library.id;


--
-- Name: navigation_items; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.navigation_items (
    id integer NOT NULL,
    menu_id integer,
    parent_id integer,
    title character varying(100) NOT NULL,
    url character varying(500),
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.navigation_items OWNER TO dentodent;

--
-- Name: navigation_items_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.navigation_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.navigation_items_id_seq OWNER TO dentodent;

--
-- Name: navigation_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.navigation_items_id_seq OWNED BY public.navigation_items.id;


--
-- Name: navigation_menus; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.navigation_menus (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    location character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.navigation_menus OWNER TO dentodent;

--
-- Name: navigation_menus_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.navigation_menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.navigation_menus_id_seq OWNER TO dentodent;

--
-- Name: navigation_menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.navigation_menus_id_seq OWNED BY public.navigation_menus.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(500) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.refresh_tokens OWNER TO dentodent;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO dentodent;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    type character varying(50) DEFAULT 'string'::character varying,
    description text,
    group_name character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.settings OWNER TO dentodent;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO dentodent;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id integer,
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(20),
    address text,
    city character varying(100),
    state character varying(100),
    zip_code character varying(20),
    country character varying(100),
    bio text,
    avatar_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_profiles OWNER TO dentodent;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_profiles_id_seq OWNER TO dentodent;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dentodent
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO dentodent;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dentodent
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO dentodent;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dentodent
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: analytics id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.analytics ALTER COLUMN id SET DEFAULT nextval('public.analytics_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: carousel_items id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.carousel_items ALTER COLUMN id SET DEFAULT nextval('public.carousel_items_id_seq'::regclass);


--
-- Name: carousels id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.carousels ALTER COLUMN id SET DEFAULT nextval('public.carousels_id_seq'::regclass);


--
-- Name: content id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.content ALTER COLUMN id SET DEFAULT nextval('public.content_id_seq'::regclass);


--
-- Name: form_schemas id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.form_schemas ALTER COLUMN id SET DEFAULT nextval('public.form_schemas_id_seq'::regclass);


--
-- Name: form_submissions id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.form_submissions ALTER COLUMN id SET DEFAULT nextval('public.form_submissions_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: media_items id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.media_items ALTER COLUMN id SET DEFAULT nextval('public.media_items_id_seq'::regclass);


--
-- Name: media_library id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.media_library ALTER COLUMN id SET DEFAULT nextval('public.media_library_id_seq'::regclass);


--
-- Name: navigation_items id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.navigation_items ALTER COLUMN id SET DEFAULT nextval('public.navigation_items_id_seq'::regclass);


--
-- Name: navigation_menus id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.navigation_menus ALTER COLUMN id SET DEFAULT nextval('public.navigation_menus_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.analytics (id, metric_name, metric_value, date, source, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.audit_logs (id, user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.banners (id, title, subtitle, image_url, mobile_image_url, link_url, alt_text, "position", display_order, is_active, start_date, end_date, created_at, updated_at) FROM stdin;
1	Modern Dentistry	Advanced technology for painless treatments	/assets/images/banner/slide1.svg	\N		Modern Dentistry Banner	homepage	1	t	\N	\N	2026-02-13 11:07:43.361093	2026-02-13 11:07:43.361093
2	Expert Care	Experienced professionals for your smile	/assets/images/banner/slide2.svg	\N		Expert Care Banner	homepage	2	t	\N	\N	2026-02-13 11:07:43.361093	2026-02-13 11:07:43.361093
3	Comfort First	Relaxing environment for your comfort	/assets/images/banner/slide3.svg	\N		Comfort First Banner	homepage	3	t	\N	\N	2026-02-13 11:07:43.361093	2026-02-13 11:07:43.361093
\.


--
-- Data for Name: carousel_items; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.carousel_items (id, carousel_id, title, description, image_url, link_url, target, "position", is_active, created_at, updated_at) FROM stdin;
1	1	Modern Equipment	State-of-the-art dental technology	/images/carousel1.jpg	/technology	_self	1	t	2025-11-10 17:30:30.281036	2025-11-10 17:30:30.281036
2	1	Expert Team	Experienced dental professionals	/images/carousel2.jpg	/team	_self	2	t	2025-11-10 17:30:30.281036	2025-11-10 17:30:30.281036
3	1	Comfortable Environment	Relaxing atmosphere for your visit	/images/carousel3.jpg	/facility	_self	3	t	2025-11-10 17:30:30.281036	2025-11-10 17:30:30.281036
\.


--
-- Data for Name: carousels; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.carousels (id, name, description, is_active, created_at, updated_at) FROM stdin;
1	Home Page Carousel	Main carousel for homepage	t	2025-11-10 17:30:30.026089	2025-11-10 17:30:30.026089
\.


--
-- Data for Name: content; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.content (id, section, data, updated_at) FROM stdin;
4	contact	{"email": "info@dentodentdentalclinic.com", "phone": "+91 6290093271", "address": "Kolkata, West Bengal"}	2025-12-01 07:55:06.024204
5	doctor	{"bio": "Experienced clinician specializing in painless RCT, implants, and orthodontics.", "name": "Dr. Setketu Chakraborty", "title": "Chief Dental Surgeon", "specialties": ["Root Canal", "Implants", "Orthodontics"]}	2025-12-01 07:55:06.09855
8	blog	{"title": "Dental Blog", "description": "Latest tips and insights on dental care"}	2025-12-01 07:55:06.324858
9	faq	{"items": [{"id": 1, "answer": "With modern anesthesia and rotary instruments, treatment is comfortable.", "question": "Is root canal painful?"}, {"id": 2, "answer": "With proper care, implants can last decades.", "question": "How long do implants last?"}]}	2025-12-01 07:55:06.470172
12	appointment	{"hours": "Mon-Fri: 8am-6pm, Sat: 9am-2pm", "phone": "+91 6290093271", "whatsapp": "+91 6290093271", "bookingUrl": ""}	2025-12-01 07:55:06.768195
14	cta	{"title": "Book Your Appointment", "buttonText": "Call Now", "description": "Painless, advanced dentistry by expert doctors"}	2025-12-01 07:55:06.915654
2	about	{"title": "About Our Clinic", "description": "Modern dental care in South Kolkata with experienced doctor and advanced technology."}	2025-12-02 15:46:31.162813
6	testimonials	{"items": [{"name": "Priya", "rating": 5, "comment": "Professional team and clean clinic. Loved the care."}, {"name": "Sourav", "rating": 5, "comment": "Clear aligners worked amazingly. Thank you!"}]}	2025-12-01 07:55:06.178855
7	gallery	{"items": [{"alt": "Clinic interior", "src": "/assets/images/gallery-1.jpg"}, {"alt": "Treatment room", "src": "/assets/images/gallery-2.jpg"}, {"alt": "Equipment", "src": "/assets/images/gallery-3.jpg"}]}	2025-12-01 07:55:06.253539
17	privacyPolicy	{"title": "Privacy Policy", "content": "We respect your privacy and protect your data."}	2025-12-01 07:55:06.544958
18	termsOfService	{"title": "Terms of Service", "content": "Please read these terms carefully before using our services.", "lastUpdated": "2025-12-01", "effectiveDate": "2025-01-01"}	2025-12-01 07:55:06.618574
1	hero	{"title": "Dent 'O' Dent Dental Clinic", "points": ["Painless Root Canal Treatment", "Dental Implants & Cosmetic Dentistry", "Expert Orthodontics & Clear Aligners"], "subtitle": "Caring for Your Smile with Advanced, Painless Dentistry", "buttonText": "Schedule a Free Consultation", "description": "Caring for Your Smile with Advanced, Painless Dentistry", "phoneNumber": "6290093271"}	2025-12-03 08:19:36.848004
3	services	{"intro": "Complete dental care from preventive to cosmetic and surgical.", "title": "Our Services", "services": [{"name": "Root Canal Treatment", "description": "Painless RCT performed with modern anesthesia and rotary endodontics."}, {"name": "Dental Implants", "description": "Permanent replacement for missing teeth with implant-supported crowns."}, {"name": "Braces & Orthodontics", "description": "Metal, ceramic braces and clear aligners to straighten teeth."}, {"name": "Teeth Whitening", "description": "Safe and effective whitening for a brighter smile."}, {"name": "Smile Makeover", "description": "Veneers, bonding, and alignment for a perfect smile."}, {"name": "Pediatric Dentistry", "description": "Gentle, child-friendly dental care."}]}	2025-12-02 15:46:54.230378
13	slider	{"items": [{"image": "/assets/images/banner/slide1.svg", "title": "Modern Dentistry"}, {"image": "/assets/images/banner/slide2.svg", "title": "Expert Care"}, {"image": "/assets/images/banner/slide3.svg", "title": "Comfort First"}]}	2025-12-01 07:55:06.842895
10	footer	{"text": "© 2025 Dent \\"O\\" Dent Dental Clinic. All rights reserved.", "links": [{"href": "/privacy", "label": "Privacy"}, {"href": "/terms", "label": "Terms"}, {"href": "/contact", "label": "Contact"}], "clinicName": "Dent 'O' Dent"}	2025-12-02 15:53:39.790376
15	patient	{"intro": "Access appointments, reports, and settings", "features": ["View appointments", "Download reports", "Manage preferences"]}	2025-12-01 07:55:06.988487
16	header	{"navItems": [{"mode": "scroll", "label": "Home", "target": "home"}, {"mode": "scroll", "label": "About", "target": "about"}, {"mode": "scroll", "label": "Treatments", "target": "services"}, {"mode": "route", "label": "Gallery", "target": "gallery"}, {"mode": "route", "label": "Blog", "target": "blog"}, {"mode": "scroll", "label": "FAQ", "target": "faq"}, {"mode": "scroll", "label": "Contact", "target": "contact"}]}	2025-12-01 07:55:05.491447
21	map	{"lat": 22.5726, "lng": 88.3639, "address": "Kolkata, India"}	2025-12-01 07:55:05.949293
22	test-section	{"title": "Test Content Verification", "description": "This is a test to verify that content updates are working correctly after deployment."}	2025-11-08 04:39:13.339593
19	treatments	{"items": [{"slug": "root-canal", "title": "Root Canal Therapy", "imageUrl": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800", "description": "Pain-free root canal treatment with modern techniques."}, {"slug": "dental-implants", "title": "Dental Implants", "imageUrl": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800", "description": "Permanent, natural-looking replacement for missing teeth."}, {"slug": "smile-makeover", "title": "Smile Makeover", "imageUrl": "https://images.unsplash.com/photo-1592917327476-3f5b0314e1a6?w=800", "description": "Transform your smile with cosmetic dentistry solutions."}]}	2025-11-08 12:42:20.478485
20	reviews	{"items": [{"date": "2024-08-12", "name": "Ananya", "rating": 5, "message": "Wonderful experience and painless treatment!"}, {"date": "2024-07-28", "name": "Rahul", "rating": 4, "message": "Professional staff and modern clinic."}, {"date": "2024-06-10", "name": "Priya", "rating": 5, "message": "Highly recommended for implants."}]}	2025-11-08 12:42:20.594999
11	blogPosts	{"posts": [{"date": "2025-01-05", "slug": "best-dentist-in-kolkata-2025-guide", "cover": "https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81", "title": "Best Dentist in Kolkata: 2025 Guide to Choosing the Right Clinic", "content": "Choosing a dental clinic in Kolkata can be overwhelming. In this guide, we compare technology (digital X-rays, rotary endo), common treatments (RCT, implants, braces), emergency availability, and cost transparency.", "excerpt": "Looking for the best dentist in Kolkata? Compare treatments, costs, and technology in this 2025 guide.", "category": "Guides", "keywords": ["best dentist kolkata", "dental clinic kolkata", "dentist near me"]}, {"date": "2025-01-12", "slug": "root-canal-cost-in-kolkata-painless-options", "cover": "https://images.unsplash.com/photo-1588776814546-1ff441c36edb", "title": "Root Canal Cost in Kolkata: Painless Options Explained", "content": "Root canal therapy at Dent O Dent uses rotary endodontics and apex locators for precise and comfortable procedures.", "excerpt": "Understand pain-free RCT options, typical prices, and same-day emergency treatment availability in Kolkata.", "category": "Endodontics", "keywords": ["root canal kolkata", "rct cost kolkata", "painless root canal"]}]}	2025-11-08 12:42:20.875436
23	diagnostic	{"message": "E2E test update", "timestamp": "2025-11-08T13:15:51.542Z"}	2025-11-08 13:15:34.843143
\.


--
-- Data for Name: content_sections; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.content_sections (section_id, content_data, created_at, updated_at) FROM stdin;
hero	{"image": "https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200", "title": "Exceptional Dental Care", "content": "We provide comprehensive dental services with the latest technology and techniques.", "subtitle": "Your smile is our priority", "buttonLink": "/appointment", "buttonText": "Book Appointment"}	2026-02-13 11:07:42.760845	2026-02-13 11:07:42.760845
about	{"image": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800", "title": "About Our Clinic", "content": "Dent 'O' Dent has been serving the community with exceptional dental care for over 15 years. Our team of experienced professionals is committed to providing personalized treatment in a comfortable environment."}	2026-02-13 11:07:42.826246	2026-02-13 11:07:42.826246
services	{"title": "Our Services", "services": [{"id": 1, "image": "https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=400", "title": "Teeth Cleaning", "description": "Professional cleaning to remove plaque and tartar."}, {"id": 2, "image": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400", "title": "Dental Implants", "description": "Replace missing teeth with natural-looking implants."}]}	2026-02-13 11:07:42.901045	2026-02-13 11:07:42.901045
slider	{"items": [{"image": "https://api.dentodentdentalclinic.com/assets/images/banner/slide1.svg", "order": 1, "title": "Modern Dentistry", "active": true, "linkUrl": "", "subtitle": "Advanced technology for painless treatments", "linkLabel": ""}, {"image": "https://api.dentodentdentalclinic.com/assets/images/banner/slide2.svg", "order": 2, "title": "Expert Care", "active": true, "linkUrl": "", "subtitle": "Experienced professionals for your smile", "linkLabel": ""}, {"image": "https://api.dentodentdentalclinic.com/assets/images/banner/slide3.svg", "order": 3, "title": "Comfort First", "active": true, "linkUrl": "", "subtitle": "Relaxing environment for your comfort", "linkLabel": ""}]}	2026-02-13 11:07:42.966009	2026-02-13 11:07:42.966009
\.


--
-- Data for Name: form_schemas; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.form_schemas (id, form_type, schema, updated_at) FROM stdin;
\.


--
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.form_submissions (id, form_type, submission, submitted_at) FROM stdin;
1	appointment	{"email": "test@example.com", "notes": "Left lower molar", "phone": "+91 9876543210", "service": "Root Canal", "urgency": "routine", "lastName": "Patient", "symptoms": "Tooth pain", "firstName": "Test", "preferredDate": "2025-12-05", "preferredTime": "11:00"}	2025-12-01 08:01:26.590643
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.images (id, path, name, section, category, url, alt, uploaded_at) FROM stdin;
1	\N	\N	\N	hero	https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200	Dental care	2026-02-13 11:07:43.095911
2	\N	\N	\N	about	https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800	Dental clinic	2026-02-13 11:07:43.095911
\.


--
-- Data for Name: media_items; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.media_items (id, title, caption, alt_text, url, category, file_path, file_type, file_size, original_name, tags, uploaded_at, updated_at) FROM stdin;
1	Dental Care	Professional dental care service	Dental care	https://images.unsplash.com/photo-1588776813677-77d805c04d5c?w=1200	hero	\N	\N	\N	\N	["dental", "care"]	2026-02-13 11:07:43.235924	2026-02-13 11:07:43.235924
2	Dental Clinic	Modern dental clinic interior	Dental clinic	https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800	about	\N	\N	\N	\N	["clinic", "interior"]	2026-02-13 11:07:43.235924	2026-02-13 11:07:43.235924
\.


--
-- Data for Name: media_library; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.media_library (id, filename, original_name, file_path, file_type, file_size, alt_text, caption, tags, is_active, uploaded_by, created_at, updated_at) FROM stdin;
1	logo.svg	logo.svg	/images/logo.svg	image/svg+xml	2048	Dent O Dent Logo	Main logo	logo,brand	t	1	2025-11-10 17:41:13.900947	2025-11-10 17:41:13.900947
2	favicon.ico	favicon.ico	/images/favicon.ico	image/x-icon	1024	Dent O Dent Favicon	Favicon	favicon,icon	t	1	2025-11-10 17:41:13.900947	2025-11-10 17:41:13.900947
3	banner1.jpg	banner1.jpg	/images/banner1.jpg	image/jpeg	102400	Dental Office	Main banner	banner,office	t	1	2025-11-10 17:41:13.900947	2025-11-10 17:41:13.900947
4	banner2.jpg	banner2.jpg	/images/banner2.jpg	image/jpeg	98000	Teeth Whitening	Special offer banner	banner,offer	t	1	2025-11-10 17:41:13.900947	2025-11-10 17:41:13.900947
5	carousel1.jpg	carousel1.jpg	/images/carousel1.jpg	image/jpeg	120000	Dental Equipment	Modern equipment	carousel,equipment	t	1	2025-11-10 17:41:13.900947	2025-11-10 17:41:13.900947
6	carousel2.jpg	carousel2.jpg	/images/carousel2.jpg	image/jpeg	110000	Dental Team	Professional team	carousel,team	t	1	2025-11-10 17:41:13.900947	2025-11-10 17:41:13.900947
7	carousel3.jpg	carousel3.jpg	/images/carousel3.jpg	image/jpeg	105000	Dental Office Interior	Comfortable environment	carousel,office	t	1	2025-11-10 17:41:13.900947	2025-11-10 17:41:13.900947
\.


--
-- Data for Name: navigation_items; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.navigation_items (id, menu_id, parent_id, title, url, "position", is_active, created_at, updated_at) FROM stdin;
1	1	\N	Home	/	1	t	2025-11-10 17:03:40.561739	2025-11-10 17:03:40.561739
2	1	\N	About	/about	2	t	2025-11-10 17:03:40.561739	2025-11-10 17:03:40.561739
3	1	\N	Services	/services	3	t	2025-11-10 17:03:40.561739	2025-11-10 17:03:40.561739
4	1	\N	Contact	/contact	4	t	2025-11-10 17:03:40.561739	2025-11-10 17:03:40.561739
\.


--
-- Data for Name: navigation_menus; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.navigation_menus (id, name, location, is_active, created_at, updated_at) FROM stdin;
1	main-menu	header	t	2025-11-10 17:03:40.560378	2025-11-10 17:03:40.560378
2	Main Navigation	header	t	2025-11-10 17:30:30.531458	2025-11-10 17:30:30.531458
3	Footer Navigation	footer	t	2025-11-10 17:30:30.531458	2025-11-10 17:30:30.531458
6	Social Media Links	footer	t	2025-11-10 17:46:01.193625	2025-11-10 17:46:01.193625
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.refresh_tokens (id, user_id, token, expires_at, created_at) FROM stdin;
1	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc1NzA1LCJleHAiOjE3NjUxODA1MDV9.x0oGxpmZKxKKOCBVb2ee4gVc47AYKGDYyPhNoyNkVjM	2025-12-08 07:55:05.41	2025-12-01 07:55:05.411274
2	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc1OTY0LCJleHAiOjE3NjUxODA3NjR9.QpWQlqurqKz6nFeFmNZPfHKfowUeA6bEPoUrYWebZyE	2025-12-08 07:59:24.826	2025-12-01 07:59:24.827651
3	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc2MDg2LCJleHAiOjE3NjUxODA4ODZ9.xK7WXXeDi1HuWzRnj9lILzCHObdXbmhrf9mJIK_PM1g	2025-12-08 08:01:26.845	2025-12-01 08:01:26.84619
4	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc2MTMxLCJleHAiOjE3NjUxODA5MzF9.P49l2IMX1NYABxrCqBR-zsXn4ooeKLm9KzfqApZyTOk	2025-12-08 08:02:11.468	2025-12-01 08:02:11.46872
5	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NjQxLCJleHAiOjE3NjUxODM0NDF9.ZEXOYDcp6uelo5lIxuyuvu1TK_MGX8nU1OwyHJBob1E	2025-12-08 08:44:01.475	2025-12-01 08:44:01.475936
6	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NjQzLCJleHAiOjE3NjUxODM0NDN9.t6hLlX-bbOhBuvZ3Y4G3ONd6GkwXkfxRhNDYiscccAg	2025-12-08 08:44:03.578	2025-12-01 08:44:03.578981
7	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NjQ0LCJleHAiOjE3NjUxODM0NDR9.JP4G9aNRtSwya_RbhNhnzPGU7HDoOSNvb-pNXgvopjw	2025-12-08 08:44:04.195	2025-12-01 08:44:04.195503
8	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NjQ2LCJleHAiOjE3NjUxODM0NDZ9.wFT_xj2FVzdViYLylrA6hdWpFv7j6xUBIjjH7P7vRAk	2025-12-08 08:44:06.252	2025-12-01 08:44:06.252919
9	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NjQ3LCJleHAiOjE3NjUxODM0NDd9.URPNYdJHuUHO5MJcJy-uv7u5Lxzc98Zc6VvRSyX0t2Y	2025-12-08 08:44:07.04	2025-12-01 08:44:07.041266
10	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NjUyLCJleHAiOjE3NjUxODM0NTJ9.FTzPS6fKjAmLXC2Rb8xnnX0veQ9kEIZ_JvHM23Z4qQE	2025-12-08 08:44:12.136	2025-12-01 08:44:12.137385
11	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NjUyLCJleHAiOjE3NjUxODM0NTJ9.FTzPS6fKjAmLXC2Rb8xnnX0veQ9kEIZ_JvHM23Z4qQE	2025-12-08 08:44:12.429	2025-12-01 08:44:12.430295
12	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4Njc1LCJleHAiOjE3NjUxODM0NzV9.ts8alsnd9-A5Ldk7RQ6rBBIg1fRee18Lm5isaOvOWCA	2025-12-08 08:44:35.163	2025-12-01 08:44:35.164144
13	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4Njc1LCJleHAiOjE3NjUxODM0NzV9.ts8alsnd9-A5Ldk7RQ6rBBIg1fRee18Lm5isaOvOWCA	2025-12-08 08:44:35.498	2025-12-01 08:44:35.498679
14	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4Njc2LCJleHAiOjE3NjUxODM0NzZ9.ZHO00eiZZmqxgYB4OZ0Lbyq711z0-6mgD-vlDwWqcbw	2025-12-08 08:44:36.031	2025-12-01 08:44:36.032311
15	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NzkyLCJleHAiOjE3NjUxODM1OTJ9.D_7x4mly65GDsv6KSyFkWEFj3shLjJ3o48ZSkOWQLRk	2025-12-08 08:46:32.87	2025-12-01 08:46:32.870482
16	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4NzkzLCJleHAiOjE3NjUxODM1OTN9.uVjcEmJB0KK80gtn7eFIJLnVYVn03WeiT_Nj9Qt_qIU	2025-12-08 08:46:33.877	2025-12-01 08:46:33.877975
17	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc4OTg3LCJleHAiOjE3NjUxODM3ODd9.c2M3PND5QtXlAc0rn7lCQ9PPVCvJ4qer7MQCZPKk-jg	2025-12-08 08:49:47.223	2025-12-01 08:49:47.224294
18	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTc5NzE1LCJleHAiOjE3NjUxODQ1MTV9.7hteUTNngCPSK5Vba-Z6SOX4pcZGwWniHv9OpqDDM5M	2025-12-08 09:01:55.058	2025-12-01 09:01:55.058917
19	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTgwMjIwLCJleHAiOjE3NjUxODUwMjB9.qfeq1gV1FwLpoUiAC9CGvKhn_TU0xkc8ZwImqlhPggc	2025-12-08 09:10:20.77	2025-12-01 09:10:20.770744
20	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTgwMzgzLCJleHAiOjE3NjUxODUxODN9.rgrw9p3SQ_E_xd5Ty1hRHfnv_hZduQgMt89IHqjVG5s	2025-12-08 09:13:03.973	2025-12-01 09:13:03.974174
21	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTk5NDcxLCJleHAiOjE3NjUyMDQyNzF9._qpidsQbZR66TAFzykFGlaKfWSHKH0KJUWfa1xAK-l4	2025-12-08 14:31:11.806	2025-12-01 14:31:11.807282
22	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NTk5NzA3LCJleHAiOjE3NjUyMDQ1MDd9.pykbHruxQF9UA8qbeQlD1go0o7c26HT_PCaKKPsQnyM	2025-12-08 14:35:07.633	2025-12-01 14:35:07.63441
23	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAwNTczLCJleHAiOjE3NjUyMDUzNzN9.JgRYew0Ew3lt-pD1nT1jaxDRRIi7QQkkyTku7jtFaiI	2025-12-08 14:49:33.131	2025-12-01 14:49:33.132088
24	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAxMzA4LCJleHAiOjE3NjUyMDYxMDh9._ORtRI9vt6SvG1NS76JE6t8POUycXwQtPyL05OJNiZE	2025-12-08 15:01:48.543	2025-12-01 15:01:48.54455
25	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyODI2LCJleHAiOjE3NjUyMDc2MjZ9.QRqFfUdgkM_kvCSteI7mHhcnSP9MdAFMeKtwSay_omI	2025-12-08 15:27:06.374	2025-12-01 15:27:06.374881
26	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyODMxLCJleHAiOjE3NjUyMDc2MzF9.W9CUoW6uSmATxoPkju9RDL0FrwqfCgRYy3coASXNGlc	2025-12-08 15:27:11.458	2025-12-01 15:27:11.459118
27	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyODMyLCJleHAiOjE3NjUyMDc2MzJ9.D5Ao978QnjGSQ15jXK_aDp56HUnHpKVfArWopITdsrw	2025-12-08 15:27:12.138	2025-12-01 15:27:12.139306
28	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyODMyLCJleHAiOjE3NjUyMDc2MzJ9.D5Ao978QnjGSQ15jXK_aDp56HUnHpKVfArWopITdsrw	2025-12-08 15:27:12.479	2025-12-01 15:27:12.480385
29	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyODk4LCJleHAiOjE3NjUyMDc2OTh9.uzorsoezXglGDakbY7BSPk7aWWB9nR-c2RMijD8O9-8	2025-12-08 15:28:18.481	2025-12-01 15:28:18.481441
30	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyOTAwLCJleHAiOjE3NjUyMDc3MDB9.cm4_FlVtkTRy900_mwhgDNTQUjRn-jCcLNAlan1G5vg	2025-12-08 15:28:20.82	2025-12-01 15:28:20.820425
31	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyOTAxLCJleHAiOjE3NjUyMDc3MDF9.w8bD_XuQ6Czj_UcLH0d1nz7wGRVTKru6tzf9ecpLy9Y	2025-12-08 15:28:21.42	2025-12-01 15:28:21.42101
32	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAyOTY2LCJleHAiOjE3NjUyMDc3NjZ9.kRt6cC6OmxlQnaKXCcwofWl3DdY-J2ScodYuBvs1S5s	2025-12-08 15:29:26.347	2025-12-01 15:29:26.348401
33	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAzNDYwLCJleHAiOjE3NjUyMDgyNjB9.hFHYvENEsdtqfCgpCeoVv8BhX_ajTvKepv2-LjnvqzI	2025-12-08 15:37:40.309	2025-12-01 15:37:40.309836
34	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAzNDYxLCJleHAiOjE3NjUyMDgyNjF9.QBKM-Lpq-f0xmOnuPdXQhU5wBe3e7vrXr1CL6NP4MP8	2025-12-08 15:37:41.88	2025-12-01 15:37:41.880962
35	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAzNDYyLCJleHAiOjE3NjUyMDgyNjJ9.y1xzqKStgqCk69uA_feNy462FCkbIrejBacz_S3zB_4	2025-12-08 15:37:42.2	2025-12-01 15:37:42.200532
36	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjAzNTI0LCJleHAiOjE3NjUyMDgzMjR9.1zkkbiZB17Qa_51CvIPGLV0FY2bjWspIbGyiW_E035Q	2025-12-08 15:38:44.98	2025-12-01 15:38:44.981109
37	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY0NjExODA1LCJleHAiOjE3NjUyMTY2MDV9.PxL9X-5zQNTDmXeilCYZK6E4q3Kxis8zqUdciHVvsIY	2025-12-08 17:56:45.155	2025-12-01 17:56:45.156176
38	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY2MDU5NzQ0LCJleHAiOjE3NjY2NjQ1NDR9.QzODpwavNcV8ttLNOoY4GFR7gx5fUdMyZJ-RmcbqxSk	2025-12-25 12:09:04.801	2025-12-18 12:09:04.804704
39	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY2MDU5NzQ3LCJleHAiOjE3NjY2NjQ1NDd9.D83tK-q-kokVPUYMTM-2OxxAGLe-_hh6C2DxVToRecU	2025-12-25 12:09:07.543	2025-12-18 12:09:07.543894
40	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY2MDU5NzU1LCJleHAiOjE3NjY2NjQ1NTV9.7a3uvACI_QWXVaChs_1q_v91kdlm-iJl43WgIpvo6js	2025-12-25 12:09:15.192	2025-12-18 12:09:15.193003
41	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY2MDU5NzU1LCJleHAiOjE3NjY2NjQ1NTV9.7a3uvACI_QWXVaChs_1q_v91kdlm-iJl43WgIpvo6js	2025-12-25 12:09:15.942	2025-12-18 12:09:15.942675
42	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzY2MDU5NzU2LCJleHAiOjE3NjY2NjQ1NTZ9.uWBjR_IVy10WUzAETqilLwGKUfsMZXM1U6HuzzEi_E0	2025-12-25 12:09:16.268	2025-12-18 12:09:16.269642
43	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODg3LCJleHAiOjE3NzA2MzE2ODd9.TS8hd7SVYKlarg7i3f1yJ5U-8w2fnnQU7n8IgT3BPss	2026-02-09 10:08:07.712	2026-02-02 10:08:07.712707
44	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODkzLCJleHAiOjE3NzA2MzE2OTN9.v68yLFohhX4SuTz9P0Kljx_H_0noImrSXBAFMxbtewY	2026-02-09 10:08:13.411	2026-02-02 10:08:13.41166
45	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODk0LCJleHAiOjE3NzA2MzE2OTR9.jbNoOQT14-m3C9-m458Bhz36xQ2ymDgWie5fIW58Bi4	2026-02-09 10:08:14.259	2026-02-02 10:08:14.259729
46	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODk0LCJleHAiOjE3NzA2MzE2OTR9.jbNoOQT14-m3C9-m458Bhz36xQ2ymDgWie5fIW58Bi4	2026-02-09 10:08:14.853	2026-02-02 10:08:14.854031
47	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODk1LCJleHAiOjE3NzA2MzE2OTV9.qW9Q165fzFstXQa62IhNJ0vjl2H5SMT6DOSA52Zt1ms	2026-02-09 10:08:15.064	2026-02-02 10:08:15.064805
48	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODk2LCJleHAiOjE3NzA2MzE2OTZ9.phZDDdZoJMqEmBAm9fUpKNPg14VzpsLqpYBP1N-8ipQ	2026-02-09 10:08:16.589	2026-02-02 10:08:16.589855
49	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODk3LCJleHAiOjE3NzA2MzE2OTd9.i0enu85qlYMC08pvIBGTIJkjP17FA9jx8XW6knVDb2A	2026-02-09 10:08:17.43	2026-02-02 10:08:17.430522
50	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODk3LCJleHAiOjE3NzA2MzE2OTd9.i0enu85qlYMC08pvIBGTIJkjP17FA9jx8XW6knVDb2A	2026-02-09 10:08:17.628	2026-02-02 10:08:17.629098
51	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI2ODk4LCJleHAiOjE3NzA2MzE2OTh9.feV25Hrkq6bwKC92I6E8SOHsEVeI2-G6PTFdke4Dol4	2026-02-09 10:08:18.399	2026-02-02 10:08:18.400246
52	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3MDc0LCJleHAiOjE3NzA2MzE4NzR9.UuHuag3qOV93s5A4JfVVsXO21Ai0zcplGeWlUb_5fv0	2026-02-09 10:11:14.947	2026-02-02 10:11:14.9484
53	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3MDc1LCJleHAiOjE3NzA2MzE4NzV9.gXq1iSQI_Eiyc4SOxeOUU-VMkmHU2gOQPHJBI4X6Xrc	2026-02-09 10:11:15.993	2026-02-02 10:11:15.993985
54	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3MDg2LCJleHAiOjE3NzA2MzE4ODZ9.gDOXvuTIieeHkfpPs7SGsE8MmeIMiCLGcGlqVOflUxw	2026-02-09 10:11:26.57	2026-02-02 10:11:26.570766
55	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3MDg3LCJleHAiOjE3NzA2MzE4ODd9.-dKgWryHB3BY0wf3lMHXuUAwrhTODr5qjTSormbQz5c	2026-02-09 10:11:27.813	2026-02-02 10:11:27.813789
56	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3Mzc2LCJleHAiOjE3NzA2MzIxNzZ9.K9IgkzauBT26I8bmaGJgfrkeS-UZ5JnXtkqIeJ2FE-s	2026-02-09 10:16:16.961	2026-02-02 10:16:16.961473
57	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3Mzc4LCJleHAiOjE3NzA2MzIxNzh9.M7T2D4-aTWw0W3JIwEq64t2VB5OWG9mWuzzQ0KRNyXY	2026-02-09 10:16:18.249	2026-02-02 10:16:18.250259
58	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3Mzc4LCJleHAiOjE3NzA2MzIxNzh9.M7T2D4-aTWw0W3JIwEq64t2VB5OWG9mWuzzQ0KRNyXY	2026-02-09 10:16:18.434	2026-02-02 10:16:18.434781
59	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3Mzc4LCJleHAiOjE3NzA2MzIxNzh9.M7T2D4-aTWw0W3JIwEq64t2VB5OWG9mWuzzQ0KRNyXY	2026-02-09 10:16:18.618	2026-02-02 10:16:18.619249
60	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3Mzc4LCJleHAiOjE3NzA2MzIxNzh9.M7T2D4-aTWw0W3JIwEq64t2VB5OWG9mWuzzQ0KRNyXY	2026-02-09 10:16:18.79	2026-02-02 10:16:18.790834
61	1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBkZW50b2RlbnQuY29tIiwiaWF0IjoxNzcwMDI3Mzg4LCJleHAiOjE3NzA2MzIxODh9.wHNkVc9BJLuSX5H62JnAilXLcE6VAu7p5GrZzzAaE3w	2026-02-09 10:16:28.87	2026-02-02 10:16:28.870409
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.settings (id, key, value, type, description, group_name, is_active, created_at, updated_at) FROM stdin;
1	site_name	Dent 'O' Dent Dental Clinic	string	Website name	general	t	2025-11-10 17:03:40.563694	2025-11-10 17:03:40.563694
2	site_description	Professional dental care services for the whole family	string	Website description	general	t	2025-11-10 17:03:40.563694	2025-11-10 17:03:40.563694
3	contact_email	info@dentodentdentalclinic.com	string	Contact email	contact	t	2025-11-10 17:03:40.563694	2025-11-10 17:03:40.563694
4	contact_phone	+1 (555) 123-4567	string	Contact phone	contact	t	2025-11-10 17:03:40.563694	2025-11-10 17:03:40.563694
10	contact_address	123 Dental Street, Toothville, TV 12345	string	Clinic address	\N	t	2025-11-10 17:46:02.122981	2025-11-10 17:46:02.122981
11	business_hours	Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM	string	Business hours	\N	t	2025-11-10 17:46:02.122981	2025-11-10 17:46:02.122981
12	emergency_phone	+1 (555) 987-6543	string	Emergency contact	\N	t	2025-11-10 17:46:02.122981	2025-11-10 17:46:02.122981
13	social_facebook	https://facebook.com/dentodent	string	Facebook page	\N	t	2025-11-10 17:46:02.122981	2025-11-10 17:46:02.122981
14	social_twitter	https://twitter.com/dentodent	string	Twitter account	\N	t	2025-11-10 17:46:02.122981	2025-11-10 17:46:02.122981
15	social_instagram	https://instagram.com/dentodent	string	Instagram account	\N	t	2025-11-10 17:46:02.122981	2025-11-10 17:46:02.122981
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.user_profiles (id, user_id, first_name, last_name, phone, address, city, state, zip_code, country, bio, avatar_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dentodent
--

COPY public.users (id, email, password, created_at) FROM stdin;
1	admin@dentodent.com	$2b$10$k7UihwGosUrFrAum.Mip/ucmUE/RBXI52.jO5CIlb7fhGo/DY49v6	2025-10-26 17:34:01.151513
\.


--
-- Name: analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.analytics_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.banners_id_seq', 3, true);


--
-- Name: carousel_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.carousel_items_id_seq', 3, true);


--
-- Name: carousels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.carousels_id_seq', 1, true);


--
-- Name: content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.content_id_seq', 23, true);


--
-- Name: form_schemas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.form_schemas_id_seq', 1, false);


--
-- Name: form_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.form_submissions_id_seq', 1, true);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.images_id_seq', 2, true);


--
-- Name: media_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.media_items_id_seq', 2, true);


--
-- Name: media_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.media_library_id_seq', 7, true);


--
-- Name: navigation_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.navigation_items_id_seq', 4, true);


--
-- Name: navigation_menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.navigation_menus_id_seq', 6, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 61, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.settings_id_seq', 15, true);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dentodent
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: carousel_items carousel_items_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.carousel_items
    ADD CONSTRAINT carousel_items_pkey PRIMARY KEY (id);


--
-- Name: carousels carousels_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.carousels
    ADD CONSTRAINT carousels_pkey PRIMARY KEY (id);


--
-- Name: content content_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.content
    ADD CONSTRAINT content_pkey PRIMARY KEY (id);


--
-- Name: content_sections content_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.content_sections
    ADD CONSTRAINT content_sections_pkey PRIMARY KEY (section_id);


--
-- Name: form_schemas form_schemas_form_type_key; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.form_schemas
    ADD CONSTRAINT form_schemas_form_type_key UNIQUE (form_type);


--
-- Name: form_schemas form_schemas_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.form_schemas
    ADD CONSTRAINT form_schemas_pkey PRIMARY KEY (id);


--
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: media_items media_items_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_pkey PRIMARY KEY (id);


--
-- Name: media_library media_library_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.media_library
    ADD CONSTRAINT media_library_pkey PRIMARY KEY (id);


--
-- Name: navigation_items navigation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT navigation_items_pkey PRIMARY KEY (id);


--
-- Name: navigation_menus navigation_menus_name_key; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.navigation_menus
    ADD CONSTRAINT navigation_menus_name_key UNIQUE (name);


--
-- Name: navigation_menus navigation_menus_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.navigation_menus
    ADD CONSTRAINT navigation_menus_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: settings settings_key_key; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_key UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: carousel_items carousel_items_carousel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.carousel_items
    ADD CONSTRAINT carousel_items_carousel_id_fkey FOREIGN KEY (carousel_id) REFERENCES public.carousels(id) ON DELETE CASCADE;


--
-- Name: navigation_items navigation_items_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT navigation_items_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.navigation_menus(id) ON DELETE CASCADE;


--
-- Name: navigation_items navigation_items_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.navigation_items
    ADD CONSTRAINT navigation_items_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.navigation_items(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentodent
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO dentodent;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: dentodent
--

ALTER DEFAULT PRIVILEGES FOR ROLE dentodent IN SCHEMA public GRANT ALL ON SEQUENCES TO dentodent;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO dod_user;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO dentodent;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: dentodent
--

ALTER DEFAULT PRIVILEGES FOR ROLE dentodent IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dentodent;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dod_user;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dentodent;


--
-- PostgreSQL database dump complete
--

\unrestrict sd1EO4g1Pn1BeptceDNGfdcpGppgegJtH9cAJUSUpIWpfnHGXiobfYJBwfAyseW

