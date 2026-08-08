<script lang="ts">
	import { SITE_NAME } from '$lib/constants';
	import SkillsMatrix from '$lib/components/SkillsMatrix.svelte';
</script>

<svelte:head>
	<title>About — {SITE_NAME}</title>
	<meta name="description" content="About {SITE_NAME} — background, interests, and contact information." />
</svelte:head>

<div class="fade-in about-container">
	<h1 class="page-title">About</h1>
	
	<section class="about-section">
		<p>
			Hi, I'm <strong>Felicia Limanta</strong>.
		</p>
		<p>
			I'm a lifelong learner dedicated to growing with the community and obsessed with micro-optimizing developer and user experiences alike. Learning something new is always fun!
		</p>
		<p>
			Sort of an AI-native, but a self-proclaimed ambassador of human interaction in this era of AI. (And hey, I still like writing by hand--I mean typing!)
		</p>
	</section>

	<section class="about-section">
		<blockquote class="niche-quote">
			<p>
				"Your niche isn't a specific tool or a single rigid function. Your niche is the ability to step into an average or chaotic scenario, take control of the pieces, and elevate the final experience to something extraordinary. That is a premium skill."
			</p>
			<cite>— What Gemini said about my niche</cite>
		</blockquote>
	</section>

	<section class="about-section">
		<h3>Accumulated Skills Over the Years</h3>
		<p>
			I take on whatever challenge comes up, regardless of how niche or out-of-bounds it feels. Over time, those seemingly unrelated experiences form a surprisingly useful toolkit:
		</p>
		<SkillsMatrix />
		<p>
			With this matrix, I am not saying that I have maxxed out the skills yet. I am still learning and exploring new things.
		</p>
	</section>

	<section class="about-section">
		<h2>Current Commitments</h2>
		<ul>
			<li><a href="https://ewpc.icpc.global/">European Women's Programming Contest</a> - Staff (from 2026)</li>
			<li><a href="https://catournament.org/">Coding & Algorithms Tournament</a> - Contest Director (from 2026)</li>
			<li><a href="https://store.steampowered.com/app/4745300/Flightline">Flightline</a> - Marketer (from 2026)</li>
			<li><a href="https://apac.icpc.global/">ICPC Asia Pacific Championship</a> - Technical Committee (from 2025)</li>
			<li><a href="https://competition.binus.ac.id/">ICPC Asia Jakarta Regional Contest</a> - Committee (from 2024)</li>
			<li><a href="https://untitledtc.com/">Untitled TC</a> - Contributor (from 2024)</li>
			<li><a href="https://www.instagram.com/csrelatedcompetitions" target="_blank" rel="noopener noreferrer">CS-related Competitions</a> - Administrator (from 2021)</li>
		</ul>
	</section>

	<section class="about-section">
		<h2>Hobbies</h2>
		<p>
			I like micro-optimizing DXs and UXs. 
			After some time pondering what my hobby is, I think it falls into this. 
			Always exploring something new to find upgrades to the current status quo releases a dopamine surge that I am addicted to.
		</p>
		<p>
			As weird as it may sounds, I literally will try anything and will go into any rabbit holes.
			From programming to design, tea tasting to arcade rhythm games, TCG to DIYS, I don't think there is anything I wouldn't try given the chance.
		</p>
	</section>

	<section class="about-section">
		<h2>Articles featuring me</h2>
		<p>
			I rarely chase spotlights, but here are some that I know:
		</p>
		<ul class="contact-list">
			<li><a href="https://kumparan.com/kumparantech/ecommurz-gelar-turnamen-coding-and-algoritma-tanpa-ai-tantang-programmer-ri-27JB6DLCEw7" target="_blank" rel="noopener noreferrer">[Kumparan] Ecommurz Gelar Turnamen Coding and Algoritma Tanpa AI, Tantang Programmer RI</a></li>
			<li><a href="https://blog.google/intl/id-id/company-news/outreach-initiatives/2021_07_dua-mahasiswa-indonesia-raih-generation/" target="_blank" rel="noopener noreferrer">[Google] Dua mahasiswa Indonesia raih Generation Google Scholarship</a></li>
			<li><a href="https://careersatagoda.com/blog/all-about-codegoda-2021-on-the-stage-and-behind-the-scenes/" target="_blank" rel="noopener noreferrer">[Agoda] All About CodeGoda 2021: On The Stage & Behind The Scenes</a></li>
		</ul>
	</section>

	<hr>

	<section class="about-section">
		<h2>Get in Touch</h2>
		<p>
			Feel free to reach out or find me online:
		</p>
		<ul class="contact-list">
			<li><a href="https://github.com/si-plus-plus" target="_blank" rel="noopener noreferrer">GitHub</a></li>
			<li><a href="https://www.linkedin.com/in/felicia-limanta/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
			<li><a href="mailto:felicialimanta26@gmail.com">Email</a></li>
		</ul>

		<p>
			Competitive Programming presence:
		</p>
		
		<ul class="contact-list">
			<li><a href="https://icpc.global/ICPCID/IACTF8VWSDO0" target="_blank" rel="noopener noreferrer">ICPC ID</a></li>
			<li><a href="https://stats.egoi.org/people/754/" target="_blank" rel="noopener noreferrer">EGOI Statistics</a></li>
			<li><a href="https://osn.toki.id/statistik/peserta/1570" target="_blank" rel="noopener noreferrer">OSN Informatika (Indonesian NOI)</a></li>
		</ul>

	</section>
</div>

<style>
	.about-container {
		max-width: 680px;
	}

	.about-section {
		margin-bottom: 40px;
		line-height: 1.7;
	}

	.about-section p {
		margin-bottom: 16px;
		color: var(--text-primary);
		opacity: 0.9;
	}

	.travel-hint {
		margin-top: 1.5rem;
	}

	.travel-btn {
		display: inline-block;
		background: var(--bg-surface, #1e1e1e);
		border: 1px solid var(--border-color, #333);
		padding: 0.75rem 1.25rem;
		border-radius: 0.5rem;
		color: #9d4edd;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	:global([data-theme='light']) .travel-btn {
		background: #f5f5f5;
		border-color: #ddd;
	}

	.travel-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(157, 78, 221, 0.15);
		color: #7b2cbf;
	}
</style>
