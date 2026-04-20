export type KBDoc = {
  id: string;
  text: string;
  tags: string[];
};

export const KB: KBDoc[] = [
  {
    id: "current-role",
    text: "Paweł is currently a Backend Developer at TME since October 2024. He works with TypeScript, React, Node.js, and PostgreSQL. His responsibilities include working with APIs and search algorithms, writing and managing PostgreSQL queries, and application optimization. He is also developing AI features using Python, LangGraph, LangChain, and Ollama for local LLM inference.",
    tags: [
      "tme",
      "current",
      "job",
      "role",
      "position",
      "backend",
      "stack",
      "typescript",
      "python",
      "api",
      "postgresql",
      "search",
      "work",
    ],
  },
  {
    id: "ecohedge",
    text: "Paweł worked as a full-stack developer at Ecohedge from January 2023 to September 2024. His stack was TypeScript, Jotai, Next.js, React, Node.js, and TailwindCSS. He built data visualisation using graphs and React-Table, integrated external APIs including Auth0, Mailgun, Codat, and OpenAI, and worked with MongoDB.",
    tags: [
      "ecohedge",
      "fullstack",
      "nextjs",
      "react",
      "tailwind",
      "openai",
      "mongodb",
      "work",
      "history",
      "career",
      "experience",
      "job",
      "2023",
      "2024",
    ],
  },
  {
    id: "weupcode",
    text: "Paweł was a React Developer at WEUPCODE from September 2021 to January 2023. He used TypeScript, Redux, React, and TailwindCSS. He worked with REST APIs and developed new features for the application.",
    tags: [
      "weupcode",
      "react",
      "redux",
      "typescript",
      "tailwind",
      "rest",
      "work",
      "history",
      "career",
      "experience",
      "job",
      "2021",
      "2022",
    ],
  },
  {
    id: "softwarebay",
    text: "Paweł was a Junior Full-Stack Developer at Softwarebay.io from February 2021 to August 2021. He used React, Next.js, and Laravel, and maintained a PHP back-end application.",
    tags: [
      "softwarebay",
      "junior",
      "php",
      "laravel",
      "react",
      "nextjs",
      "work",
      "history",
      "career",
      "experience",
      "job",
      "2021",
    ],
  },
  {
    id: "ks-sport",
    text: "Paweł started his career as a Junior Web Developer at KS SPORT from August 2020 to February 2021. He designed and created software solutions using JavaScript and PHP, and managed an SQL database.",
    tags: [
      "ks sport",
      "junior",
      "first job",
      "javascript",
      "php",
      "sql",
      "work",
      "history",
      "career",
      "experience",
      "2020",
    ],
  },
  {
    id: "education-msc",
    text: "Paweł studied at Wyższa Szkoła Bankowa w Gdańsku where he earned a Master of Science in Computer Science, enrolled from September 2021 to July 2023. He specialised in front-end development and took electives in web development.",
    tags: [
      "msc",
      "master",
      "masters",
      "university",
      "gdansk",
      "wsb",
      "education",
      "degree",
      "degrees",
      "studied",
      "school",
      "academic",
      "background",
      "qualification",
      "graduate",
      "2021",
      "2023",
      "computer science",
      "engineering",
    ],
  },
  {
    id: "education-beng",
    text: "Paweł studied at the Polish Naval Academy in Gdynia where he earned a Bachelor of Engineering in Computer Science, enrolled from September 2017 to March 2021. He took specialisation courses in web programming and DevOps solutions, and electives in web applications.",
    tags: [
      "bachelor",
      "bachelors",
      "beng",
      "naval academy",
      "gdynia",
      "education",
      "degree",
      "degrees",
      "studied",
      "school",
      "academic",
      "background",
      "qualification",
      "graduate",
      "2017",
      "2021",
      "devops",
      "web programming",
      "computer science",
      "engineering",
    ],
  },
  {
    id: "ai-work",
    text: "Paweł's AI work includes: building an AI knowledge platform (okWOW) with React, Express, OpenAI, OCR, and MCP connectors; an enterprise AI chat assistant for Baloise Group insurance with OCR-fed GPT context; and AI feature development at TME using LangGraph, LangChain, Ollama, and Python. He has debugged silent embedding mismatches in vector stores and uses Phoenix for LLM observability.",
    tags: [
      "ai",
      "langgraph",
      "ollama",
      "rag",
      "langchain",
      "openai",
      "agents",
      "ocr",
      "phoenix",
      "vector",
      "embeddings",
      "projects",
      "shipped",
      "built",
      "platform",
      "assistant",
    ],
  },
  {
    id: "specializations",
    text: "Paweł's specialisations include website design, front-end development, back-end development, single page applications, database operations (MySQL, MongoDB, SQLite, PostgreSQL), and coding from templates or mockups. He is experienced with Figma and Adobe Photoshop for design.",
    tags: [
      "specialization",
      "frontend",
      "backend",
      "database",
      "spa",
      "design",
      "figma",
      "photoshop",
      "skills",
      "stack",
    ],
  },
  {
    id: "full-stack-skills",
    text: "Paweł's coding languages are TypeScript, JavaScript, PHP, Java, and Python. His frameworks and tools include React, Next.js, Node.js, Redux, TailwindCSS, Laravel, Django, Vue.js, Docker, Kubernetes, Auth0, Mailgun, Jotai, and Bootstrap. He uses JetBrains IDEs and Visual Studio Code.",
    tags: [
      "typescript",
      "javascript",
      "python",
      "php",
      "java",
      "react",
      "nextjs",
      "nodejs",
      "docker",
      "kubernetes",
      "vue",
      "django",
      "laravel",
      "skills",
      "stack",
      "languages",
      "frameworks",
      "tools",
    ],
  },
  {
    id: "location",
    text: "Paweł Włodarczyk is based in Poland (UTC+2). He has 6 years of professional software development experience. He is open to contract work and remote positions, particularly in AI-adjacent roles. His email is pawelwlodarczyk97@yahoo.com.",
    tags: [
      "poland",
      "remote",
      "contract",
      "available",
      "availability",
      "location",
      "hire",
      "hiring",
      "contact",
      "work",
      "6 years",
    ],
  },
];

export type RetrievedChunk = KBDoc & { sim: number };

export function scoreDoc(query: string, doc: KBDoc): number {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const haystack = (doc.text + " " + doc.tags.join(" ")).toLowerCase();
  const hits = words.filter((w) => {
    if (haystack.includes(w)) return true;
    // match plural/singular variants (e.g. "degrees" → "degree")
    if (w.endsWith("s") && w.length > 3 && haystack.includes(w.slice(0, -1)))
      return true;
    return false;
  }).length;
  const base = words.length > 0 ? hits / words.length : 0;
  return Math.min(0.99, base * 0.74 + Math.random() * 0.08 + 0.05);
}

export function retrieve(query: string, k: number): RetrievedChunk[] {
  return KB.map((doc) => ({ ...doc, sim: scoreDoc(query, doc) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, k);
}

export function synthesizeAnswer(
  query: string,
  chunks: RetrievedChunk[]
): string {
  if (chunks.length === 0) {
    return "Not enough information in the knowledge base to answer that.";
  }
  // Only draw from the two highest-ranked chunks to avoid off-topic sentences
  const topChunks = chunks.slice(0, 2);
  const sentences = topChunks
    .flatMap((c) => c.text.split(/(?<=[.!?])\s+/))
    .filter(Boolean);
  const q = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const scored = sentences.map((s) => {
    const lower = s.toLowerCase();
    const hits = q.filter((w) => {
      if (lower.includes(w)) return true;
      if (w.endsWith("s") && w.length > 3 && lower.includes(w.slice(0, -1)))
        return true;
      return false;
    }).length;
    return { s, hits };
  });
  const relevant = scored.filter((x) => x.hits > 0);
  if (relevant.length > 0) {
    return relevant
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 3)
      .map((x) => x.s)
      .join(" ");
  }
  // No query words found in sentence text — return the top chunk texts directly
  return topChunks
    .flatMap((c) => c.text.split(/(?<=[.!?])\s+/).slice(0, 2))
    .join(" ");
}
