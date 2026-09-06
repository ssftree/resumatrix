import { PortfolioConfig } from './types';

/**
 * ⚡ GEEK PORTFOLIO UNIFIED CONFIGURATION
 * ----------------------------------------------------
 * This single configuration file drives ALL 4 presentation styles:
 * 1. Terminal CLI (Interactive Unix Console)
 * 2. Cloud IDE (VS Code Architecture View)
 * 3. Bento Grid (Modern Obsidian / Raycast Dashboard)
 * 4. Academic LaTeX CV (Print-ready formal PDF resume)
 *
 * To replicate this project for yourself:
 * Simply edit this file with your own info, or use the in-app "Customize" button!
 */
export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  version: '2.5.0',
  branding: {
    showMadeWith: true,
  },
  profile: {
    name: 'ssfu',
    title: 'Senior Full-Stack & Systems Engineer',
    location: 'Hangzhou / Remote',
    status: 'Open to High-Impact Roles & Remote Engineering',
    avatarInitials: 'SF',
    yearsOfExperience: '6+ Years',
    bio: 'Full-Stack Software Engineer & Systems Tinkerer with 6+ years of experience building resilient cloud applications, GPU-accelerated web runtimes, and developer tooling. Passionate about TypeScript, Rust, distributed architectures, and generative AI agent ecosystems.',
    stats: [
      { metric: '100M+', label: 'Daily API Events Scaled' },
      { metric: '99.99%', label: 'SLA Architecture Uptime' },
      { metric: '45%', label: 'CI/CD Latency Reduction' },
    ],
  },
  contact: {
    email: 'ssfu.dev@gmail.com',
    github: 'https://github.com/ssfu-dev',
    linkedin: 'https://linkedin.com/in/ssfu-dev',
    twitter: 'https://x.com/ssfu_dev',
    blog: 'https://ssfu.dev/blog',
    location: 'Hangzhou / Remote',
  },
  skills: [
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
        { name: 'HTML5 Canvas / SVG', level: 86, category: 'Visual', note: 'Charts, Interactive visualizers' },
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
  ],
  experience: [
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
  ],
  projects: [
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
  ],
  education: [
    {
      degree: 'B.S. in Computer Science & Technology',
      field: 'Software Engineering & Distributed Computing',
      institution: 'Zhejiang University of Technology',
      location: 'Hangzhou, China',
      period: '2017 - 2021',
      notes: 'Focus on Distributed Systems, Operating Systems, Algorithm Complexity, and Network Protocols. Outstanding Graduate Thesis Award.',
    },
  ],
  terminal: {
    easterEggsEnabled: true,
  },
  system: {
    os: 'DevOS v2.5 (x86_64)',
    host: 'ThinkPad X1 Carbon Gen 11',
    kernel: 'Linux 6.9.12-custom-zen',
    uptime: '42 days, 7 hours, 33 mins',
    shell: 'zsh 5.9 (x86_64-apple-darwin23.0)',
    resolution: '2880x1800 @ 90Hz',
    wm: 'Hyprland (Wayland)',
    terminal: 'HyperShell 0.9.4',
    cpu: 'Intel Core i7-1365U (12) @ 5.2GHz',
    memory: '18420MiB / 32768MiB (56%)',
  },
};

/**
 * Alternative preset configs demonstrating instant template replication!
 */
export const PRESET_CONFIGS: Record<string, { label: string; desc: string; config: PortfolioConfig }> = {
  default: {
    label: 'Systems & Full-Stack (Default)',
    desc: 'TypeScript, Rust, Go, Distributed Systems & GPU Terminal',
    config: DEFAULT_PORTFOLIO_CONFIG,
  },
  ai_engineer: {
    label: 'AI & LLM Agent Engineer',
    desc: 'Gemini, PyTorch, LangChain, Vector DBs, RAG Architectures',
    config: {
      ...DEFAULT_PORTFOLIO_CONFIG,
      profile: {
        ...DEFAULT_PORTFOLIO_CONFIG.profile,
        title: 'Lead AI Engineer & Agent Architect',
        status: 'Exploring Frontier Agentic Systems & Multi-Modal Models',
        bio: 'AI Engineer focused on Autonomous Agents, RAG pipelines, and Large Multimodal Models. Experienced in building enterprise AI systems with sub-second inference, function calling, and structured reasoning loops.',
        stats: [
          { metric: '500M+', label: 'Monthly LLM Tokens Processed' },
          { metric: '94.2%', label: 'Agent Tool-Call Accuracy' },
          { metric: '180ms', label: 'Median Streaming TTFT' },
        ],
      },
      skills: [
        {
          title: 'AI & Frontier Models',
          icon: 'cpu',
          skills: [
            { name: 'Google Gemini API / Pro / Flash', level: 96, category: 'LLM' },
            { name: 'Agentic Workflows & Tool Calling', level: 94, category: 'Agents' },
            { name: 'Vector DBs (Qdrant, Pinecone)', level: 88, category: 'Storage' },
            { name: 'PyTorch & Fine-tuning (LoRA)', level: 80, category: 'ML' },
          ],
        },
        {
          title: 'Engineering & Stack',
          icon: 'server',
          skills: [
            { name: 'Python / FastAPI', level: 95, category: 'Backend' },
            { name: 'TypeScript / Next.js', level: 90, category: 'Fullstack' },
            { name: 'Kubernetes & GPU Orchestration', level: 84, category: 'Infra' },
            { name: 'Redis & Semantic Caching', level: 92, category: 'Ops' },
          ],
        },
      ],
    },
  },
  frontend_craft: {
    label: 'Creative Technologist & UI Engineer',
    desc: 'React 19, Three.js, WebGL, High-Performance Canvas, Motion',
    config: {
      ...DEFAULT_PORTFOLIO_CONFIG,
      profile: {
        ...DEFAULT_PORTFOLIO_CONFIG.profile,
        title: 'Staff Frontend Engineer & Creative Technologist',
        status: 'Crafting fluid 60fps design systems & interactive 3D web',
        bio: 'Frontend craftsman passionate about micro-interactions, optical typography, WebGL shaders, and high-performance web canvases. Bridging the gap between fine art and engineering precision.',
        stats: [
          { metric: '60 FPS', label: 'Guaranteed Canvas Framerate' },
          { metric: '99/100', label: 'Average Lighthouse Score' },
          { metric: '40+', label: 'Custom Design System Tokens' },
        ],
      },
    },
  },
};
