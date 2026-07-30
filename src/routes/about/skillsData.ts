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
	DESIGN: 'Design & Content',
	COMMUNITY: 'Community & Outreach'
} as const;

export type CategoryName = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export interface SkillItem {
	id: string;
	name: string;
	category: CategoryName;
	// Event IDs where this skill was utilized
	events: string[];
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
	{ id: 'op_mgmt', name: 'Operational Oversight', category: CATEGORIES.LEADERSHIP, events: ['cat', 'icpc', 'pl', 'jb', 'if'] },
	{ id: 'team_mgmt', name: 'Team & People Management', category: CATEGORIES.LEADERSHIP, events: ['cat', 'icpc', 'pl', 'to', 'ti', 'jb'] },
	{ id: 'strat_plan', name: 'Strategic Planning', category: CATEGORIES.LEADERSHIP, events: ['cat', 'ut', 'pl', 'cs', 'jb'] },
	{ id: 'proj_mgmt', name: 'Project Lifecycle & Management', category: CATEGORIES.LEADERSHIP, events: ['cat', 'ti', 'jb', 'if'] },
	{ id: 'event_logistics', name: 'End-to-End Event Logistics', category: CATEGORIES.LEADERSHIP, events: ['cat', 'pl', 'jb'] },
	{ id: 'admin_bureau', name: 'Administration & Bureaucracy', category: CATEGORIES.LEADERSHIP, events: ['cat', 'gl', 'ut', 'pl', 'jb', 'pm'] },
	{ id: 'org_struct', name: 'Organizational Structure', category: CATEGORIES.LEADERSHIP, events: ['cat', 'ti', 'jb', 'pm'] },
	{ id: 'procurement', name: 'Venue & Resource Procurement', category: CATEGORIES.LEADERSHIP, events: ['cat', 'pl', 'jb'] },

	// Tech & Product
	{ id: 'sdlc', name: 'Software Development Life Cycle', category: CATEGORIES.TECH, events: ['cat', 'gl', 'ti', 'if'] },
	{ id: 'prod_owner', name: 'Product Ownership', category: CATEGORIES.TECH, events: ['cat', 'gl', 'ti'] },
	{ id: 'qa_testing', name: 'Quality Assurance & Testing', category: CATEGORIES.TECH, events: ['cat', 'pl', 'ti'] },
	{ id: 'web_dev', name: 'Web Development & Maintenance', category: CATEGORIES.TECH, events: ['cat', 'icpc', 'ti'] },
	{ id: 'ai_adoption', name: 'AI Adoption for Workflows', category: CATEGORIES.TECH, events: ['cat', 'gl'] },
	{ id: 'ai_pipeline', name: 'AI Pipeline Orchestration', category: CATEGORIES.TECH, events: ['cat', 'gl'] },

	// Design & Content
	{ id: 'ui_ux', name: 'UI & UX Design', category: CATEGORIES.DESIGN, events: ['icpc', 'jb', 'if', 'pm'] },
	{ id: 'visual_design', name: 'Visual Design & Event Branding', category: CATEGORIES.DESIGN, events: ['cat', 'icpc', 'jb', 'if', 'pm'] },
	{ id: 'copywriting', name: 'Content Copywriting', category: CATEGORIES.DESIGN, events: ['cat', 'icpc', 'pl', 'jb', 'pm'] },
	{ id: 'social_media', name: 'Social Media Strategy & Content', category: CATEGORIES.DESIGN, events: ['cat', 'icpc', 'ut', 'cs', 'jb'] },
	{ id: 'public_relations', name: 'Public Relations & Pitching', category: CATEGORIES.DESIGN, events: ['cat', 'pl', 'jb', 'if'] },

	// Community & Outreach
	{ id: 'comm_engage', name: 'Community Engagement', category: CATEGORIES.COMMUNITY, events: ['cat', 'ut', 'gl', 'cs', 'jb'] },
	{ id: 'comm_growth', name: 'Audience & Community Growth', category: CATEGORIES.COMMUNITY, events: ['cat', 'ut', 'cs', 'jb'] },
	{ id: 'partnerships', name: 'Partnership Acquisition', category: CATEGORIES.COMMUNITY, events: ['cat', 'icpc', 'cs'] },
	{ id: 'talent_recruitment', name: 'Talent Onboarding & Recruitment', category: CATEGORIES.COMMUNITY, events: ['cat', 'gl', 'jb'] },
	{ id: 'coaching_care', name: 'Mentorship', category: CATEGORIES.COMMUNITY, events: ['pl', 'jb'] },
	{ id: 'open_edu', name: 'Open Educational Resource', category: CATEGORIES.COMMUNITY, events: ['cat', 'ut'] },
];
