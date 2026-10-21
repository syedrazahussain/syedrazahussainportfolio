import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    FaPython, FaJava, FaReact, FaNodeJs, FaDatabase, FaGitAlt, FaDocker, FaHtml5,
    FaCss3Alt,
    FaJsSquare,
    FaGithub,
    FaAws,
    FaCodeBranch
} from "react-icons/fa";
import { SiOpenai, SiLangchain, SiLanggraph } from "react-icons/si";
import { VscGitMerge, VscSymbolKeyword } from "react-icons/vsc";
import { SiC, SiNextdotjs, SiTailwindcss, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiSupabase, SiVercel, SiNetlify, SiRender, SiRailway, SiPostman, SiAnaconda, SiRedux, SiFirebase, SiRedis, SiPuppeteer, SiGithubactions, SiCloudflare } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { SiXampp } from "react-icons/si";
import { GiSwampBat } from "react-icons/gi";
import { SiPhp } from "react-icons/si";
import { motion, useInView } from "framer-motion";

export const skills = [
    {
        name: "Programming Languages",
        children: [
            { name: "Python", icon: <FaPython /> },
            { name: "C Lang", icon: <SiC /> },
            { name: "Java", icon: <FaJava /> },
            { name: "JavaScript", icon: <FaJsSquare /> },
        ],
    },
    {
        name: "Frontend / Frameworks",
        children: [
            { name: "React", icon: <FaReact /> },
            { name: "Next.js", icon: <SiNextdotjs /> },
            { name: "HTML5", icon: <FaHtml5 /> },
            { name: "CSS3", icon: <FaCss3Alt /> },
            { name: "Tailwind CSS", icon: <SiTailwindcss /> },
            { name: "Redux", icon: <SiRedux /> },
        ],
    },
    {
        name: "Backend / Frameworks",
        children: [
            { name: "Node.js", icon: <FaNodeJs /> },
            { name: "Express.js", icon: <SiExpress /> },
            { name: "Php", icon: <SiPhp /> },
            { name: "Firebase", icon: <SiFirebase /> },
        ],
    },
    {
        name: "AI & LLM Development",
        children: [
            { name: "LLMs", icon: <SiOpenai /> },
            { name: "RAG", icon: <VscGitMerge /> },
            { name: "LangChain", icon: <SiLangchain /> },
            { name: "LangGraph", icon: <VscGitMerge /> },
            { name: "Embeddings", icon: <VscSymbolKeyword /> },
            { name: "Vector Databases", icon: <FaDatabase /> },
        ],
    },
    {
        name: "Databases",
        children: [
            { name: "MySQL", icon: <SiMysql /> },
            { name: "PostgreSQL", icon: <SiPostgresql /> },
            { name: "MongoDB", icon: <SiMongodb /> },
            { name: "Supabase", icon: <SiSupabase /> },
            { name: "Redis", icon: <SiRedis /> },
        ],
    },
    {
        name: "Developer Tools",
        children: [
            { name: "Git", icon: <FaGitAlt /> },
            { name: "GitHub", icon: <FaGithub /> },
            { name: "VS Code", icon: <VscVscode /> },
            { name: "Postman", icon: <SiPostman /> },
            { name: "Anaconda", icon: <SiAnaconda /> },
            { name: "Docker", icon: <FaDocker /> },
            { name: "Xampp", icon: <SiXampp /> },
            { name: "Wamp", icon: <GiSwampBat /> },
            { name: "Puppeteer", icon: <SiPuppeteer /> },
        ],
    },
    {
        name: "Devops & Cloud",
        children: [
            { name: "Vercel", icon: <SiVercel /> },
            { name: "Netlify", icon: <SiNetlify /> },
            { name: "Render", icon: <SiRender /> },
            { name: "Railway", icon: <SiRailway /> },
            { name: "GitHub Actions", icon: <SiGithubactions /> },
            { name: "CI/CD", icon: <FaCodeBranch /> },
            { name: "AWS", icon: <FaAws /> },
            { name: "Cloudflare", icon: <SiCloudflare /> },
            { name: "Docker", icon: <FaDocker /> },
        ],
    },
];

const VIEW_SIZE = 1400;
const CENTER = VIEW_SIZE / 2;

const ROOT_RADIUS = 57;
const PARENT_RADIUS = 350;
const CHILD_RADIUS = 250;

const PARENT_SIZE = 96;
const CHILD_SIZE = 72;
const MIN_CHILD_GAP = 12;

const COLORS = {
    activeLine: "#34d399",
    root: "#102d36",
    parent: "#14223c",
    parentBorder: "#5475bb",
    activeParent: "#10392f",
    child: "#0e1728",
    text: "#e7efff",
    accent: "#34d399",
};

function polar(radius, angle) {
    return {
        x: CENTER + radius * Math.cos(angle),
        y: CENTER + radius * Math.sin(angle),
    };
}

function getArcPositions(count, radius, center, direction) {
    if (!count) return [];

    if (count === 1) {
        return [
            {
                x: center.x + radius * Math.cos(direction),
                y: center.y + radius * Math.sin(direction),
                angle: direction,
            },
        ];
    }

    const requiredAngle =
        2 *
        Math.asin(
            Math.min(
                1,
                (CHILD_SIZE + MIN_CHILD_GAP) / (2 * radius)
            )
        );

    const span = Math.min(
        (160 * Math.PI) / 180,
        requiredAngle * (count - 1)
    );

    return Array.from({ length: count }, (_, index) => {
        const angle =
            direction -
            span / 2 +
            (span * index) / (count - 1);

        return {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle),
            angle,
        };
    });
}

function splitLabel(value, maxChars = 13) {
    const words = value.split(/\s+/);
    const lines = [];
    let line = "";

    for (const word of words) {
        if (!line) {
            line = word;
        } else if ((line + " " + word).length <= maxChars) {
            line += " " + word;
        } else {
            lines.push(line);
            line = word;
        }
    }

    if (line) lines.push(line);

    return lines.flatMap((part) => {
        if (part.length <= maxChars + 2) return [part];

        const chunks = [];

        for (let i = 0; i < part.length; i += maxChars) {
            chunks.push(part.slice(i, i + maxChars));
        }

        return chunks;
    });
}

function SkillsGraph({ data = [] }) {
    const wrapperRef = useRef(null);

    // Refs for automatically focusing the active category.
    const viewportRef = useRef(null);
    const svgRef = useRef(null);

    const pointerDownRef = useRef(false);
    const scrollFrameRef = useRef(null);

    const isInView = useInView(wrapperRef, {
        margin: "-80px",
    });

    const [activeParent, setActiveParent] = useState(0);
    const [paused, setPaused] = useState(false);

    const safeData = useMemo(
        () =>
            data.filter(
                (category) =>
                    category &&
                    typeof category.name === "string" &&
                    Array.isArray(category.children)
            ),
        [data]
    );

    useEffect(() => {
        setActiveParent((current) =>
            safeData.length
                ? Math.min(current, safeData.length - 1)
                : 0
        );
    }, [safeData.length]);

    const parents = useMemo(
        () =>
            safeData.map((category, index) => {
                const angle =
                    -Math.PI / 2 +
                    (2 * Math.PI * index) /
                    Math.max(safeData.length, 1);

                return {
                    ...polar(PARENT_RADIUS, angle),
                    angle,
                    category,
                    index,
                };
            }),
        [safeData]
    );

    const selected = parents[activeParent];

    const children = useMemo(() => {
        if (!selected) return [];

        const items = selected.category.children;

        return getArcPositions(
            items.length,
            CHILD_RADIUS,
            selected,
            selected.angle
        ).map((position, index) => ({
            ...position,
            item: items[index],
            index,
        }));
    }, [selected]);

    // AUTOMATICALLY SCROLL TO THE ACTIVE CATEGORY.
    // Only the graph viewport scrolls, not the webpage.
    useEffect(() => {
        const viewport = viewportRef.current;
        const svg = svgRef.current;

        if (!viewport || !svg || !selected) return;

        if (scrollFrameRef.current !== null) {
            cancelAnimationFrame(scrollFrameRef.current);
        }

        scrollFrameRef.current = requestAnimationFrame(() => {
            const svgRect = svg.getBoundingClientRect();

            const scaleX = svgRect.width / VIEW_SIZE;

            if (!scaleX) return;

            // Include the active parent and every child in the
            // focus area, so their complete group stays visible.
            const positions = [
                selected.x - PARENT_SIZE / 2,
                selected.x + PARENT_SIZE / 2,
                ...children.flatMap((child) => [
                    child.x - CHILD_SIZE / 2,
                    child.x + CHILD_SIZE / 2,
                ]),
            ];

            const minX = Math.min(...positions);
            const maxX = Math.max(...positions);

            const groupCenterX = (minX + maxX) / 2;

            // SVG coordinate -> viewport pixel coordinate.
            const targetX =
                groupCenterX * scaleX +
                (svgRect.left - viewport.getBoundingClientRect().left) +
                viewport.scrollLeft;

            // Center the active group in the visible viewport.
            const desiredScrollLeft =
                targetX - viewport.clientWidth / 2;

            const maxScrollLeft = Math.max(
                0,
                viewport.scrollWidth - viewport.clientWidth
            );

            const nextScrollLeft = Math.max(
                0,
                Math.min(desiredScrollLeft, maxScrollLeft)
            );

            // Do not animate if the graph is already in position.
            if (
                Math.abs(viewport.scrollLeft - nextScrollLeft) > 2
            ) {
                viewport.scrollTo({
                    left: nextScrollLeft,
                    behavior: "smooth",
                });
            }
        });

        return () => {
            if (scrollFrameRef.current !== null) {
                cancelAnimationFrame(scrollFrameRef.current);
                scrollFrameRef.current = null;
            }
        };
    }, [activeParent, selected, children]);

    const selectParent = useCallback((index) => {
        pointerDownRef.current = false;
        setActiveParent(index);
        setPaused(true);
    }, []);

    const handlePointerDown = useCallback((index) => {
        pointerDownRef.current = true;
        setActiveParent(index);
        setPaused(true);
    }, []);

    useEffect(() => {
        const release = () => {
            if (pointerDownRef.current) {
                pointerDownRef.current = false;
                setPaused(false);
            }
        };

        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);

        return () => {
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
        };
    }, []);

    useEffect(() => {
        if (!isInView || paused || safeData.length < 2) {
            return;
        }

        const timer = window.setInterval(() => {
            setActiveParent(
                (current) => (current + 1) % safeData.length
            );
        }, 5000);

        return () => window.clearInterval(timer);
    }, [isInView, paused, safeData.length]);

    useEffect(() => {
        if (!isInView) {
            setPaused(true);
        } else if (!pointerDownRef.current) {
            setPaused(false);
        }
    }, [isInView]);

    const resume = () => {
        pointerDownRef.current = false;
        setPaused(false);
    };

    return (
        <section
            ref={wrapperRef}
            className="skills-graph"
            aria-label="Interactive skills graph"
        >
            <div className="sg-heading">
                <div>
                    <span className="sg-eyebrow">MY EXPERTISE</span>

                    <h2>Skills &amp; Technologies</h2>

                    <p>
                        Explore my technical skills by selecting a category.
                    </p>
                </div>

                <button
                    type="button"
                    className="sg-play-button"
                    onClick={() => {
                        pointerDownRef.current = false;
                        setPaused((value) => !value);
                    }}
                    aria-pressed={!paused}
                >
                    {paused ? "▶ Resume" : "Ⅱ Pause"}
                </button>
            </div>

            <div
                ref={viewportRef}
                className="sg-viewport"
                onPointerDownCapture={() => {
                    pointerDownRef.current = true;
                    setPaused(true);
                }}
                onPointerUpCapture={resume}
                onPointerCancel={resume}
            >
                <svg
                    ref={svgRef}
                    className="sg-canvas"
                    viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
                    role="group"
                    aria-label="Skills graph nodes and connections"
                >
                    <defs>
                        <radialGradient id="sg-root-gradient">
                            <stop offset="0%" stopColor="#174d50" />
                            <stop offset="100%" stopColor="#102331" />
                        </radialGradient>

                        <filter
                            id="sg-glow"
                            x="-80%"
                            y="-80%"
                            width="260%"
                            height="260%"
                        >
                            <feGaussianBlur
                                stdDeviation="5"
                                result="blur"
                            />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Root-to-parent edges */}
                    {parents.map((parent) => {
                        const active = parent.index === activeParent;

                        return (
                            <motion.line
                                key={`root-edge-${parent.category.name}`}
                                x1={CENTER}
                                y1={CENTER}
                                x2={parent.x}
                                y2={parent.y}
                                className={
                                    active ? "sg-edge active" : "sg-edge"
                                }
                                animate={{
                                    opacity: active ? 1 : 0.45,
                                    strokeWidth: active ? 3 : 1.5,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        );
                    })}

                    {/* Active parent-to-child edges */}
                    {selected &&
                        children.map((child) => (
                            <motion.line
                                key={`child-edge-${selected.category.name}-${child.item.name}`}
                                x1={selected.x}
                                y1={selected.y}
                                x2={child.x}
                                y2={child.y}
                                className="sg-edge sg-child-edge"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.9 }}
                                transition={{ duration: 0.25 }}
                            />
                        ))}

                    {/* Root node */}
                    <g className="sg-root-node">
                        <circle
                            cx={CENTER}
                            cy={CENTER}
                            r={ROOT_RADIUS}
                            fill="url(#sg-root-gradient)"
                            stroke={COLORS.accent}
                            strokeWidth="3"
                            filter="url(#sg-glow)"
                        />

                        <text
                            x={CENTER}
                            y={CENTER}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="sg-root-label"
                        >
                            Skills
                        </text>
                    </g>

                    {/* Parent nodes */}
                    {parents.map((parent) => {
                        const active = parent.index === activeParent;
                        const lines = splitLabel(
                            parent.category.name,
                            13
                        );

                        return (
                            <g
                                key={parent.category.name}
                                className="sg-parent-node"
                                role="button"
                                tabIndex={0}
                                aria-label={`Select ${parent.category.name}`}
                                aria-pressed={active}
                                onClick={() => selectParent(parent.index)}
                                onPointerDown={() =>
                                    handlePointerDown(parent.index)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        selectParent(parent.index);
                                    }
                                }}
                            >
                                <motion.circle
                                    cx={parent.x}
                                    cy={parent.y}
                                    r={PARENT_SIZE / 2}
                                    fill={
                                        active
                                            ? COLORS.activeParent
                                            : COLORS.parent
                                    }
                                    stroke={
                                        active
                                            ? COLORS.accent
                                            : COLORS.parentBorder
                                    }
                                    strokeWidth={active ? 4 : 2}
                                    animate={{
                                        r: active
                                            ? PARENT_SIZE / 2 + 4
                                            : PARENT_SIZE / 2,
                                    }}
                                    transition={{ duration: 0.25 }}
                                />

                                <text
                                    x={parent.x}
                                    y={
                                        parent.y -
                                        (lines.length - 1) * 7
                                    }
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="sg-parent-label"
                                >
                                    {lines.map((line, lineIndex) => (
                                        <tspan
                                            key={`${line}-${lineIndex}`}
                                            x={parent.x}
                                            dy={lineIndex === 0 ? 0 : 14}
                                        >
                                            {line}
                                        </tspan>
                                    ))}
                                </text>

                                <circle
                                    cx={parent.x}
                                    cy={parent.y}
                                    r={PARENT_SIZE / 2 + 9}
                                    className="sg-hit-area"
                                />
                            </g>
                        );
                    })}

                    {/* Active category children */}
                    {selected &&
                        children.map((child) => (
                            <motion.g
                                key={`${selected.category.name}-${child.item.name}`}
                                initial={{ opacity: 0, scale: 0.75 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.35,
                                    delay: Math.min(
                                        child.index * 0.035,
                                        0.3
                                    ),
                                }}
                                style={{
                                    transformOrigin: `${child.x}px ${child.y}px`,
                                }}
                                className="sg-child-node"
                            >
                                <circle
                                    cx={child.x}
                                    cy={child.y}
                                    r={CHILD_SIZE / 2}
                                    fill={COLORS.child}
                                    stroke={COLORS.accent}
                                    strokeWidth="1.5"
                                />

                                <foreignObject
                                    x={child.x - CHILD_SIZE / 2 + 3}
                                    y={child.y - CHILD_SIZE / 2 + 3}
                                    width={CHILD_SIZE - 6}
                                    height={CHILD_SIZE - 6}
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        className="sg-child-content"
                                        title={child.item.name}
                                    >
                                        {child.item.icon && (
                                            <span className="sg-skill-icon">
                                                {child.item.icon}
                                            </span>
                                        )}

                                        <span className="sg-skill-name">
                                            {child.item.name}
                                        </span>
                                    </div>
                                </foreignObject>
                            </motion.g>
                        ))}
                </svg>
            </div>

            <div className="sg-footer">
                <span>

                    {selected
                        ? `${selected.category.name} · ${children.length} skills`
                        : "Select a category"}
                </span>

                <span className="sg-hint">
                    Select a node to explore
                </span>
            </div>

            {/* Category selector */}
            <div
                className="sg-category-list"
                aria-label="Skill categories"
            >
                {parents.map((parent) => (
                    <button
                        key={`selector-${parent.category.name}`}
                        type="button"
                        className={
                            activeParent === parent.index
                                ? "sg-category-chip selected"
                                : "sg-category-chip"
                        }
                        onClick={() => selectParent(parent.index)}
                    >
                        {parent.category.name}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default SkillsGraph;