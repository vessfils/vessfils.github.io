// Personal and professional information. Every entry is taken from the owner's CV,
// internship report or repositories — keep it that way when editing.

export const site = {
  name: 'Jean-François Campagnolle',
  shortName: 'J.-F. Campagnolle',
  role: 'Software & Machine Learning Engineer',
  url: 'https://vessfils.github.io',
  email: 'jf.campagnolle@outlook.fr',
  github: 'https://github.com/vessfils',
  linkedin: 'https://www.linkedin.com/in/jean-francois-campagnolle',
  /** Path of the downloadable CV in /public. Set to null to hide every résumé button. */
  resume: '/Jean-Francois-Campagnolle-CV.pdf' as string | null,
  /** Shown in the contact section. Set to null to hide it. */
  location: 'Paris, France · Piedmont, Italy' as string | null,
  eyebrow: 'Software engineering · Machine learning · Computer vision',
  intro:
    'I build intelligent systems at the intersection of software engineering, computer vision and machine learning.',
  supporting:
    'Trained at École 42 Paris, most recently working on multi-camera truck re-identification at Veolia. Before that, a career in audit and financial reporting taught me to distrust a number until I know how it was produced.',
}

export const about = {
  title: 'Engineering with a habit of verification',
  paragraphs: [
    'I work on applied machine learning, with a focus on computer vision, and on the software that has to surround a model before it is useful to anyone. I like problems where the data is messy, the constraints are real and the result has to be explained to people who will act on it.',
    'My engineering education comes from École 42 Paris: a project-based, peer-reviewed curriculum with no lectures, where every project is built from a specification and defended in front of other engineers. It took me from C and Unix internals to a kernel booted in an emulator, neural networks written with NumPy, container orchestration and full-stack web applications.',
    'Before engineering I worked in finance — corporate FP&A in Los Angeles, external audit at KPMG, then IFRS consolidation at Veolia, coordinating reporting from more than 200 subsidiaries. That work is why I care about evaluation protocols, traceable results and clear documentation. It is also why I read a metric by asking what it actually measures.',
    'In 2026 I joined Veolia’s Scientific and Technological Expertise department as a computer vision intern on Picture IA, an industrial re-identification project. It is the work I am proudest of so far, and the kind of work I want to keep doing.',
  ],
  focus: [
    { label: 'Currently', value: 'Looking for ML, computer vision or software engineering roles' },
    { label: 'Languages', value: 'French (native) · English (C2) · Italian (B2)' },
  ],
}

export interface ExperienceItem {
  org: string
  role: string
  period: string
  place: string
  kind: 'engineering' | 'education' | 'finance' | 'venture'
  summary: string
  points?: string[]
  award?: string
}

export const experience: ExperienceItem[] = [
  {
    org: 'Veolia — Scientific & Technological Expertise (DEST)',
    role: 'Computer Vision / Machine Learning Intern',
    period: 'Mar 2026 – Sep 2026',
    place: 'Paris',
    kind: 'engineering',
    summary:
      'Picture IA: re-identifying trucks across the cameras of waste-reception sites so operators can find the unloading image of a delivery.',
    points: [
      'Benchmarked CLIP, DINOv2, DINOv3 and a fine-tuned ViT as embedding extractors for truck re-identification.',
      'Fine-tuned DINOv3 with triplet loss and semi-hard negative mining; ran single-variable ablations on freezing, margin, learning rate and augmentation.',
      'Built a classical change-detection prototype (ECC alignment, LAB difference maps, morphology) to outline the unloaded pile.',
    ],
    award: 'Veolia Poster Trophy 2026 — 3rd Jury Prize',
  },
  {
    org: 'École 42 Paris',
    role: 'Computer science — project-based curriculum',
    period: '2021 – present',
    place: 'Paris',
    kind: 'education',
    summary:
      'Core curriculum completed (level 17), then specialisation in artificial intelligence and algorithms. Working towards the “Expert in IT Architecture” certification (RNCP level 7).',
  },
  {
    org: 'GAIDED',
    role: 'Co-founder',
    period: 'Jul 2023 – Sep 2024',
    place: 'Station F, Paris',
    kind: 'venture',
    summary:
      'An AI-powered mobile tour guide. As you walk, the app uses your geolocation and preferences to generate a personalised story about the places around you — written by an LLM from Wikipedia sources and read aloud with text-to-speech.',
    points: [
      'Co-designed the narrative engine: nearby points of interest from the Wikipedia API, then a GPT-based model writes a story tailored to the user’s preferences.',
      'Deployed the full cloud architecture on Google Cloud: virtual machines, API Gateway, databases and monitoring.',
      'Optimised caching and geolocation lookups, cutting response latency by 1.5 seconds; the beta was tested by more than 10,000 users.',
    ],
  },
  {
    org: 'Veolia',
    role: 'Group Consolidation Analyst',
    period: '2021 – 2026',
    place: 'Paris',
    kind: 'finance',
    summary:
      'IFRS consolidated reporting for China and Hong Kong (over €1.5bn revenue), coordinating submissions from more than 200 subsidiaries.',
  },
  {
    org: 'KPMG France',
    role: 'Senior Auditor',
    period: '2016 – 2021',
    place: 'Paris',
    kind: 'finance',
    summary: 'Statutory audits of large corporate clients: risk assessment, engagement planning and execution.',
  },
  {
    org: 'Custom Sensors & Technologies',
    role: 'Corporate FP&A Analyst',
    period: 'Jan 2015 – Aug 2016',
    place: 'Los Angeles',
    kind: 'finance',
    summary: 'Financial planning and analysis for an industrial sensors group.',
  },
]

export const education = [
  'ESSEC Business School — Advanced Master’s in Audit Management (2018–2021)',
  'DSCG — Advanced Diploma in Accounting and Management (2017)',
  'Toulouse Business School — Master’s in Audit, Management Control & Risk (2011–2015)',
]

export const skills: { group: string; note: string; items: string[] }[] = [
  {
    group: 'Machine learning & vision',
    note: 'Used in Picture IA, Leaffliction, Learn2Slither, MLP, DSLR',
    items: [
      'Python',
      'PyTorch',
      'NumPy · pandas',
      'scikit-learn',
      'OpenCV · PlantCV',
      'CNNs',
      'Vision Transformers (DINOv2/v3, CLIP)',
      'Deep metric learning · triplet loss',
      'Deep Q-learning',
      'Optuna',
    ],
  },
  {
    group: 'Software engineering',
    note: 'Used in KFS, Matcha, GAIDED and the 42 core curriculum',
    items: ['C', 'C++', 'x86 assembly (NASM)', 'TypeScript', 'JavaScript', 'React', 'Node.js · Express', 'SQL · PostgreSQL', 'REST APIs'],
  },
  {
    group: 'Systems & infrastructure',
    note: 'Used in KFS, Cloud-1, Inception, GAIDED',
    items: ['Linux', 'Docker · Compose', 'Ansible', 'AWS EC2', 'Google Cloud', 'Nginx', 'QEMU · GRUB', 'Git'],
  },
  {
    group: 'Fundamentals',
    note: 'What the projects are actually about',
    items: [
      'Algorithms & data structures',
      'Gradient-based optimisation',
      'Model evaluation & ablation',
      'Systems programming',
      'Interrupts & memory segmentation',
      'Software architecture',
    ],
  },
]
