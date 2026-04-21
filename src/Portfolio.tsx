import { useEffect, useRef, useState } from "react";

const EMAIL = "pawelwlodarczyk97@yahoo.com";
const RAG_API = "http://localhost:3001";
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

const CHIPS = [
  { q: "what are your degrees and education background?", label: "education?" },
  { q: "what is your work history?", label: "career path?" },
  { q: "what ai projects have you shipped?", label: "ai projects?" },
  { q: "what is your current role and stack?", label: "current role?" },
  { q: "are you available for remote work?", label: "available?" },
];

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

type Line = {
  className: string;
  segments: { className: string; text: string }[];
};

const HERO_LINES: Line[] = [
  {
    className: "line",
    segments: [
      { className: "sl", text: "// " },
      { className: "tx", text: "paweł włodarczyk" },
    ],
  },
  {
    className: "line",
    segments: [
      { className: "sl", text: "// " },
      { className: "tx", text: "full-stack engineer, 6y" },
    ],
  },
  {
    className: "line",
    segments: [{ className: "sl", text: "//" }],
  },
  {
    className: "line",
    segments: [
      { className: "sl", text: "// " },
      { className: "tx", text: "now shipping: \u00a0" },
      { className: "kw", text: "langgraph agents, local llms, rag" },
    ],
  },
  {
    className: "line",
    segments: [
      { className: "sl", text: "// " },
      { className: "tx", text: "previously: \u00a0\u00a0" },
      { className: "tx prev-dim", text: "react apps that paid the bills" },
    ],
  },
  {
    className: "line",
    segments: [
      { className: "sl", text: "// " },
      { className: "tx", text: "currently: \u00a0\u00a0\u00a0" },
      { className: "am", text: "debugging embeddings at midnight" },
    ],
  },
];

export default function Portfolio() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [linksVisible, setLinksVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Refs for typewriter
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const termWindowRef = useRef<HTMLDivElement>(null);
  const termBodyRef = useRef<HTMLDivElement>(null);
  const termInputRef = useRef<HTMLInputElement>(null);
  // Refs for RAG
  const ragDemoRef = useRef<HTMLDivElement>(null);
  const ragOutputRef = useRef<HTMLDivElement>(null);
  const ragInputRef = useRef<HTMLInputElement>(null);
  const ragBusyRef = useRef(false);
  const userTouchedRef = useRef(false);
  // Interactive terminal state
  const [termReady, setTermReady] = useState(false);
  const [termHistory, setTermHistory] = useState<{ type: "cmd" | "out"; text: string }[]>([]);
  // Drag state
  const dragTermWindow = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0, natX: 0, natY: 0, w: 0, h: 0 });
  const dragRagDemo = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0, natX: 0, natY: 0, w: 0, h: 0 });
  const zCounter = useRef(2);
  const [ragStatus, setRagStatus] = useState<"ready" | "running" | "done">(
    "ready"
  );
  const [chipsDisabled, setChipsDisabled] = useState(false);
  const [runDisabled, setRunDisabled] = useState(false);

  useEffect(() => {
    try {
      const stored =
        (localStorage.getItem("pw-theme") as "dark" | "light") || "dark";
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pw-theme", next);
    } catch {
      // ignore
    }
  };

  // ── Typewriter for code block ──────────────────────────────────
  useEffect(() => {
    const codeBlock = codeBlockRef.current;
    if (!codeBlock) return;

    const lineEls = Array.from(
      codeBlock.querySelectorAll<HTMLElement>(".line")
    );
    const cursor = codeBlock.querySelector<HTMLElement>(".cursor");
    if (!cursor) return;

    const lineData = lineEls.map((line) => {
      const spans = Array.from(line.querySelectorAll<HTMLElement>("span"))
        .filter((s) => !s.classList.contains("cursor"));
      const segments = spans.map((s) => ({
        text: s.textContent ?? "",
        el: s,
      }));
      spans.forEach((s) => {
        s.textContent = "";
      });
      return segments;
    });

    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);

    let lineIdx = 0;
    let segIdx = 0;
    let charIdx = 0;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(t);
    };

    const typeNext = () => {
      if (cancelled) return;
      if (lineIdx >= lineData.length) {
        const lastLine = lineEls[lineEls.length - 1];
        lastLine.appendChild(cursor);
        setLinksVisible(true);
        setTermReady(true);
        return;
      }

      const segs = lineData[lineIdx];

      if (segs.length === 0) {
        lineIdx++;
        segIdx = 0;
        charIdx = 0;
        schedule(typeNext, 60);
        return;
      }

      if (segIdx >= segs.length) {
        lineIdx++;
        segIdx = 0;
        charIdx = 0;
        typeNext();
        return;
      }

      const seg = segs[segIdx];
      if (charIdx < seg.text.length) {
        seg.el.textContent += seg.text[charIdx];
        charIdx++;
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        seg.el.after(cursor);
        schedule(typeNext, charIdx === 1 ? 0 : 18);
      } else {
        segIdx++;
        charIdx = 0;
        typeNext();
      }
    };

    schedule(typeNext, 400);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // ── Intersection observer for fade-ins ─────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document
      .querySelectorAll<HTMLElement>(".fade-in")
      .forEach((el, i) => {
        if (el.id !== "code-block" && el.id !== "links") {
          el.style.transitionDelay = `${i * 0.04}s`;
          observer.observe(el);
        }
      });

    return () => observer.disconnect();
  }, []);

  // ── Drag via pointer capture ────────────────────────────────────
  const bringToFront = (el: HTMLDivElement | null) => {
    if (el) el.style.zIndex = String(++zCounter.current);
  };

  const snapBack = (
    ds: typeof dragTermWindow.current,
    elRef: React.RefObject<HTMLDivElement | null>,
  ) => {
    const el = elRef.current;
    if (!el) return;
    el.classList.add("snapping");
    el.style.transform = "";
    ds.offsetX = 0;
    ds.offsetY = 0;
    setTimeout(() => el.classList.remove("snapping"), 300);
  };

  const makeDragHandlers = (
    ds: typeof dragTermWindow.current,
    elRef: React.RefObject<HTMLDivElement | null>,
  ) => ({
    onPointerDown: (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest(".rag-status")) return;
      e.preventDefault();
      bringToFront(elRef.current);
      const handle = e.currentTarget as HTMLElement;
      handle.setPointerCapture(e.pointerId);
      ds.startX = e.clientX;
      ds.startY = e.clientY;
      const el = elRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        ds.natX = rect.left - ds.offsetX;
        ds.natY = rect.top - ds.offsetY;
        ds.w = rect.width;
        ds.h = rect.height;
        el.classList.add("dragging");
      }
    },
    onPointerMove: (e: React.PointerEvent) => {
      const handle = e.currentTarget as HTMLElement;
      if (!handle.hasPointerCapture(e.pointerId)) return;
      const el = elRef.current;
      if (!el) return;
      const pad = 60;
      let x = ds.offsetX + e.clientX - ds.startX;
      let y = ds.offsetY + e.clientY - ds.startY;
      x = Math.max(-(ds.natX + ds.w - pad), Math.min(x, window.innerWidth - ds.natX - pad));
      y = Math.max(-(ds.natY + ds.h - pad), Math.min(y, window.innerHeight - ds.natY - pad));
      el.style.transform = `translate(${x}px, ${y}px)`;
    },
    onPointerUp: (e: React.PointerEvent) => {
      const handle = e.currentTarget as HTMLElement;
      if (!handle.hasPointerCapture(e.pointerId)) return;
      handle.releasePointerCapture(e.pointerId);
      const el = elRef.current;
      if (el) {
        const m = el.style.transform.match(/translate\((.+?)px,\s*(.+?)px\)/);
        if (m) {
          ds.offsetX = parseFloat(m[1]);
          ds.offsetY = parseFloat(m[2]);
        }
      }
      el?.classList.remove("dragging");
    },
    onDoubleClick: () => snapBack(ds, elRef),
  });

  const termDrag = makeDragHandlers(dragTermWindow.current, termWindowRef);
  const ragDrag = makeDragHandlers(dragRagDemo.current, ragDemoRef);

  // ── Ctrl+K to focus RAG input ─────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        ragInputRef.current?.focus();
        ragInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Interactive terminal commands ─────────────────────────────
  const runTermCommand = (cmd: string): string[] => {
    const c = cmd.trim().toLowerCase();
    if (c === "help") return [
      "available commands:",
      "  whoami          about me",
      "  ls              list files",
      "  cat <file>      read a file",
      "  skills          tech stack",
      "  contact         contact info",
      "  clear           clear terminal",
    ];
    if (c === "whoami") return [
      "pawel wlodarczyk",
      "full-stack engineer, 6 years",
      "backend developer @ TME (oct 2024-present)",
      "msc computer science, beng computer science",
      "poland, utc+2",
    ];
    if (c === "ls" || c === "ls .") return [
      "about.txt    skills.txt    projects/",
      "contact.txt  education.txt",
    ];
    if (c === "ls projects" || c === "ls projects/") return [
      "okwow-ai-platform/",
      "baloise-enterprise-assistant/",
      "tme-ai-features/",
    ];
    if (c === "cat about.txt") return [
      "full-stack engineer with 6 years of experience.",
      "currently building ai features at TME using",
      "langgraph, langchain, ollama, and python.",
      "previously shipped react/next.js apps at",
      "ecohedge, weupcode, and softwarebay.",
    ];
    if (c === "cat skills.txt" || c === "skills") return [
      "languages:  typescript, javascript, python, php, java",
      "frontend:   react, next.js, tailwindcss, redux, jotai",
      "backend:    node.js, express, postgresql, mongodb",
      "ai/ml:      langgraph, langchain, ollama, rag, openai",
      "tools:      docker, kubernetes, git, figma, auth0",
    ];
    if (c === "cat education.txt") return [
      "msc computer science",
      "  wsb gdansk, 2021-2023",
      "  specialisation: front-end development",
      "",
      "beng computer science",
      "  polish naval academy, gdynia, 2017-2021",
      "  specialisation: web programming & devops",
    ];
    if (c === "cat contact.txt" || c === "contact") return [
      "email:    pawelwlodarczyk97@yahoo.com",
      "github:   github.com/empios",
      "linkedin: linkedin.com/in/pawelvlodarczyk",
      "status:   open to contract & remote",
    ];
    if (c === "sudo hire pawel") return [
      "[sudo] verifying credentials... ok",
      "generating offer_letter.pdf... done",
      "signing contract.pdf... done",
      "scheduling onboarding... monday",
      "",
      "welcome aboard.",
    ];
    if (c.startsWith("cat ")) return [
      `cat: ${c.slice(4)}: no such file or directory`,
      "try: ls",
    ];
    if (c === "") return [];
    return [`command not found: ${c}`, "type \"help\" for available commands"];
  };

  const onTermKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const input = termInputRef.current;
    if (!input) return;
    const cmd = input.value.trim();
    input.value = "";
    if (cmd === "clear") {
      setTermHistory([]);
      return;
    }
    const output = runTermCommand(cmd);
    setTermHistory((prev) => [
      ...prev,
      { type: "cmd", text: cmd },
      ...output.map((text) => ({ type: "out" as const, text })),
    ]);
    setTimeout(() => {
      if (termBodyRef.current) termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight;
    }, 0);
  };

  // ── Scramble hover ─────────────────────────────────────────────
  const scramble = (el: HTMLAnchorElement) => {
    const original =
      el.dataset.original || (el.childNodes[0]?.textContent?.trim() ?? "");
    el.dataset.original = original;
    let iter = 0;
    const total = original.length;
    const existing = (el as HTMLAnchorElement & {
      _scrambleTimer?: ReturnType<typeof setInterval>;
    })._scrambleTimer;
    if (existing) clearInterval(existing);
    const timer = setInterval(() => {
      if (!el.childNodes[0]) return;
      el.childNodes[0].textContent = original
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < iter) return original[i];
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");
      iter += 0.4;
      if (iter >= total) {
        el.childNodes[0].textContent = original;
        clearInterval(timer);
      }
    }, 30);
    (el as HTMLAnchorElement & {
      _scrambleTimer?: ReturnType<typeof setInterval>;
    })._scrambleTimer = timer;
  };

  // ── RAG helpers ────────────────────────────────────────────────
  const trunc = (text: string, len: number) =>
    text.length > len ? text.slice(0, len) + "…" : text;

  const appendLine = (text: string, cls = "", delay = 0) =>
    new Promise<HTMLDivElement>((resolve) => {
      setTimeout(() => {
        const ragOutput = ragOutputRef.current;
        if (!ragOutput) {
          resolve(document.createElement("div"));
          return;
        }
        const cur = ragOutput.querySelector(".rag-cursor-line");
        if (cur) cur.remove();
        const d = document.createElement("div");
        d.className = "rag-line" + (cls ? " " + cls : "");
        d.textContent = text;
        ragOutput.appendChild(d);
        ragOutput.scrollTop = ragOutput.scrollHeight;
        resolve(d);
      }, delay);
    });

  const runQuery = async (query: string) => {
    if (ragBusyRef.current || !query.trim()) return;
    ragBusyRef.current = true;
    setRunDisabled(true);
    setChipsDisabled(true);
    setRagStatus("running");

    await appendLine("");
    await appendLine("> " + query, "query-out");
    await appendLine("");
    await appendLine("searching knowledge base...", "step", 200);

    const finish = () => {
      appendLine("");
      setRagStatus("done");
      ragBusyRef.current = false;
      setRunDisabled(false);
      setChipsDisabled(false);
      ragInputRef.current?.focus();
      setTimeout(() => setRagStatus("ready"), 3000);
    };

    let res: Response;
    try {
      res = await fetch(`${RAG_API}/api/rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
    } catch {
      await appendLine("// backend unavailable — is the server running?", "dim");
      finish();
      return;
    }

    if (res.status === 429) {
      await appendLine("// rate limit reached — try again in a minute", "dim");
      finish();
      return;
    }

    if (!res.ok) {
      await appendLine("// request failed (" + res.status + ")", "dim");
      finish();
      return;
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let respEl: HTMLDivElement | null = null;
    let shouldStop = false;

    while (!shouldStop) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop()!;

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();

        if (payload === "[DONE]") {
          shouldStop = true;
          break;
        }

        try {
          const data = JSON.parse(payload);

          if (data.error) {
            await appendLine("");
            await appendLine("// error: " + data.error, "dim");
            shouldStop = true;
            break;
          }

          if (data.chunks) {
            await appendLine("");
            await appendLine(
              "retrieved " + data.chunks.length + " chunks:",
              "step"
            );
            for (const chunk of data.chunks) {
              await appendLine(trunc(chunk.text, 88), "chunk");
              await appendLine(
                "similarity: " + chunk.score.toFixed(4),
                "score"
              );
            }
            await appendLine("");
            await appendLine("generating response...", "step");

            const ragOutput = ragOutputRef.current;
            const cur = ragOutput?.querySelector(".rag-cursor-line");
            if (cur) cur.remove();
            respEl = document.createElement("div");
            respEl.className = "rag-line response";
            ragOutput?.appendChild(respEl);
            if (ragOutput) ragOutput.scrollTop = ragOutput.scrollHeight;
          }

          if (data.token != null) {
            if (!respEl) {
              const ragOutput = ragOutputRef.current;
              const cur = ragOutput?.querySelector(".rag-cursor-line");
              if (cur) cur.remove();
              respEl = document.createElement("div");
              respEl.className = "rag-line response";
              ragOutput?.appendChild(respEl);
            }
            respEl.textContent += data.token;
            const ragOutput = ragOutputRef.current;
            if (ragOutput) ragOutput.scrollTop = ragOutput.scrollHeight;
          }
        } catch {
          // ignore malformed SSE data
        }
      }
    }

    finish();
  };

  // ── Auto-demo ──────────────────────────────────────────────────
  useEffect(() => {
    const handle = setTimeout(async () => {
      if (userTouchedRef.current) return;
      try {
        const h = await fetch(`${RAG_API}/health`);
        if (!h.ok) return;
      } catch {
        return;
      }
      await runQuery("what is your current role and stack?");
      appendLine("");
      appendLine("// click a chip or type your own question below", "dim");
    }, 2500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputFocus = () => {
    userTouchedRef.current = true;
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const q = ragInputRef.current?.value.trim() ?? "";
      if (q) {
        if (ragInputRef.current) ragInputRef.current.value = "";
        void runQuery(q);
      }
    }
  };

  const onRunClick = () => {
    const q = ragInputRef.current?.value.trim() ?? "";
    if (q) {
      if (ragInputRef.current) ragInputRef.current.value = "";
      void runQuery(q);
    }
  };

  const onChipClick = (q: string) => {
    if (ragBusyRef.current) return;
    userTouchedRef.current = true;
    void runQuery(q);
  };

  const copyEmail = () => {
    void navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <button
        id="theme-toggle"
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        {theme === "dark" ? "light" : "dark"}
      </button>

      <div id="hero">
        <div id="hero-left">
          <div
            className="term-window fade-in visible"
            id="code-block"
            ref={termWindowRef}
            onMouseDown={() => bringToFront(termWindowRef.current)}
          >
            <div className="term-titlebar" {...termDrag}>
              <div className="term-dots">
                <span className="term-dot red"></span>
                <span className="term-dot yellow"></span>
                <span className="term-dot green"></span>
              </div>
              <span className="term-titlebar-text">~/about.sh</span>
              <span className="term-titlebar-spacer"></span>
            </div>
            <div className="term-body" ref={termBodyRef}>
              <div className="code-block" ref={codeBlockRef}>
                {HERO_LINES.map((line, i) => (
                  <div className={line.className} key={i}>
                    {line.segments.map((seg, j) => (
                      <span className={seg.className} key={j}>
                        {seg.text}
                      </span>
                    ))}
                    {i === HERO_LINES.length - 1 && (
                      <span className="cursor"></span>
                    )}
                  </div>
                ))}
              </div>
              {termReady && (
                <>
                  <div className="term-hint">type help to get started</div>
                  {termHistory.map((entry, i) => (
                    <div
                      key={i}
                      className={`term-line ${entry.type === "cmd" ? "term-cmd" : "term-out"}`}
                    >
                      {entry.type === "cmd" ? `$ ${entry.text}` : entry.text}
                    </div>
                  ))}
                </>
              )}
            </div>
            {termReady && (
              <div className="term-input-row">
                <span className="term-prompt">$</span>
                <input
                  ref={termInputRef}
                  className="term-input"
                  type="text"
                  placeholder="try: whoami, ls, cat about.txt"
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={onTermKeyDown}
                />
              </div>
            )}
            <nav
              className={"link-row" + (linksVisible ? " visible" : "")}
              id="links"
            >
              <a
                href="https://github.com/empios"
                target="_blank"
                rel="noopener"
                data-original="github"
                onMouseEnter={(e) => scramble(e.currentTarget)}
              >
                github<span className="arrow">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/pawelvlodarczyk"
                target="_blank"
                rel="noopener"
                data-original="linkedin"
                onMouseEnter={(e) => scramble(e.currentTarget)}
              >
                linkedin<span className="arrow">↗</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                data-original="email"
                onMouseEnter={(e) => scramble(e.currentTarget)}
              >
                email<span className="arrow">↗</span>
              </a>
              <a
                href={`${BASE_PATH}/cv.pdf`}
                target="_blank"
                rel="noopener"
                data-original="cv"
                onMouseEnter={(e) => scramble(e.currentTarget)}
              >
                cv<span className="arrow">↗</span>
              </a>
            </nav>
          </div>
        </div>

        <div id="hero-right" aria-hidden="false">
          <div
            className="rag-demo"
            id="rag-demo"
            ref={ragDemoRef}
            onMouseDown={() => bringToFront(ragDemoRef.current)}
          >
            <div
              className="rag-header"
              {...ragDrag}
            >
              <div className="term-dots">
                <span className="term-dot red"></span>
                <span className="term-dot yellow"></span>
                <span className="term-dot green"></span>
              </div>
              <span className="rag-title">~/rag_demo.py</span>
              <span className="rag-status" id="rag-status">
                <span className={`rag-dot ${ragStatus === "running" ? "running" : ragStatus === "done" ? "done" : ""}`}></span>
                {ragStatus}
              </span>
            </div>
            <div className="rag-sub-header">
              $ python rag_demo.py --mode interactive
            </div>
            <div
              className="rag-output"
              id="rag-output"
              ref={ragOutputRef}
            >
              <div className="rag-line dim">// ask me anything</div>
              <div className="rag-line dim">
                {"// e.g. \"what are your degrees?\""}
              </div>
              <div className="rag-line dim">
                {"//      \"what is your work history?\""}
              </div>
              <div className="rag-line dim">
                {"//      \"what ai projects have you shipped?\""}
              </div>
              <div className="rag-cursor-line">
                <span className="rag-blink">█</span>
              </div>
            </div>
            <div className="rag-suggestions" id="rag-suggestions">
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  className="rag-chip"
                  data-q={chip.q}
                  disabled={chipsDisabled}
                  onClick={() => onChipClick(chip.q)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <div className="rag-input-row">
              <span className="rag-prompt">&gt;</span>
              <input
                ref={ragInputRef}
                className="rag-input"
                id="rag-input"
                type="text"
                placeholder="query the knowledge base..."
                autoComplete="off"
                spellCheck={false}
                onFocus={onInputFocus}
                onKeyDown={onInputKeyDown}
              />
              <kbd className="rag-kbd">ctrl+k</kbd>
              <button
                className="rag-run"
                id="rag-run"
                disabled={runDisabled}
                onClick={onRunClick}
              >
                run
              </button>
            </div>
          </div>
        </div>
      </div>

      <main>
        <section id="projects" aria-label="Projects">
          <p
            className="section-label fade-in visible"
            style={{ transitionDelay: "0.08s" }}
          >
            selected work
          </p>

          <article
            className="project-card fade-in visible"
            style={{ transitionDelay: "0.12s" }}
          >
            <div className="project-header">
              <span className="project-name">okWOW — AI knowledge platform</span>
              <span className="project-year">2024</span>
            </div>
            <div className="postmortem">
              <div className="pm-row">
                <span className="pm-label">Problem</span>
                <p className="pm-text">
                  Teams drowning in unstructured documents — PDFs, images,
                  scanned forms — with no way to query them conversationally or
                  pipe them into automated workflows.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">What broke</span>
                <p className="pm-text">
                  OCR quality variance across document types caused hallucinated
                  context in early OpenAI calls. MCP connector handshakes timed
                  out under concurrent sessions. Voice pipeline latency exceeded
                  acceptable UX thresholds on first pass.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">Decision</span>
                <p className="pm-text">
                  Introduced preprocessing normalization before OCR hand-off,
                  added session-level retry logic to MCP connectors, and moved
                  voice synthesis off the critical path with streaming chunked
                  responses.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">Outcome</span>
                <p className="pm-text">
                  Platform shipped with document ingestion, conversational
                  Q&amp;A, multi-connector workflows, and voice interface. Full
                  stack owned end-to-end.
                </p>
              </div>
            </div>
            <div className="stack-row">
              <span className="stack-tag">TypeScript</span>
              <span className="stack-tag">React</span>
              <span className="stack-tag">Express</span>
              <span className="stack-tag">OpenAI</span>
              <span className="stack-tag">OCR</span>
              <span className="stack-tag">MCP</span>
              <span className="stack-tag">Voice</span>
            </div>
          </article>

          <article
            className="project-card fade-in visible"
            style={{ transitionDelay: "0.16s" }}
          >
            <div className="project-header">
              <span className="project-name">
                Baloise Group — enterprise AI assistant
              </span>
              <span className="project-year">2024</span>
            </div>
            <div className="postmortem">
              <div className="pm-row">
                <span className="pm-label">Problem</span>
                <p className="pm-text">
                  Large insurance enterprise with dense internal documentation —
                  underwriting guidelines, policy manuals, compliance procedures
                  — inaccessible to frontline staff without specialist lookup
                  time.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">What broke</span>
                <p className="pm-text">
                  Enterprise document diversity (varied scan quality, mixed
                  languages, table-heavy layouts) degraded retrieval precision.
                  Internal security constraints limited which data could leave
                  the perimeter, complicating the standard API approach.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">Decision</span>
                <p className="pm-text">
                  Built OCR preprocessing pipeline tailored to insurance
                  document structure. Designed the context assembly layer to
                  stay within data residency boundaries before GPT calls.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">Outcome</span>
                <p className="pm-text">
                  AI chat assistant deployed inside enterprise perimeter. Staff
                  can query document corpus conversationally. OCR-fed context
                  window approach maintained security compliance without
                  sacrificing answer quality.
                </p>
              </div>
            </div>
            <div className="stack-row">
              <span className="stack-tag">TypeScript</span>
              <span className="stack-tag">GPT-4</span>
              <span className="stack-tag">OCR</span>
              <span className="stack-tag">RAG</span>
              <span className="stack-tag">Enterprise</span>
            </div>
          </article>

          <article
            className="project-card fade-in visible"
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="project-header">
              <span className="project-name">TME — AI feature development</span>
              <span className="project-year">2024–present</span>
            </div>
            <div className="postmortem">
              <div className="pm-row">
                <span className="pm-label">Problem</span>
                <p className="pm-text">
                  Extending a production TypeScript/Node.js platform with AI
                  capabilities — intelligent search, context-aware responses,
                  local model inference — without routing sensitive data through
                  external APIs.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">What broke</span>
                <p className="pm-text">
                  LangChain abstraction layers introduced non-obvious behaviour
                  at version boundaries — embedding normalization changed
                  silently between releases, causing retrieval degradation that
                  didn&apos;t surface as an error, only as gradually worsening
                  result quality.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">Decision</span>
                <p className="pm-text">
                  Moved to explicit LangGraph state machines for agentic flows
                  to keep behaviour auditable. Ollama handles local model
                  inference to satisfy data residency requirements. Added
                  trace-level observability to catch silent regressions from
                  dependency updates early.
                </p>
              </div>
              <div className="pm-row">
                <span className="pm-label">Outcome</span>
                <p className="pm-text">
                  AI features shipped alongside existing TypeScript/PostgreSQL
                  stack. Local inference layer keeps data on-premises.
                  Graph-based agent architecture makes control flow debuggable
                  rather than emergent.
                </p>
              </div>
            </div>
            <div className="stack-row">
              <span className="stack-tag">Python</span>
              <span className="stack-tag">LangGraph</span>
              <span className="stack-tag">LangChain</span>
              <span className="stack-tag">Ollama</span>
              <span className="stack-tag">TypeScript</span>
              <span className="stack-tag">PostgreSQL</span>
            </div>
          </article>
        </section>

        <section id="skills" aria-label="Skills">
          <p className="section-label fade-in">stack</p>
          <div className="skills-grid fade-in">
            <div className="skill-row">
              <span className="skill-cat">languages</span>
              <span className="skill-vals">
                TypeScript &nbsp;·&nbsp; JavaScript &nbsp;·&nbsp; Python
                &nbsp;·&nbsp; PHP &nbsp;·&nbsp; Java
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-cat">frontend</span>
              <span className="skill-vals">
                React &nbsp;·&nbsp; Next.js &nbsp;·&nbsp; TailwindCSS
                &nbsp;·&nbsp; Redux &nbsp;·&nbsp; Jotai
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-cat">backend</span>
              <span className="skill-vals">
                Node.js &nbsp;·&nbsp; Express &nbsp;·&nbsp; PostgreSQL
                &nbsp;·&nbsp; MongoDB &nbsp;·&nbsp; MySQL
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-cat">ai / ml</span>
              <span className="skill-vals">
                LangGraph &nbsp;·&nbsp; LangChain &nbsp;·&nbsp; Ollama
                &nbsp;·&nbsp; RAG &nbsp;·&nbsp; OpenAI &nbsp;·&nbsp; OCR
              </span>
            </div>
            <div className="skill-row">
              <span className="skill-cat">tools</span>
              <span className="skill-vals">
                Docker &nbsp;·&nbsp; Kubernetes &nbsp;·&nbsp; Git &nbsp;·&nbsp;
                Figma &nbsp;·&nbsp; Auth0
              </span>
            </div>
          </div>
        </section>

        <section id="now" aria-label="Now">
          <p
            className="section-label fade-in visible"
            style={{ transitionDelay: "0.24s" }}
          >
            now
          </p>
          <div
            className="now-block fade-in visible"
            style={{ transitionDelay: "0.28s" }}
          >
            <p className="now-date">April 2026</p>
            <p className="now-text">
              Backend Developer at <code>TME</code> since October 2024 —
              TypeScript, React, Node.js, PostgreSQL on the platform side;
              Python, LangGraph, LangChain, and Ollama on the AI side. Currently
              extending API and search algorithms with local LLM inference.
              Keeping agent control flow explicit with graph-based state
              machines — easier to debug than prompt chains.
            </p>
          </div>
        </section>

        <section id="contact-section" aria-label="Contact">
          <p className="section-label fade-in">contact</p>
          <div className="contact-block fade-in">
            <button
              className="contact-email-btn"
              id="email-copy"
              title="Click to copy email"
              onClick={copyEmail}
            >
              <span className="contact-email-text">{EMAIL}</span>
              <span className="contact-copy-icon" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4.5"
                    y="0.5"
                    width="8"
                    height="8"
                    rx="1"
                    stroke="currentColor"
                  />
                  <path
                    d="M0.5 4.5v8h8v-2"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span
                className={"copy-hint" + (copied ? " visible" : "")}
                id="copy-hint"
              >
                copied
              </span>
            </button>
            <div className="contact-meta">
              <span className="contact-meta-item">
                Poland &nbsp;·&nbsp; UTC+2
              </span>
              <span className="contact-meta-sep">/</span>
              <span className="contact-meta-item avail">
                open to contract &amp; remote
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>Paweł Włodarczyk · MSc CS</span>
        <span>Poland</span>
      </footer>
    </>
  );
}
