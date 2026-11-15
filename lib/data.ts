// Central source of truth for the site's copy, links, and content.

export interface NavLink {
  href: string
  label: string
}

export const navLinks: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Projects' },
  { href: '/misc', label: 'Touching Grass' },
]

export interface SocialLink {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'x'
}

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/nicholaskim17', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nicholaskim17', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/nkimmer_17', icon: 'x' },
]

export const site = {
  name: 'Nick',
  description:
    'Engineering student at the University of Waterloo exploring AI systems, software engineering, and useful products.',
  email: 'nicholaskimto@gmail.com',
}

export const hero = {
  name: 'Nick Kim',
  portraitSrc: '/images/portrait-retro-headphones.webp',
  portraitAlt: 'Nick wearing retro orange headphones',
}

export type HighlightTone = 'gold' | 'orange' | 'teal' | 'pink' | 'blue' | 'violet' | 'green'

export interface GalleryPhoto {
  src: string
  alt: string
  width: number
  height: number
}

export const about = {
  waterloo: {
    name: 'University of Waterloo',
    href: 'https://uwaterloo.ca/engineering/',
    logo: '/images/work/waterloo-seal.svg',
    highlight: 'gold' as const,
  },
  gallery: [
    { src: '/images/gallery/recent-01.jpeg', alt: 'Five friends standing together at an event', width: 1024, height: 768 },
    { src: '/images/gallery/recent-02.jpeg', alt: 'Friends in costumes outside a restaurant at night', width: 1536, height: 2048 },
    { src: '/images/gallery/recent-03.jpeg', alt: 'Friends dressed for a costume party', width: 1024, height: 768 },
    { src: '/images/gallery/recent-04.jpeg', alt: 'Three students posing in a classroom', width: 1024, height: 768 },
    { src: '/images/gallery/recent-05.jpeg', alt: 'Robotics project in progress around a dining table', width: 1536, height: 2048 },
    { src: '/images/gallery/recent-06.jpeg', alt: 'Three friends posing at a concert', width: 768, height: 1024 },
    { src: '/images/gallery/recent-07.jpeg', alt: 'A speaker addressing students in a workshop', width: 1182, height: 665 },
    { src: '/images/gallery/recent-08.jpeg', alt: 'A hackathon group posing onstage', width: 1086, height: 724 },
    { src: '/images/gallery/recent-09.jpeg', alt: 'Two students holding a first-place prize check', width: 768, height: 1024 },
    { src: '/images/gallery/recent-10.jpeg', alt: 'Friends together at a campus orientation event', width: 1024, height: 768 },
    { src: '/images/gallery/recent-11.jpeg', alt: 'Friends playing cards around a table', width: 768, height: 1024 },
    { src: '/images/gallery/recent-12.jpeg', alt: 'Three people together on a golf course', width: 1024, height: 768 },
    { src: '/images/gallery/recent-13.jpeg', alt: 'Students posing beside a robot at a Google event', width: 1024, height: 768 },
    { src: '/images/gallery/golf.jpeg', alt: 'Lining up a putt on the green with a friend', width: 360, height: 480 },
    { src: '/images/gallery/hockey.jpeg', alt: 'Carrying the puck during a hockey game', width: 540, height: 360 },
    { src: '/images/gallery/hackathon.jpeg', alt: 'Posing with laptops at a hackathon judging round', width: 1086, height: 724 },
    { src: '/images/gallery/waterloo.jpeg', alt: 'With friends in University of Waterloo gear', width: 480, height: 360 },
    { src: '/images/gallery/soccer.jpeg', alt: 'At a soccer match with family', width: 480, height: 360 },
    { src: '/images/gallery/nomad-pitch.jpeg', alt: 'Presenting the Nomad project at a hackathon whiteboard', width: 1024, height: 768 },
  ],
}

// Content and links for the Hobbies cards. Live training data is fetched
// server-side in lib/hevy.ts; the remaining fields configure external links
// and the guitar card.
export const hobbies = {
  training: {
    heading: 'Gym',
    hevyProfileHref: 'https://hevy.com/user/kimmer17',
    profileLinkLabel: 'Open my Hevy training profile in a new tab',
  },
  guitar: {
    heading: 'Guitar',
    image: '/images/guitar.jpg',
    imageAlt: 'Nick playing guitar and singing at home',
    sentence: "Just for fun, I post covers sometimes lol.",
    tiktokHandle: '@kimmer_music17',
    tiktokHref: 'https://www.tiktok.com/@kimmer_music17',
    cta: 'Watch my covers',
  },
}

export interface WorkEntry {
  organization: string
  organizationHref?: string
  logo: string
  current?: boolean
  highlight: HighlightTone
  title: string
  dates?: string
  description?: string
  tags?: string[]
}

export const work: WorkEntry[] = [
  {
    organization: 'Hamming AI (YC S24)',
    current: true,
    organizationHref: 'https://hamming.ai/',
    logo: '/images/work/hamming.png',
    highlight: 'orange',
    title: 'Software Engineer',
  },
  {
    organization: 'WAT.ai',
    current: true,
    organizationHref: 'https://watai.ca/',
    logo: '/images/work/watai.png',
    highlight: 'teal',
    title: 'Machine Learning Engineer',
    description:
      'Adaptive-Compute Inference for Real-Time Text to Speech',
    tags: ['Python', 'PyTorch', 'dots.tts', ],
  },
  {
    organization: 'Appli AI',
    organizationHref: 'https://applisolutions.com',
    logo: '/images/work/appli-ai.png',
    highlight: 'blue',
    title: 'Software Engineering Intern',
    dates: 'June 2026 — Sept 2026',
    description:
      'Building AI-powered matching and backend systems that deliver secure, near-real-time recommendations.',
    tags: ['Python', 'TypeScript', 'Neo4j', 'Recommendation Systems', 'Vector Embeddings', 'Backend Development'],
  },
  {
    organization: 'Algoverse',
    organizationHref: 'https://algoverseairesearch.org',
    logo: '/images/work/algoverse.jpeg',
    highlight: 'violet',
    title: 'Machine Learning Research Intern',
    dates: 'June 2026 — Sept 2026',
    description:
      'Researching AI safety and evaluation by testing different inference-time harnesses for open-weight LLMs in CBRNE domains.',
    tags: ['Python', 'LLMs', 'AI Safety', 'RAG', 'Machine Learning', 'Research'],
  },
  {
    organization: 'One2One Tutoring',
    organizationHref: 'https://one2onetutoring.vercel.app/',
    logo: '/images/work/one2one.png',
    highlight: 'green',
    title: 'Founder & Lead Tutor',
    dates: 'Sept 2024 — June 2026',
    description:
      'Founded a referral-driven tutoring business that helped 18 students strengthen their mathematics skills.',
    tags: ['Entrepreneurship', 'Teaching', 'Communication', 'Leadership', 'Mathematics'],
  },
]

export interface Project {
  title: string
  year?: number
  description: string
  result?: string
  image?: string
  imageAlt?: string
  video?: string
  poster?: string
  imageHref?: string
  tags: string[]
  demoHref?: string
  demoLabel?: string
  sourceHref?: string
  sourceLabel?: string
  devpostHref?: string
}

export const projects: Project[] = [
  {
    title: 'AutoChem',
    year: 2026,
    description:
      'A low-cost tabletop wet lab where two SO-101 arms and a load-cell scale precisely weigh, dose, and mix chemicals, with a MuJoCo digital twin verifying every move in simulation.',
    video: '/images/autochem.mp4',
    poster: '/images/autochem-preview.jpg',
    tags: ['MuJoCo', 'Robotics', 'SO-101', 'Arduino'],
    demoHref: 'https://www.youtube.com/watch?v=eKyWVe5dlMw',
    demoLabel: 'Watch demo',
    sourceHref: 'https://github.com/nicholaskim17/autochem',
    sourceLabel: 'Repo',
    devpostHref: 'https://devpost.com/software/autochem',
  },
  {
    title: 'PolyBot',
    year: 2026,
    description:
      'A master agent sabotages a web task as four browser agents compete to finish it, while spectators watch, place virtual YES or NO bets, and generate training data from their recoveries and failures.',
    result: '1st Place, Waterloo vs UofT Hackathon.',
    video: '/images/polybot.mp4',
    poster: '/images/polybot.png',
    tags: ['AI Agents', 'Playwright', 'Prediction Markets', 'TypeScript'],
    demoHref: 'https://www.youtube.com/watch?v=5QKOoKNvMmI',
    demoLabel: 'Watch demo',
    sourceHref: 'https://github.com/tkachyn/polybot',
    sourceLabel: 'Repo',
    devpostHref: 'https://devpost.com/software/polybot-q1be60',
  },
  {
    title: 'Janus',
    year: 2026,
    description:
      'An AI-powered sensor arbitration system that detects conflicting spacecraft telemetry and selects the safest data source in real time.',
    result: 'Third Overall, Google DeepMind Hackathon.',
    video: '/images/sensorarbitor.mp4',
    poster: '/images/janus.png',
    imageHref:
      'https://www.linkedin.com/posts/waterloo-dev_waterloodev-hackathon-spacetech-activity-7490785925065777152-JRbC?utm_source=share&utm_medium=member_ios&rcm=ACoAAF1Q234B3sUEOFlSCz-3_OZYdZjECt_oVv0',
    tags: ['Gemma', 'AI', 'Sensor Fusion'],
    sourceHref: 'https://github.com/nicholaskim17/sensor-arbitor',
    sourceLabel: 'Repo',
  },
  {
    title: 'Rally',
    year: 2026,
    description:
      'A two-player table tennis game uses webcam pose tracking to turn each player’s hand into a virtual racket and synchronize the ball, score, and match state across laptops.',
    result: '1st Place, General Catalyst Hackathon.',
    video: '/images/rally.mp4',
    poster: '/images/rally-preview.jpg',
    tags: ['React', 'Three.js', 'MediaPipe', 'Socket.IO'],
    demoHref: 'https://rally-sharon-browser.azurewebsites.net/',
    demoLabel: 'Play demo',
    sourceHref: 'https://github.com/nicholaskim17/rally',
    sourceLabel: 'Repo',
  },
  {
    title: 'Atlas',
    year: 2026,
    description:
      'A spatial memory platform that turns ordinary walkthrough videos into photorealistic 3D places you can revisit, organize, and share.',
    video: '/images/atlas.mp4',
    poster: '/images/atlas.png',
    imageHref: 'https://devpost.com/software/a-p87n0x',
    tags: ['Next.js', 'Gaussian Splatting', 'Firebase'],
    sourceHref: 'https://github.com/nicholaskim17/atlas',
    sourceLabel: 'Repo',
    devpostHref: 'https://devpost.com/software/a-p87n0x',
  },
  {
    title: 'nomad',
    year: 2026,
    description:
      'A Solana-based identity layer that gives AI agents verifiable, revocable permissions.',
    result: 'Ran JamHacks, one of Canada’s largest high school hackathons.',
    video: '/images/nomad-demo.mp4',
    poster: '/images/nomad.png',
    tags: ['Solana', 'Rust / Anchor', 'TypeScript'],
    demoHref: 'https://x.com/nkimmer_17/status/2066940490096787797',
    demoLabel: 'Live demo',
    sourceHref: 'https://github.com/nicholaskim17/nomad',
    sourceLabel: 'Repo',
    devpostHref: 'https://devpost.com/software/nomad-nrgx3l',
  },
  {
    title: 'MarryMap',
    year: 2026,
    description:
      "A shared wedding-planning workspace: couples Tinder-swipe through vendor options together and a built-in CRM tracks every quote from lead to booked.",
    result: 'First Place, Cursor Hackathon.',
    image: '/images/marrymap.png',
    imageAlt: 'Marrymap wedding vendor CRM dashboard',
    imageHref: 'https://x.com/nkimmer_17/status/2080777414423056517',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    sourceHref: 'https://github.com/aarontran321/marrymap',
    sourceLabel: 'Repo',
  },
  {
    title: 'Buzzy',
    year: 2026,
    description:
      'A social market where users discover trends and trade virtual shares using in-app tokens.',
    image: '/images/buzzy.png',
    imageAlt: 'Buzzy virtual marketplace trading dashboard',
    tags: ['Next.js', 'TypeScript', 'Firebase'],
    demoHref: 'https://buzzly-zeta.vercel.app',
    demoLabel: 'Visit site',
    sourceHref: 'https://github.com/nicholaskim17/buzzy',
    sourceLabel: 'Repo',
    devpostHref: 'https://devpost.com/software/buzzy-xd1w2u',
  },
]

export interface ResearchEntry {
  title: string
  dateTime: string
  dateLabel: string
  authors: string
  authorNote: string
  venue: string
  description: string
  href: string
  highlight?: {
    label: string
    venue: { name: string; href: string; logo: string; highlight: HighlightTone }
  }
}

export const research: ResearchEntry[] = [
  {
    title: 'Evaluating Context-Window Harnesses for CBRNE Safety',
    dateTime: '2026-08',
    dateLabel: 'Aug 2026',
    authors: 'Nathan Nguyen, Nicholas Kim, Abhitha Vegi, Arko Samad, Suvajit Majumder',
    authorNote: 'Second author',
    venue: 'NewInML and Trustworthy AI for Good (AI4GOOD) workshops · Paris, France',
    description:
      'Compares 15 inference-time safety harnesses across nine open-weight language models for CBRNE risks, finding that clear boundary clauses improve safety discrimination.',
    href: 'https://openreview.net/forum?id=H6U4KapPog',
    highlight: {
      label: 'Accepted at two workshops at',
      venue: {
        name: 'NeurIPS 2026',
        href: 'https://neurips.cc/',
        logo: '/images/work/neurips.png',
        highlight: 'pink',
      },
    },
  },
]

export const contact = {
  invitation:
    "Feel free to reach out if you'd like to discuss opportunities, have a quick coffee chat, or just say hi! I'm always looking forward to meeting new people.",
  submitLabel: 'Submit',
}

export const footer = {
  attribution: `Designed and built by Nicholas Kim`,
}
