import { PortfolioData } from '../interfaces/portfolio.interfaces';

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Shubham Prajapati',
    title: 'Software Developer',
    intro:
      'Software Developer with 7 years of experience building scalable SaaS applications and enterprise systems using React, Angular, Next.js, PHP, Laravel, and Node.js.',
    summary:
      'Expert in Microservices Architecture, high-throughput RESTful API development, third-party API integrations (LiveKit, ElevenLabs, OpenAI, Stripe, Twilio, Google Maps, Zoho/Dropbox Sign), and payment gateway systems. Passionate about clean code, scalable database design, and modern UI/UX execution.',
    email: 'prajapatishubham644@gmail.com',
    location: 'Lucknow, India',
    availability: 'Open to Senior Software Developer, AI SaaS & Microservices Opportunities',
    resumeUrl: 'assets/data/shubham_resume_2026.pdf',
    imageUrl: 'assets/images/profile.png'
  },
  metrics: [
    { label: 'Years Experience', value: '7' },
    { label: 'Enterprise & SaaS Apps', value: '15+' },
    { label: 'Microservices & APIs', value: '35+' },
    { label: 'Production Uptime', value: '99.9%' }
  ],
  skills: [
    {
      name: 'Frontend',
      icon: 'web',
      skills: [
        { name: 'React.js', icon: 'code', level: 98 },
        { name: 'Angular', icon: 'change_history', level: 96 },
        { name: 'Next.js', icon: 'view_in_ar', level: 96 },
        { name: 'TypeScript & JS', icon: 'data_object', level: 96 }
      ]
    },
    {
      name: 'Backend',
      icon: 'dns',
      skills: [
        { name: 'PHP & Laravel', icon: 'developer_mode', level: 98 },
        { name: 'Node.js & Express', icon: 'api', level: 94 },
        { name: 'RESTful APIs', icon: 'lan', level: 98 },
        { name: 'Microservices', icon: 'account_tree', level: 96 }
      ]
    },
    {
      name: 'Database',
      icon: 'database',
      skills: [
        { name: 'MySQL', icon: 'table_chart', level: 96 },
        { name: 'PostgreSQL', icon: 'storage', level: 94 },
        { name: 'MongoDB', icon: 'deployed_code', level: 88 }
      ]
    },
    {
      name: 'AI & Voice Integrations',
      icon: 'smart_toy',
      skills: [
        { name: 'OpenAI API', icon: 'psychology', level: 95 },
        { name: 'LiveKit Voice AI', icon: 'graphic_eq', level: 94 },
        { name: 'ElevenLabs API', icon: 'record_voice_over', level: 92 },
        { name: 'Vobiz Telephony', icon: 'ring_volume', level: 90 }
      ]
    },
    {
      name: 'API Integrations & Payments',
      icon: 'hub',
      skills: [
        { name: 'Stripe Payment API', icon: 'credit_card', level: 96 },
        { name: 'Twilio IVR API', icon: 'ring_volume', level: 94 },
        { name: 'Google Maps API', icon: 'map', level: 92 },
        { name: 'Zoho & Dropbox Sign', icon: 'draw', level: 92 }
      ]
    },
    {
      name: 'DevOps & Tools',
      icon: 'settings_suggest',
      skills: [
        { name: 'Git & GitHub', icon: 'commit', level: 96 },
        { name: 'Auth0 Security', icon: 'security', level: 92 },
        { name: 'System Optimization', icon: 'speed', level: 95 }
      ]
    },
    {
      name: 'Languages',
      icon: 'terminal',
      skills: [
        { name: 'PHP', icon: 'code', level: 98 },
        { name: 'JavaScript (ES6+)', icon: 'javascript', level: 96 },
        { name: 'TypeScript', icon: 'data_object', level: 95 },
        { name: 'Python', icon: 'terminal', level: 90 },
        { name: 'SQL', icon: 'table_chart', level: 94 }
      ]
    },
    {
      name: 'Frameworks',
      icon: 'view_quilt',
      skills: [
        { name: 'Angular', icon: 'change_history', level: 96 },
        { name: 'Laravel', icon: 'developer_mode', level: 98 },
        { name: 'Next.js', icon: 'view_in_ar', level: 96 },
        { name: 'Tailwind CSS & SCSS', icon: 'palette', level: 94 }
      ]
    },
    {
      name: 'Specializations',
      icon: 'psychology',
      skills: [
        { name: 'Microservices Architecture', icon: 'schema', level: 96 },
        { name: 'Conversational Voice AI', icon: 'record_voice_over', level: 94 },
        { name: 'Legacy System Migration', icon: 'sync_alt', level: 95 }
      ]
    },
    {
      name: 'Soft Skills',
      icon: 'groups',
      skills: [
        { name: 'Technical Problem Solving', icon: 'emoji_objects', level: 98 },
        { name: 'Team Collaboration & Leadership', icon: 'school', level: 95 },
        { name: 'Product Engineering', icon: 'tips_and_updates', level: 94 }
      ]
    }
  ],
  experiences: [
    {
      company: 'DEVtrust (Dev Tech Enterprises Pvt. Ltd)',
      position: 'Software Developer',
      duration: 'June 2021 – August 2026',
      location: 'Lucknow, India',
      responsibilities: [
        'RevBridge AI: Developed enterprise conversational AI SaaS platform for automated voice agents, call workflows, CRM integration, and payment processing using Next.js, Nest.js, Python, and PostgreSQL.',
        'Dealer AI Solutions: Developed an enterprise conversational AI platform for automotive dealerships, featuring AI-powered outbound calling, payment negotiation, automated collections, IDMS integration, call transcription, payment processing, and seamless human-agent escalation.',
        'ShiftHarmony AI: Developed a multi-tenant SaaS hospital scheduling platform using OpenAI, CP-SAT optimization, automated scheduling, and integrated payment systems to streamline physician shift management.',
        'Draydex: Built logistics Transportation platform using Next.js and Laravel with Google Maps API and payment gateway integration.',
        'IVR Microservice: Developed microservices-based IVR system using Angular, Node.js, PostgreSQL, and Twilio API.',
        'Rankup: Lead LLM SaaS Admin Portal with Stripe integration and transaction tracking system.',
        'Air-Sign: Integrated Zoho Sign API and Dropbox Sign API for automated document workflows.',
        'Ozparty: Delivered event management platform integrating Rezdy and Moonstride APIs.',
        'Brainymate: Implemented LaTeX/KaTeX rendering and whiteboard API integration using Next.js and Python API.',
        'Offerland: Integrated OpenAI API with Auth0 authentication system using Next.js and Python API.',
        'MLC: Migrated legacy system ensuring seamless compatibility and performance optimization.',
        'Vimpede: Developed YouTube Data API integration for promo-ad blocking system.'
      ],
      technologies: [
        'Laravel',
        'Next.js',
        'Angular',
        'React.js',
        'Node.js',
        'Python',
        'LiveKit',
        'ElevenLabs',
        'OpenAI API',
        'Twilio API',
        'Stripe API',
        'PostgreSQL',
        'MySQL',
        'Google Maps API'
      ]
    },
    {
      company: 'Tarkash Technology Private Limited',
      position: 'Software Developer',
      duration: 'April 2019 – June 2021',
      location: 'Lucknow, India',
      responsibilities: [
        'Election Management System (EMC): Developed microservices-based data filtering and management system.',
        'SVCHE.IN: Built web application handling database schema and workflow optimization.',
        'Engineered high-performance RESTful API endpoints with optimized database indexing and transactional integrity.'
      ],
      technologies: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'REST APIs', 'Microservices', 'Database Schema Design']
    }
  ],
  education: [
    {
      school: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
      degree: 'B.Tech – Computer Science & Engineering',
      duration: '2014 – 2018',
      summary:
        'Graduated with 75.8% First Class with Distinction. Strong foundation in Software Engineering, Data Structures, Relational Database Management Systems, and Microservices Architecture.'
    }
  ],
  projects: [
    {
      id: 'revbridge-ai',
      title: 'RevBridge AI',
      description:
        'Enterprise SaaS conversational AI platform automating voice conversations with intelligent AI agents for outbound/inbound calling, appointment scheduling, payment processing, real-time intent detection, and seamless CRM integrations.',
      imageUrl: 'assets/images/projects/revbridge.png',
      technologies: ['Next.js', 'Nest.js', 'Python', 'PostgreSQL'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://revbridgeai.in/',
      detailsUrl: '/projects/revbridge-ai'
    },
    {
      id: 'dealer-ai-solutions',
      title: 'Dealer AI Solutions',
      description:
        'Enterprise SaaS conversational AI platform for automotive dealerships and automated voice agents, featuring AI-powered outbound calling, payment negotiation, automated collections, IDMS integration, and call transcription.',
      imageUrl: 'assets/images/projects/dealer-ai-solutions.jpg',
      technologies: ['Laravel', 'Node.js', 'MySQL', 'LiveKit', 'ElevenLabs', 'Vobiz'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://dealeraisolutions.com',
      detailsUrl: '/projects/dealer-ai-solutions'
    },
    {
      id: 'shiftharmony-ai',
      title: 'ShiftHarmony AI',
      description:
        'Multi-tenant SaaS hospital scheduling platform with automated scheduling, shift management, natural language provider preferences, CP-SAT optimization, and integrated payment systems.',
      imageUrl: 'assets/images/projects/shiftharmony.png',
      technologies: ['Next.js', 'Python', 'PostgreSQL', 'OpenAI API', 'CP-SAT Optimization'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://shiftharmony.ai',
      detailsUrl: '/projects/shiftharmony-ai'
    },
    {
      id: 'draydex',
      title: 'Draydex Logistics Platform',
      description:
        'Logistics and freight transportation platform connecting shippers and carriers with spot market index, analytics dashboard, Google Maps tracking, and secure payment processing.',
      imageUrl: 'assets/images/projects/draydex.jpg',
      technologies: ['Next.js', 'Laravel', 'PostgreSQL', 'Google Maps API', 'Payment Gateways'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://draydex.com',
      detailsUrl: '/projects/draydex'
    },
    {
      id: 'ivr-microservice',
      title: 'IVR Telephony Automation Microservice',
      description:
        'AI-powered microservices-based Interactive Voice Response (IVR) communications platform built for automated caregiver workflows, telephony routing, and real-time call tracking.',
      imageUrl: 'assets/images/projects/ivr-microservice.jpg',
      technologies: ['Angular', 'Node.js', 'PostgreSQL', 'Twilio API', 'Microservices'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://ivr.pavillio.com',
      detailsUrl: '/projects/ivr-microservice'
    },
    {
      id: 'air-sign',
      title: 'Air-Sign Digital Contract Engine',
      description:
        'Automated contract signing workflow and document execution system using Zoho Sign and Dropbox Sign APIs for legally compliant audit trails.',
      imageUrl: 'assets/images/projects/air-sign.jpg',
      technologies: ['Laravel', 'MySQL', 'PHP', 'Zoho Sign API', 'Dropbox Sign API'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://manageairconcierge.net',
      detailsUrl: '/projects/air-sign'
    },
    {
      id: 'ozparty',
      title: 'Ozparty Events Platform',
      description:
        'Event management and booking platform with third-party travel experience API integrations with Rezdy and Moonstride for real-time tour and cruise bookings.',
      imageUrl: 'assets/images/projects/ozparty.jpg',
      technologies: ['React.js', 'Node.js', 'MySQL', 'Rezdy API', 'Moonstride API'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://ozpartyevents.com',
      detailsUrl: '/projects/ozparty'
    },
    {
      id: 'rankup',
      title: 'Rankup LLM SaaS Admin Portal',
      description:
        'AI SaaS administration portal powering generative LLM features with enterprise multi-tier Stripe subscription management and live transaction telemetry.',
      imageUrl: 'assets/images/projects/default-project.svg',
      technologies: ['Next.js', 'Node.js', 'Stripe API', 'OpenAI API', 'PostgreSQL'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://dealeraisolutions.com',
      detailsUrl: '/projects/rankup'
    },
    {
      id: 'brainymate',
      title: 'Brainymate',
      description:
        'Collaborative educational platform featuring real-time mathematical LaTeX/KaTeX formula rendering, dynamic whiteboard API integration, and interactive lesson canvases.',
      imageUrl: 'assets/images/projects/default-project.svg',
      technologies: ['Next.js', 'Python API', 'KaTeX', 'Whiteboard APIs', 'WebSockets'],
      githubUrl: 'https://github.com/shubhamprajapati96/Portfolio',
      liveUrl: 'https://shiftharmony.ai',
      detailsUrl: '/projects/brainymate'
    }
  ],
  certifications: [
    {
      title: 'Summer Training – PHP Technology',
      issuer: 'Cetpa Infotech Private Limited, Noida',
      date: 'Professional Certification',
      credentialUrl: 'https://www.cetpainfotech.com/'
    },
    {
      title: 'Internship – PHP Developer',
      issuer: 'Growth Hackers Technology Private Limited, Delhi',
      date: 'Professional Internship',
      credentialUrl: 'https://github.com/shubhamprajapati96'
    },
    {
      title: 'Enterprise Microservices & RESTful API Architecture',
      issuer: 'DEVtrust Engineering',
      date: 'Specialist Credential',
      credentialUrl: 'https://github.com/shubhamprajapati96'
    },
    {
      title: 'Software Engineering (React, Angular, Next.js & Laravel)',
      issuer: 'Professional Portfolio Credential',
      date: '7 Years Production Verified',
      credentialUrl: 'https://www.linkedin.com/in/shubham-prajapati-3a51a9160'
    }
  ],
  achievements: [
    {
      title: 'Architected Conversational Voice AI Platform (Dealer AI)',
      date: '2024 – 2026',
      description:
        'Pioneered conversational AI voice agents for automotive dealerships with LiveKit, ElevenLabs, automated calling, and payment processing.'
    },
    {
      title: 'Delivered 15+ Scalable SaaS & Enterprise Systems',
      date: '2021 – Present',
      description:
        'Architected and shipped production web applications across logistics, healthcare telecommunications, AI SaaS, and event booking.'
    },
    {
      title: 'Automated Telephony Microservices with Twilio & Node.js',
      date: '2023',
      description:
        'Built high-throughput IVR communication pipelines handling automated caregiver call routing and status telemetry.'
    },
    {
      title: 'Enterprise Legacy Migration & Optimization (MLC)',
      date: '2022',
      description:
        'Successfully migrated critical legacy systems to modern architecture with zero downtime and substantial performance gains.'
    }
  ],
  services: [
    {
      title: 'SaaS & AI Systems Development',
      icon: 'smart_toy',
      description:
        'Building scalable web and conversational AI applications using Next.js, React, Angular, Laravel, and Node.js with high maintainability.'
    },
    {
      title: 'Microservices & API Architecture',
      icon: 'account_tree',
      description:
        'Designing resilient microservices, high-throughput RESTful APIs, and webhook processors with optimal database indexing and caching.'
    },
    {
      title: 'Voice AI & Telephony Integrations',
      icon: 'record_voice_over',
      description:
        'Implementing cutting-edge conversational voice systems with LiveKit, ElevenLabs, Twilio IVR, and automated telephony routing.'
    },
    {
      title: 'Payment & Third-Party API Integrations',
      icon: 'credit_card',
      description:
        'Seamlessly integrating Stripe payments, Google Maps Platform, OpenAI API, and Zoho/Dropbox Sign contract workflows.'
    },
    {
      title: 'System Migration & Performance Tuning',
      icon: 'speed',
      description:
        'Modernizing legacy codebases, optimizing database schemas, and streamlining server-side processing for peak reliability.'
    }
  ],
  testimonials: [
    {
      name: 'Engineering Director',
      role: 'DEV Tech Enterprises (DEVtrust)',
      quote:
        'Shubham is a versatile software engineer who consistently delivers complex integrations—from conversational voice AI and Stripe billing to Twilio IVR and logistics mapping—with incredible speed and technical precision.',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Product Lead',
      role: 'Draydex Logistics Platform',
      quote:
        'His work on Draydex connecting shippers and carriers with real-time mapping and payment gateways made our platform launch seamless and highly reliable.',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Technical Architect',
      role: 'Tarkash Technology',
      quote:
        'Shubham has a deep understanding of database schema design and microservices. His contribution to our election management and data processing systems was stellar.',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  ]
};


