import { useEffect } from 'react';
import { motion } from 'motion/react';
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
          'Designed and implemented features from scratch using Replit and AI tooling, delivering working versions for stakeholder feedback in 2–4 days.',
          'Defined functional scope, PRDs, and user stories for 20+ modules spanning device administration, support ticketing, notifications, and fleet operations.',
          'Designed a relationship-based access model using a lean set of core profiles that combine dynamically to support complex permission configurations.',
          'Researched and designed an AI-first technical support concept exploring how AI could autonomously resolve user support queries.',
        ],
      },
      {
        title: 'Product Designer',
        period: 'Jun 2023 – Apr 2024',
        bullets: [
          "Defined the platform's first modules — monitoring, events, unit detail, trip history, and tagging — from concept through Figma-based design.",
        ],
      },
    ],
  },
  {
    company: 'Ekatena',
    location: 'Remote, Mexico',
    description: 'Financial risk analysis platform — Product Design Lead',
    roles: [
      {
        title: 'Product Design Lead',
        period: 'Apr 2024 – Sept 2025',
        bullets: [
          'Returned full-time as sole designer with product-owner-level responsibilities, overseeing complete design ownership of the platform.',
          'Hired and mentored the designer who took over the role; continued as design advisor after the engagement ended.',
          "Partnered with engineering to define and maintain the platform's design system, establishing reusable components and guidelines.",
          'Designed a report-relationship system and a dedicated UBO report for deeper shareholder and risk analysis.',
          'Redesigned report detail views to cut data load time and streamlined the roles and permissions system.',
          "Defined the architecture and design of the platform's mobile version.",
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
          "Provided web and mobile design for US-based clients, including sections for New Era's mobile app and a redesign of the Grasshopper mobile application.",
          'Designed eCommerce websites for US-based clients, covering web and mobile.',
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
          "Revamped the product's information architecture for larger organizations including Universal Media Group and the University of Oklahoma.",
          'Redesigned onboarding for non-technical users into a self-guided flow taking 10–20 minutes, down from a week-long process.',
          'Developed a customized cybersecurity playbook feature and a new notification system.',
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
          "Designed a B2B eCommerce platform for Levi's Mexico via design sprint, cutting a multi-week shopping process to 30 minutes.",
          'Led product design sprints to ideate, validate, and build new startup mobile apps from scratch with real users.',
          'Took on team management alongside individual design work, including career development and performance reviews.',
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
          "Designed the company's brand, website, and identity across channels.",
          'Ran product design sprints and redesigned eCommerce websites, improving UX through best practices and A/B testing.',
          'Led and grew the design team, defining career paths and managing performance reviews.',
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
          'Contributed to the FoxCommerce eCommerce platform — planning, branding, and design that helped support a $3.5M USD investment round.',
          'Created concept and branding for MagmaConf (6 editions, international speakers).',
          'Grew and led the design team as it scaled, progressing from UI Designer to UI Lead.',
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
  'Design team leadership', 'Career pathing & performance reviews', 'AI-assisted product design',
  'Front-end prototyping with AI coding agents', 'PRD & user story writing', 'Product design sprint',
  'Design thinking', 'Agile / Lean UX', 'Prototyping', 'UX/UI design', 'Design systems', 'Branding',
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
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>
              Senior Product Designer
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { label: 'jharolozano@gmail.com', href: 'mailto:jharolozano@gmail.com' },
                { label: '+52 312 124 8323', href: 'tel:+523121248323' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {DIVIDER}

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
            <p style={SECTION_LABEL}>Summary</p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
              Senior Product Designer with 15+ years of experience across the IT industry, specializing in end-to-end product design — from research and information architecture through prototyping to engineering handoff. Track record leading and growing design teams and owning product decisions, with recent work applying AI tooling to accelerate feature design and prototyping. I thrive on cross-functional collaboration, translating customer feedback and technical constraints into intuitive, scalable interfaces.
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
