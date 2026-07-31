export interface EventRole {
	id: string;
	title: string;
	line1: string;
	line2?: string;
	years: string;
}

export const CATEGORIES = {
	LEADERSHIP: 'Leadership & Ops',
	TECH: 'Tech & Product',
	COMMUNITY: 'Community & Outreach',
	DESIGN: 'Design & Content'
} as const;

export type CategoryName = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export interface SkillItem {
	id: string;
	name: string;
	category: CategoryName;
	events: string[];
	description?: string;
}

export const EVENTS: EventRole[] = [
	{ id: 'cat', title: 'Coding & Algorithms Tournament', line1: 'CAT', line2: '', years: '2026–' },
	{ id: 'icpc', title: 'ICPC Regionals, Asia Pacific Championship, and World Finals', line1: 'ICPC', line2: '', years: '2024–' },
	{ id: 'ut', title: 'untitledtc', line1: 'untitled', line2: 'tc', years: '2024–' },
	{ id: 'gl', title: 'GDP Labs', line1: 'GDP', line2: 'Labs', years: '2024–26' },
	{ id: 'pl', title: 'TOKI Pelatnas (National Training Camp) for IOI/EGOI', line1: 'TOKI', line2: 'Pelatnas', years: '2024' },
	{ id: 'to', title: 'TOKI OSN (Indonesian National Olympiad in Informatics)', line1: 'TOKI', line2: 'OSN', years: '2023' },
	{ id: 'ti', title: 'TOKI IOI (International Olympiad in Informatics)', line1: 'TOKI', line2: 'IOI', years: '2022' },
	{ id: 'cs', title: 'csrelatedcompetitions', line1: 'csrc', line2: '', years: '2021–' },
	{ id: 'jb', title: 'Jollybee Binus Competitive Programming Team', line1: 'Jollybee', line2: '', years: '2020–24' },
	{ id: 'if', title: 'Apple iOS Foundation', line1: 'iOS', line2: 'Fdn.', years: '2019' },
	{ id: 'pm', title: 'High School Magazine', line1: 'HS', line2: 'Magazine', years: '2016-18' }
];

export const SKILLS: SkillItem[] = [
	// Leadership & Ops
	{
		id: 'op_mgmt',
		name: 'Operational Oversight',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'icpc', 'ut', 'pl', 'cs', 'jb', 'if'],
		description: 'Directing organizational strategy, system efficiency, and overall execution across teams and events.'
	},
	{
		id: 'team_mgmt',
		name: 'Team & People Management',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'icpc', 'ut', 'gl', 'pl', 'to', 'ti', 'jb'],
		description: 'Leading, guiding, and coordinating multi-disciplinary teams toward shared milestones.'
	},
	{
		id: 'strat_plan',
		name: 'Strategic Planning',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'ut', 'pl', 'cs', 'jb'],
		description: 'Setting long-term goals, structuring roadmaps, and anticipating operational bottlenecks.'
	},
	{
		id: 'proj_mgmt',
		name: 'Project Lifecycle & Management',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'pl', 'ti', 'jb', 'if'],
		description: 'Overseeing project scope, milestones, deliverables, and deadline execution from start to finish.'
	},
	{
		id: 'event_logistics',
		name: 'End-to-End Event Logistics',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'ut', 'pl', 'jb'],
		description: 'Managing venue setup, schedule flow, technical requirements, and ground operations.'
	},
	{
		id: 'admin_bureau',
		name: 'Stakeholder & Administrative Management',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'gl', 'ut', 'pl', 'to', 'jb', 'pm'],
		description: 'Navigating organizational policies, institutional relations, and administrative documentation.'
	},
	{
		id: 'intl_relations',
		name: 'International Event Coordination',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'icpc', 'pl', 'ti'],
		description: 'Liaising with international delegations, organizing global events, and cross-border communication.'
	},
	{
		id: 'finance',
		name: 'Financial Oversight',
		category: CATEGORIES.LEADERSHIP,
		events: ['cat', 'icpc', 'ut', 'pl', 'cs', 'jb'],
		description: 'Managing budgets, resource allocation, sponsorship accounts, and financial tracking.'
	},

	// Tech & Product
	{
		id: 'sdlc',
		name: 'Software Development Life Cycle',
		category: CATEGORIES.TECH,
		events: ['cat', 'icpc', 'gl', 'ti', 'if'],
		description: 'Managing software development from requirement analysis to deployment and maintenance.'
	},
	{
		id: 'prod_owner',
		name: 'Product Ownership',
		category: CATEGORIES.TECH,
		events: ['cat', 'icpc', 'ut', 'gl', 'ti', 'csrc', 'if'],
		description: 'Defining product vision, prioritizing features, and aligning developer output with user needs.'
	},
	{
		id: 'qa_testing',
		name: 'Quality Assurance & Testing',
		category: CATEGORIES.TECH,
		events: ['cat', 'pl', 'ti', 'jb', 'if'],
		description: 'Validating system correctness, problem dataset verification, automated test execution, and ensuring the quality of deliverables.'
	},
	{
		id: 'ai_adoption',
		name: 'AI Adoption for Workflows',
		category: CATEGORIES.TECH,
		events: ['cat', 'gl', 'ut'],
		description: 'Integrating AI tools and LLM workflows to streamline team productivity and code iteration.'
	},
	{
		id: 'ai_pipeline',
		name: 'AI Pipeline Orchestration',
		category: CATEGORIES.TECH,
		events: ['cat', 'gl'],
		description: 'Designing automated AI data workflows, prompt systems, and model integration pipelines.'
	},

	// Community & Outreach
	{
		id: 'comm_engage',
		name: 'Community Engagement',
		category: CATEGORIES.COMMUNITY,
		events: ['cat', 'ut', 'gl', 'cs', 'jb'],
		description: 'Fostering active community participation, hosting events, and building welcoming communities.'
	},
	{
		id: 'comm_growth',
		name: 'Audience & Community Growth',
		category: CATEGORIES.COMMUNITY,
		events: ['cat', 'ut', 'cs', 'jb'],
		description: 'Expanding reach, member retention, and organic engagement across competitive programming and computer science competition networks.'
	},
	{
		id: 'partnerships',
		name: 'Partnership Acquisition',
		category: CATEGORIES.COMMUNITY,
		events: ['cat', 'icpc', 'gl', 'cs'],
		description: 'Securing sponsorships, institutional backing, and collaborative partner relationships.'
	},
	{
		id: 'talent_recruitment',
		name: 'Talent Onboarding & Recruitment',
		category: CATEGORIES.COMMUNITY,
		events: ['cat', 'gl', 'jb'],
		description: 'Identifying, interviewing, and onboarding skilled contributors for competitive teams and projects.'
	},
	{
		id: 'coaching_care',
		name: 'Mentorship',
		category: CATEGORIES.COMMUNITY,
		events: ['pl', 'jb'],
		description: 'Guiding mentees through technical training, problem solving, and personal growth.'
	},
	{
		id: 'open_edu',
		name: 'Open Educational Resource',
		category: CATEGORIES.COMMUNITY,
		events: ['cat', 'ut', 'cs'],
		description: 'Creating and publishing open-access learning materials, problem sets, and educational contest archives.'
	},

	// Design & Content
	{
		id: 'ui_ux',
		name: 'UI, UX, or DX Design',
		category: CATEGORIES.DESIGN,
		events: ['cat', 'icpc', 'pl', 'jb', 'if', 'pm'],
		description: 'Crafting intuitive interfaces, smooth user journeys, and micro-optimized developer experiences.'
	},
	{
		id: 'visual_design',
		name: 'Visual Design & Event Branding',
		category: CATEGORIES.DESIGN,
		events: ['cat', 'icpc', 'ut', 'cs', 'jb', 'if', 'pm'],
		description: 'Creating cohesive event branding, visual assets, and digital media.'
	},
	{
		id: 'copywriting',
		name: 'Copywriting & Proofreading',
		category: CATEGORIES.DESIGN,
		events: ['cat', 'icpc', 'ut', 'pl', 'ti', 'jb', 'pm'],
		description: 'Writing concise, clear documentation, promotional announcements, and ensuring the quality of written content.'
	},
	{
		id: 'social_media',
		name: 'Social Media Strategy & Content',
		category: CATEGORIES.DESIGN,
		events: ['cat', 'icpc', 'ut', 'cs', 'jb'],
		description: 'Curating targeted content strategies and managing social channels for maximum reach.'
	}
];
