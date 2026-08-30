import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, Linkedin, Mail, Palette } from 'lucide-react';
import PageTransition from './PageTransition';
import { useNetworkState } from '../context/NetworkStateContext';

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  marginBottom: '16px',
};

const DIVIDER = <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '32px 0' }} />;

const experience = [
  {
    company: 'Numaris',
    location: 'Remote, Mexico',
    description: 'Mexican telematics/IoT platform for fleet & asset management',
    roles: [
      {
        title: 'Senior Product Designer (AI)',
        period: 'Oct 2025 – Aug 2026',
        bullets: [
          'Used Replit and AI tooling to build NEXT platform features from scratch, putting a first working version in front of stakeholders in 2–4 days instead of the weeks a Figma-based process took.',
          'Owned functional scope, PRDs, and user stories across 20+ modules: device and organization administration, support ticketing, notifications, and fleet operations (geofencing, fuel reporting, command aliases).',
          'Solved the profile sprawl common in legacy systems with a relationship-based access model: a lean set of core profiles (up to 10) combine dynamically to cover a wide range of permission and visibility configurations.',
          "Every prototype ran on the platform's existing design system, so new modules stayed consistent and front-end and back-end teams could build straight from them.",
          'Also explored an AI-first technical support concept: could AI resolve user support queries autonomously instead of routing them to an agent?',
        ],
      },
      {
        title: 'Product Designer',
        period: 'Jun 2023 – Apr 2024',
        bullets: [
          "Shaped the platform's first modules from zero: monitoring, events, unit detail, trip history, and tagging, taking them from concept and user flows through Figma designs that later carried into the AI-assisted phase.",
        ],
      },
    ],
  },
  {
    company: 'Ekatena',
    location: 'Remote, Mexico',
    description: 'Financial risk analysis platform',
    roles: [
      {
        title: 'Product Design Lead',
        period: 'Apr 2024 – Sept 2025',
        bullets: [
          'Returned full-time to take over complete design ownership of a platform I had helped shape as part of the founding product team in 2021, operating as the platform’s sole designer with product-owner-level responsibilities.',
          'Hired and mentored the designer who took over the role, continuing on as a design advisor after the engagement ended.',
          'The design system was a joint effort with engineering: I drove the component library and guidelines that kept the product consistent as it scaled.',
          'Built out a report-relationship system plus a dedicated Ultimate Beneficial Owner (UBO) report for deeper shareholder and risk analysis.',
          'That focus on report clarity paid off: the platform’s main risk report and the credit bureau report were repeatedly cited in client testimonials as the reason clients chose Ekatena over competitors.',
          'Worked with engineering on the strategy to improve load performance on report detail views, reducing render time for heavy data sets, and streamlined the roles and permissions system to improve analyst workflow and operational scalability.',
          "Took the platform to mobile, deciding what earns space on a small screen and what doesn't.",
        ],
      },
    ],
  },
  {
    company: 'Neerva',
    location: 'Remote, Mexico',
    description: 'Freelance Designer',
    roles: [
      {
        title: 'Freelance Designer',
        period: 'Sept 2022 – Jun 2023',
        bullets: [
          "Web and mobile design for Neerva's US-based clients: sections of New Era's mobile app and website, plus a redesign of the Grasshopper mobile application.",
          'Also delivered eCommerce sites for other US clients, web and mobile.',
        ],
      },
    ],
  },
  {
    company: 'Cymatic.io',
    location: 'Remote, Mexico (HQ: Raleigh NC)',
    description: 'Product Designer',
    roles: [
      {
        title: 'Product Designer',
        period: 'Jan 2021 – Sept 2022',
        bullets: [
          "Reworked the product's information architecture (hierarchy and user roles) so it could serve larger organizations like Universal Media Group and the University of Oklahoma.",
          'Onboarding went from a week-long install with partial developer support to a self-guided 10–20 minute flow non-technical users could finish alone, which helped grow the client base.',
          'Added components to the design system and pushed clarity and accessibility improvements.',
          'Shipped a customizable cybersecurity playbook feature: explicit rules and workflows for risk mitigation.',
          'Rebuilt the notification system for scale and day-to-day usability.',
        ],
      },
    ],
  },
  {
    company: 'michelada.io',
    location: 'Colima, MX',
    description: 'Product Designer',
    roles: [
      {
        title: 'Product Designer',
        period: '2018 – 2020',
        bullets: [
          "Ran the design sprint that produced Levi's Mexico's B2B eCommerce platform, cutting a multi-week shopping process to 30 minutes; also built a ticket management web/mobile app that replaced Eventbrite for regional events.",
          'Led product design sprints to ideate, validate, and build new startup mobile apps from scratch with real users.',
          'Picked up team management alongside hands-on design work: career development and performance reviews for the design team.',
        ],
      },
    ],
  },
  {
    company: 'MagmaLabs',
    location: 'Colima, MX',
    description: 'UX/UI Director',
    roles: [
      {
        title: 'UX/UI Director',
        period: '2015 – 2018',
        bullets: [
          "Owned the company's brand, website, and identity across channels, and ran product design sprints to build mobile and web apps for fintech clients.",
          'Reworked eCommerce sites, validating UX changes through A/B testing.',
          "Grew the design team and set up its career paths, performance reviews, and KPIs.",
        ],
      },
    ],
  },
  {
    company: 'Crowd Interactive',
    location: 'Colima, MX',
    description: 'UI Designer → UI Lead',
    roles: [
      {
        title: 'UI Designer → UI Lead',
        period: '2009 – 2015',
        bullets: [
          'On FoxCommerce, handled branding, graphic structure, and design planning for the eCommerce platform that went on to raise a $3.5M USD round.',
          'Created concept and branding for MagmaConf (6 editions, international speakers, sponsors including StickerMule, Engine Yard, Heroku, GitHub, CloudApp, Cookpad, DensityLabs, Travis CI, and OneLogin), and designed responsive eCommerce sites (Shopify, Spree/Solidus, Magento) for startups.',
          'Promoted from UI Designer to UI Lead as the team scaled, taking on hiring and day-to-day direction of the design group.',
        ],
      },
    ],
  },
];

const education = [
  {
    degree: "Master's Degree in Web Design and Frontend for Multiple Devices",
    school: 'Escuela Superior de Diseño de Barcelona',
  },
  {
    degree: 'BA in Graphic Design',
    school: 'Facultad de Arquitectura y Diseño, Universidad de Colima',
  },
];

const tools = ['Figma', 'Webflow', 'Adobe CS', 'Affinity Designer', 'HTML', 'CSS', 'Replit', 'Claude Code', 'Gemini CLI', 'ChatGPT Codex'];

const skills = [
  'Design team leadership', 'Career pathing and performance reviews', 'AI-assisted product design',
  'Front-end prototyping with AI coding agents', 'PRD and user story writing', 'Product design sprint',
  'Design thinking', 'Agile', 'Lean UX', 'Prototyping', 'UX/UI design', 'Design systems', 'Branding',
  'Cross-functional collaboration',
];

export default function AboutView() {
  const { setNetworkState } = useNetworkState();
  useEffect(() => {
    setNetworkState('conversation');
    return () => setNetworkState('idle');
  }, []);

  return (
    <PageTransition>
      <div className="absolute inset-0 overflow-y-auto">
        <div className="max-w-[680px] mx-auto px-8 py-16 pb-24">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '2.4rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
              Jesus Haro
            </h1>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1rem', color: '#d25d5f' }}>
                Senior Product Designer
              </p>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
              {[
                { label: 'jharolozano@gmail.com', href: 'mailto:jharolozano@gmail.com', Icon: Mail },
                { label: 'haroknow.com', href: 'https://www.haroknow.com', Icon: Globe },
                { label: 'linkedin', href: 'https://www.linkedin.com/in/jharolozano/', Icon: Linkedin },
                { label: 'behance', href: 'https://www.behance.net/haroknow', Icon: Palette },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  <link.Icon size={14} strokeWidth={1.5} aria-hidden="true" />
                  {link.label}
                </a>
              ))}
              </div>
            </div>
          </motion.div>

          {DIVIDER}

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
            <p style={SECTION_LABEL}>Summary</p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
              Senior Product Designer with 15+ years shipping B2B products end-to-end: research, information architecture, prototyping, and engineering handoff. I've led and grown design teams, owned product decisions from concept through launch, and this past year used AI tooling to take features from concept to a working prototype in 2–4 days instead of weeks. I work directly with engineering to turn customer feedback and technical constraints into shipped interfaces, not just mockups.
            </p>
          </motion.div>

          {DIVIDER}

          {/* Experience */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }}>
            <p style={SECTION_LABEL}>Experience</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {experience.map((job) => (
                <div key={job.company}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1rem', fontWeight: 600, color: 'white' }}>
                      {job.company}
                    </span>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginLeft: '10px' }}>
                      {job.location}
                    </span>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                      {job.description}
                    </p>
                  </div>
                  {job.roles.map((role) => (
                    <div key={role.title} style={{ marginBottom: '16px', paddingLeft: '12px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#d25d5f' }}>
                          {role.title}
                        </span>
                        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                          {role.period}
                        </span>
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {role.bullets.map((b, i) => (
                          <li key={i} style={{ display: 'flex', gap: '10px', fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, marginTop: '2px' }}>—</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {DIVIDER}

          {/* Education */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <p style={SECTION_LABEL}>Education</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {education.map((ed) => (
                <div key={ed.degree}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>
                    {ed.degree}
                  </p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
                    {ed.school}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {DIVIDER}

          {/* Tools & Skills */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <p style={SECTION_LABEL}>Tools</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tools.map(t => (
                    <span key={t} style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.55)',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={SECTION_LABEL}>Skills</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {skills.map(s => (
                    <p key={s} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
