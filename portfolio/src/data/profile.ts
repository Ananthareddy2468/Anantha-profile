type ContactDestinations = {
  email: string | null;
  linkedin: string | null;
  github: string | null;
};

const contact: ContactDestinations = {
  email: null,
  linkedin: null,
  github: null,
};

export const profile = {
  name: 'Anantha Reddy',
  title: 'AI/ML Engineer',
  eyebrow: '11+ YEARS IN SOFTWARE & DATA ENGINEERING',
  yearsExperience: '11+',
  headline: 'Building intelligent systems that turn data into practical decisions.',
  introduction:
    'I build machine learning applications, AI-powered knowledge systems, and the data platforms behind them. My experience spans Python engineering, distributed processing, cloud applications, and production-focused AI.',
  about:
    'My work spans the path from operational data to applications people can use. I started with Python services and integrations, moved into analytics and distributed processing, and expanded into machine learning and AI-enabled systems. I focus on data quality, clear service boundaries, observable pipelines, and maintainable delivery.',
  degrees: ['Master’s in Computer Science', 'Bachelor’s in Computer Science'],
  contact,
} as const;

export const principles = [
  {
    title: 'Validate at the edges',
    description: 'Make assumptions explicit before data reaches downstream consumers.',
  },
  {
    title: 'Make work reproducible',
    description: 'Keep transformations, features, and model inputs traceable across runs.',
  },
  {
    title: 'Design for failure',
    description: 'Use observable boundaries and clear operational signals to make issues diagnosable.',
  },
  {
    title: 'Protect access boundaries',
    description: 'Treat authorization, service inputs, and data access as part of the system design.',
  },
  {
    title: 'Evaluate AI outputs',
    description: 'Ground AI-enabled experiences in appropriate source data and inspect their results.',
  },
  {
    title: 'Document the handoff',
    description: 'Make deployment and operation understandable to the next engineer.',
  },
] as const;
