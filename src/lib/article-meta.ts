// Pure, fs-free helpers and types split out of data.ts so client components
// (e.g. TranscriptionsGrid) can import them without pulling in the
// Node `fs`/`gray-matter`/`remark` machinery into the browser bundle.

export type Article = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    tags: string[];
    content?: string;
    image?: string;
    pages?: number;
    category: "Transcription" | "Technique" | "Gear" | "Theory";
};

export function getCategorySlug(category: Article['category']): string {
    switch (category) {
        case 'Transcription': return 'transcriptions';
        // Keep others simple for now, can adjust if needed
        default: return category.toLowerCase();
    }
}

export function getCategoryFromSlug(slug: string): Article['category'] | undefined {
    switch (slug) {
        case 'transcriptions': return 'Transcription';
        case 'technique': return 'Technique';
        case 'gear': return 'Gear';
        case 'theory': return 'Theory';
        default: return undefined;
    }
}

export function getArticleUrl(article: Article): string {
    return `/${getCategorySlug(article.category)}/${article.slug}`;
}
