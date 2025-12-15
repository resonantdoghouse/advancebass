export type Article = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    tags: string[];
    content?: string;
    category: "Transcription" | "Technique" | "Gear" | "Theory";
};

export const articles: Article[] = [
    {
        id: "1",
        slug: "slap-bass-fundamentals",
        title: "Slap Bass Fundamentals: Getting Started",
        excerpt: "Master the basics of thumb technique and popping with these essential exercises.",
        date: "2025-01-15",
        author: "Jim Bennett",
        tags: ["Technique", "Slap", "Beginner"],
        category: "Technique",
        content: "Content placeholder for slap bass...",
    },
    {
        id: "2",
        slug: "modern-tone-guide",
        title: "Guide to Modern Bass Tone",
        excerpt: "Understanding compression, saturation, and EQ for a punchy modern sound.",
        date: "2025-02-01",
        author: "Jim Bennett",
        tags: ["Gear", "Tone", "Production"],
        category: "Gear",
        content: "Content placeholder for tone guide...",
    },
    {
        id: "3",
        slug: "dual-lipa-dont-start-now",
        title: "Transcription: Don't Start Now - Dua Lipa",
        excerpt: "A deep dive into the groove that defined 2020. Accurate tabs and analysis.",
        date: "2025-01-20",
        author: "Jim Bennett",
        tags: ["Transcription", "Pop", "Disco"],
        category: "Transcription",
        content: "Content placeholder for transcription...",
    },
    {
        id: "4",
        slug: "chromatic-approach-notes",
        title: "Using Chromatic Approach Notes",
        excerpt: "Spice up your walking bass lines and fills with chromaticism.",
        date: "2025-02-10",
        author: "Jim Bennett",
        tags: ["Theory", "Jazz", "Walking Bass"],
        category: "Theory",
        content: "Content placeholder for theory...",
    },
];
