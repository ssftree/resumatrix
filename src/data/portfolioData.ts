import { ContactInfo, Experience, Project, SkillCategory, VirtualFile } from '../types';

export const USER_NAME = 'ssfu';
export const HOST_NAME = 'devbox';

export const CONTACT_DATA: ContactInfo = {
  email: 'ssfu.dev@gmail.com',
  github: 'https://github.com/ssfu-dev',
  linkedin: 'https://linkedin.com/in/ssfu-dev',
  twitter: 'https://x.com/ssfu_dev',
  blog: 'https://ssfu.dev/blog',
  location: 'Hangzhou / Remote',
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'hypershell',
    title: 'HyperShell',
    tagline: 'A fast, GPU-accelerated terminal emulator built with Rust & WebGPU',
    description: 'Modern CLI emulator featuring instant startup (<15ms), true-color rendering, multiplexing splits, and custom shader pipelines.',
    category: 'CLI & Systems',
    tags: ['Rust', 'WebGPU', 'Wasm', 'Vulkan', 'TypeScript'],
    stars: 1240,
    featured: true,
    demoUrl: 'https://github.com/ssfu-dev/hypershell',
    githubUrl: 'https://github.com/ssfu-dev/hypershell',
    year: '2025',
    highlights: [
      'Sub-millisecond latency terminal text rendering using glyph atlas',
      'Supports sixel graphics, OSC 52 clipboard, and custom Lua scripting',
      'Over 1,200 GitHub stars and 15k+ active downloads',
    ],
  },
  {
    id: 'agentflow',
    title: 'AgentFlow Orchestrator',
    tagline: 'Distributed LLM agent pipeline with stateful DAG orchestration',
    description: 'An open-source orchestration runtime for complex autonomous AI agent networks with human-in-the-loop validation and audit logs.',
    category: 'AI & Tools',
    tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Gemini API'],
    stars: 890,
    featured: true,
    demoUrl: 'https://github.com/ssfu-dev/agentflow',
    githubUrl: 'https://github.com/ssfu-dev/agentflow',
    year: '2025',
    highlights: [
      'DAG task scheduling with retry policies and semantic memory caching',
      'Real-time streaming telemetry with WebSocket & OpenTelemetry hooks',
      'Zero-downtime task migration across multi-worker clusters',
    ],
  },
  {
    id: 'vortexdb',
    title: 'VortexDB Vector Store',
    tagline: 'Embedded in-memory HNSW vector index for edge search',
    description: 'High-performance nearest-neighbor vector database engineered for browser WASM and lightweight serverless containers.',
    category: 'CLI & Systems',
    tags: ['Rust', 'SIMD', 'WASM', 'Vector Search'],
    stars: 640,
    featured: false,
    demoUrl: 'https://github.com/ssfu-dev/vortexdb',
    githubUrl: 'https://github.com/ssfu-dev/vortexdb',
    year: '2024',
    highlights: [
      'AVX-512 and NEON SIMD vector distance acceleration',
      'Less than 2MB binary footprint with plug-and-play browser WASM bindings',
    ],
  },
  {
    id: 'pixelcraft',
    title: 'PixelCraft Engine',
    tagline: 'Procedural 3D voxel sandbox engine running entirely in browser',
    description: 'Interactive voxel terrain generator using compute shaders, custom meshing algorithms (Greedy Meshing), and dynamic lighting.',
    category: 'Graphics & Web',
    tags: ['WebGL', 'Three.js', 'GLSL', 'React', 'TypeScript'],
    stars: 430,
    featured: true,
    demoUrl: 'https://github.com/ssfu-dev/pixelcraft',
    githubUrl: 'https://github.com/ssfu-dev/pixelcraft',
    year: '2024',
    highlights: [
      'Chunk-based procedural simplex noise terrain with biome generation',
      'Optimized 60fps greedy-meshing pipeline cutting polygon counts by 75%',
    ],
  },
  {
    id: 'devpulse',
    title: 'DevPulse Metrics',
    tagline: 'Developer experience dashboard & CI/CD build observability',
    description: 'Unified dashboard monitoring build timings, bundle sizes, test coverage, and deploy health across GitHub Actions and GitLab CI.',
    category: 'Full-Stack',
    tags: ['React', 'Next.js', 'Tailwind', 'Go', 'ClickHouse', 'Docker'],
    stars: 310,
    featured: false,
    demoUrl: 'https://github.com/ssfu-dev/devpulse',
    githubUrl: 'https://github.com/ssfu-dev/devpulse',
    year: '2023',
    highlights: [
      'High-throughput time-series analytics powered by ClickHouse',
      'Interactive visual waterfall charts for webpack and vite build bottlenecks',
    ],
  },
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: 'Languages',
    icon: 'code',
    skills: [
      { name: 'TypeScript / JavaScript', level: 95, category: 'Main', note: 'ESNext, Node, Browser, Deno' },
      { name: 'Rust', level: 85, category: 'Systems', note: 'CLI, WASM, Tokio, Async' },
      { name: 'Go', level: 80, category: 'Backend', note: 'Microservices, Goroutines, gRPC' },
      { name: 'Python', level: 82, category: 'AI/Data', note: 'FastAPI, PyTorch, Scripting' },
      { name: 'SQL / Shell', level: 88, category: 'Ops', note: 'PostgreSQL, Zsh, Bash' },
    ],
  },
  {
    title: 'Frontend & UI',
    icon: 'monitor',
    skills: [
      { name: 'React / Next.js', level: 94, category: 'Core', note: 'Server Components, Hooks, State' },
      { name: 'Tailwind CSS', level: 92, category: 'Styling', note: 'Responsive, Design Systems' },
      { name: 'Three.js / WebGL', level: 75, category: 'Graphics', note: 'Shaders, 3D Canvas, Meshes' },
      { name: 'HTML5 Canvas / SVG', level: 86, category: 'Visual', note: 'Charts, Interactive visualizations' },
      { name: 'State (Zustand, Redux)', level: 90, category: 'Arch', note: 'Optimistic UI, offline cache' },
    ],
  },
  {
    title: 'Backend & Cloud',
    icon: 'server',
    skills: [
      { name: 'Node.js & Express', level: 92, category: 'Backend', note: 'REST, WebSockets, Stream APIs' },
      { name: 'PostgreSQL & Redis', level: 88, category: 'Database', note: 'Indexing, Caching, Pub/Sub' },
      { name: 'Docker & Containers', level: 86, category: 'DevOps', note: 'Multi-stage builds, Compose' },
      { name: 'Cloud (AWS / GCP / Cloud Run)', level: 84, category: 'Cloud', note: 'Serverless, S3, IAM, CDN' },
      { name: 'CI/CD & GitHub Actions', level: 88, category: 'Workflow', note: 'Automated test & release pipelines' },
    ],
  },
  {
    title: 'Tools & Architecture',
    icon: 'terminal',
    skills: [
      { name: 'Git & Linux Internals', level: 92, category: 'OS', note: 'Vim, tmux, systemd, perf' },
      { name: 'System Design & APIs', level: 88, category: 'Arch', note: 'Distributed Systems, Rate Limiting' },
      { name: 'LLM & AI Integration', level: 85, category: 'AI', note: 'Gemini, Embeddings, RAG, Agents' },
      { name: 'Testing (Jest, Vitest, Playwright)', level: 84, category: 'QA', note: 'E2E, Integration, Unit' },
    ],
  },
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    period: '2023 - Present',
    role: 'Senior Full-Stack Engineer',
    company: 'CloudTech Solutions',
    location: 'Hangzhou / Remote',
    description: 'Leading frontend architecture and core infrastructure for cloud developer productivity tools used by 50,000+ engineers daily.',
    achievements: [
      'Engineered an edge-rendering workspace reducing average web IDE load latency by 45%',
      'Architected real-time multiplayer code review canvas with WebRTC and CRDT conflict resolution',
      'Mentored 6 junior/mid engineers and unified frontend design token system across 4 products',
    ],
    skills: ['TypeScript', 'React', 'Rust', 'WebSockets', 'Tailwind', 'Docker'],
  },
  {
    period: '2021 - 2023',
    role: 'Software Engineer',
    company: 'Nexus Interactive',
    location: 'Shanghai',
    description: 'Developed high-performance web applications and backend microservices for data visualization platforms.',
    achievements: [
      'Built a distributed log analyzer processing over 20M events/day with 99.98% uptime',
      'Rewrote legacy frontend dashboards into modern React + Vite, cutting bundle size by 60%',
    ],
    skills: ['Go', 'React', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
  },
  {
    period: '2019 - 2021',
    role: 'Frontend Developer',
    company: 'BitPulse Labs',
    location: 'Hangzhou',
    description: 'Crafted rich interactive interfaces, data dashboards, and internal developer tooling.',
    achievements: [
      'Developed 20+ responsive UI components and charting libraries from scratch',
      'Pioneered internal CLI generator saving team ~8 hours per sprint setup',
    ],
    skills: ['JavaScript', 'Vue', 'React', 'Node.js', 'Webpack', 'CSS3'],
  },
];

export const VIRTUAL_FILESYSTEM: Record<string, VirtualFile> = {
  '~': {
    name: '~',
    type: 'dir',
    children: {
      'about.txt': {
        name: 'about.txt',
        type: 'file',
        size: '1.2 KB',
        content: `Hi, I am ssfu 👋
Full-Stack Software Engineer & Creative Developer.

Passionate about crafting fast, delightful, and resilient digital experiences.
I enjoy low-level systems tinkering in Rust, building dynamic Web interfaces in React/TypeScript,
and designing developer tools that spark joy.

When not writing code, I explore mechanical keyboards, digital synthesizers,
and retro computing history.`,
      },
      'skills.md': {
        name: 'skills.md',
        type: 'file',
        size: '2.4 KB',
        content: `# Technical Skillset

## Core Languages
- TypeScript / JavaScript (95%)
- Rust (85%)
- Go (80%)
- Python (82%)
- SQL / Shell (88%)

## Frontend Architecture
- React 19, Next.js, Vite
- Tailwind CSS, Motion
- WebGL, Three.js, Canvas 2D

## Backend & Systems
- Node.js, Express, Go Microservices
- PostgreSQL, Redis, ClickHouse
- Docker, Linux, Git, CI/CD`,
      },
      'projects.json': {
        name: 'projects.json',
        type: 'file',
        size: '3.8 KB',
        content: `[
  {
    "id": "hypershell",
    "name": "HyperShell",
    "stars": 1240,
    "tech": ["Rust", "WebGPU", "TypeScript"]
  },
  {
    "id": "agentflow",
    "name": "AgentFlow Orchestrator",
    "stars": 890,
    "tech": ["TypeScript", "Node.js", "Redis"]
  },
  {
    "id": "pixelcraft",
    "name": "PixelCraft Engine",
    "stars": 430,
    "tech": ["WebGL", "Three.js", "GLSL"]
  }
]`,
      },
      'contact.cfg': {
        name: 'contact.cfg',
        type: 'file',
        size: '420 B',
        content: `[CONTACT_CONFIG]
email    = ssfu.dev@gmail.com
github   = https://github.com/ssfu-dev
linkedin = https://linkedin.com/in/ssfu-dev
twitter  = https://x.com/ssfu_dev
blog     = https://ssfu.dev/blog
location = Hangzhou / Remote
status   = Open for collaborations & interesting projects`,
      },
      'resume.txt': {
        name: 'resume.txt',
        type: 'file',
        size: '3.1 KB',
        content: `=====================================================
                 SSFU - CURRICULUM VITAE
=====================================================
Role: Senior Full-Stack Engineer
Email: ssfu.dev@gmail.com
Location: Hangzhou / Remote

SUMMARY:
Over 6 years of experience building reliable web platforms,
developer tools, and high-performance frontend interfaces.

EXPERIENCE:
- Senior Full-Stack Engineer @ CloudTech Solutions (2023 - Present)
- Software Engineer @ Nexus Interactive (2021 - 2023)
- Frontend Developer @ BitPulse Labs (2019 - 2021)

EDUCATION:
- B.S. in Computer Science & Technology (2015 - 2019)

Type 'download' or click resume button to get formatted copy.`,
      },
      'easter-eggs.txt': {
        name: 'easter-eggs.txt',
        type: 'file',
        size: '310 B',
        content: `Hey explorer! Try these hidden or fun commands:
- matrix   : Toggle falling digital matrix rain
- sound    : Toggle procedural mechanical keyboard audio
- crt      : Toggle retro CRT scanline & glow flicker
- theme    : Change theme (matrix, dracula, cyberpunk, nord, monokai, amber, light)
- sudo     : Try running superuser commands ;)
- date     : Show live workstation timestamp`,
      },
      'secrets': {
        name: 'secrets',
        type: 'dir',
        children: {
          'vault.key': {
            name: 'vault.key',
            type: 'file',
            size: '64 B',
            content: `4e6576657220676f6e6e61206769766520796f7520757021\n[Decrypted: "Always keep creating with passion and curiosity!"]`,
          },
        },
      },
    },
  },
};

export const ASCII_BANNER = `
 ███████╗███████╗███████╗██╗   ██╗   ██████╗ ███████╗██╗   ██╗
 ██╔════╝██╔════╝██╔════╝██║   ██║   ██╔══██╗██╔════╝██║   ██║
 ███████╗███████╗█████╗  ██║   ██║   ██║  ██║█████╗  ██║   ██║
 ╚════██║╚════██║██╔══╝  ██║   ██║   ██║  ██║██╔══╝  ╚██╗ ██╔╝
 ███████║███████║██║     ╚██████╔╝██╗██████╔╝███████╗ ╚████╔╝ 
 ╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝╚═════╝ ╚══════╝  ╚═══╝  
`;

export const NEOFETCH_ART = [
  '       /\\',
  '      /  \\',
  '     / /\\ \\',
  '    / /  \\ \\',
  '   / / /\\ \\ \\',
  '  / / /  \\ \\ \\',
  ' / / / /\\ \\ \\ \\',
  '/ / / /  \\ \\ \\ \\',
  '\\ \\ \\ \\  / / / /',
  ' \\ \\ \\ \\/ / / /',
  '  \\ \\ \\  / / /',
  '   \\ \\ \\/ / /',
  '    \\ \\  / /',
  '     \\ \\/ /',
  '      \\  /',
  '       \\/',
];

export const ABOUT_DATA = {
  name: 'ssfu',
  title: 'Senior Full-Stack & Systems Engineer',
  location: 'Hangzhou / Remote',
  status: 'Open to High-Impact Roles & Remote Engineering',
  bio: 'Full-Stack Software Engineer & Systems Tinkerer with 6+ years of experience building resilient cloud applications, GPU-accelerated web runtimes, and developer tooling. Passionate about TypeScript, Rust, distributed architectures, and generative AI agent ecosystems.',
};

export const SYSTEM_INFO = {
  os: 'DevOS v2.4 (x86_64)',
  host: 'ThinkPad X1 Carbon Gen 11',
  kernel: 'Linux 6.9.12-custom-zen',
  uptime: '42 days, 7 hours, 33 mins',
  shell: 'zsh 5.9 (x86_64-apple-darwin23.0)',
  resolution: '2880x1800 @ 120Hz',
  wm: 'Hyprland (Wayland)',
  terminal: 'kitty 0.35.2',
  cpu: 'Intel Core i7-1365U (12) @ 5.2GHz',
  memory: '18420MiB / 32768MiB (56%)',
};

export const NEOFETCH_DATA = SYSTEM_INFO;

