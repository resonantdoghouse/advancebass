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

export const articles: Article[] = [
    {
        "id": "scraped-daft-punk-giorgio-moroder-2",
        "slug": "daft-punk-giorgio-moroder-2",
        "title": "Giorgio By Moroder – Daft Punk – Two-Hand Tapping",
        "excerpt": "...",
        "date": "2025-12-15",
        "author": "Jim Bennett",
        "tags": [
            "Transcription"
        ],
        "category": "Transcription",
        "image": "/images/transcriptions/daft-punk-giorgio-moroder-2/Giorgio-by-Moroder1-724x1024.png",
        "content": "<p><a href=\"/images/transcriptions/daft-punk-giorgio-moroder-2/Giorgio-by-Moroder1-724x1024.png\"><img decoding=\"async\" class=\"aligncenter size-large wp-image-107\" src=\"/images/transcriptions/daft-punk-giorgio-moroder-2/Giorgio-by-Moroder1-724x1024.png\" alt=\"Giorgio by Moroder\" width=\"724\" height=\"1024\" sizes=\"(max-width: 724px) 100vw, 724px\"></a></p>\n"
    },
    {
        "id": "scraped-x-files-theme-5-string-bass",
        "slug": "x-files-theme-5-string-bass",
        "title": "The X-Files Theme – 5 String Bass",
        "excerpt": "  ...",
        "date": "2025-12-15",
        "author": "Jim Bennett",
        "tags": [
            "Transcription"
        ],
        "category": "Transcription",
        "image": "/images/transcriptions/x-files-theme-5-string-bass/X-Files-Theme-5-String-Bass-1-724x1024.png",
        "content": "<p><a href=\"/images/transcriptions/x-files-theme-5-string-bass/X-Files-Theme-5-String-Bass-1-724x1024.png\"><img decoding=\"async\" class=\"aligncenter size-large wp-image-101\" src=\"/images/transcriptions/x-files-theme-5-string-bass/X-Files-Theme-5-String-Bass-1-724x1024.png\" alt=\"X Files Theme - 5 String Bass 1\" width=\"724\" height=\"1024\" sizes=\"(max-width: 724px) 100vw, 724px\"></a> <a href=\"/images/transcriptions/x-files-theme-5-string-bass/X-Files-Theme-5-String-Bass-2-724x1024.png\"><img decoding=\"async\" class=\"aligncenter size-large wp-image-102\" src=\"/images/transcriptions/x-files-theme-5-string-bass/X-Files-Theme-5-String-Bass-2-724x1024.png\" alt=\"X Files Theme - 5 String Bass 2\" width=\"724\" height=\"1024\" sizes=\"(max-width: 724px) 100vw, 724px\"></a> <a href=\"/images/transcriptions/x-files-theme-5-string-bass/X-Files-Theme-5-String-Bass-3-724x1024.png\"><img loading=\"lazy\" decoding=\"async\" class=\"aligncenter size-large wp-image-103\" src=\"/images/transcriptions/x-files-theme-5-string-bass/X-Files-Theme-5-String-Bass-3-724x1024.png\" alt=\"X Files Theme - 5 String Bass 3\" width=\"724\" height=\"1024\" sizes=\"auto, (max-width: 724px) 100vw, 724px\"></a></p>\n"
    },
    {
        "id": "scraped-walking-dead-main-theme-tabs",
        "slug": "walking-dead-main-theme-tabs",
        "title": "The Walking Dead – Main Theme – Tabs",
        "excerpt": "   ...",
        "date": "2025-12-15",
        "author": "Jim Bennett",
        "tags": [
            "Transcription"
        ],
        "category": "Transcription",
        "image": "/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-1-724x1024.png",
        "content": "<p><a href=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-1-724x1024.png\"><img decoding=\"async\" class=\"aligncenter size-large wp-image-94\" src=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-1-724x1024.png\" alt=\"The Walking Dead page 1\" width=\"724\" height=\"1024\" sizes=\"(max-width: 724px) 100vw, 724px\"></a> <a href=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-2-1-724x1024.png\"><img decoding=\"async\" class=\"aligncenter size-large wp-image-95\" src=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-2-1-724x1024.png\" alt=\"The Walking Dead page 2 (1)\" width=\"724\" height=\"1024\" sizes=\"(max-width: 724px) 100vw, 724px\"></a> <a href=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-2-724x1024.png\"><img loading=\"lazy\" decoding=\"async\" class=\"aligncenter size-large wp-image-96\" src=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-2-724x1024.png\" alt=\"The Walking Dead page 2\" width=\"724\" height=\"1024\" sizes=\"auto, (max-width: 724px) 100vw, 724px\"></a> <a href=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-3-724x1024.png\"><img loading=\"lazy\" decoding=\"async\" class=\"aligncenter size-large wp-image-97\" src=\"/images/transcriptions/walking-dead-main-theme-tabs/The-Walking-Dead-page-3-724x1024.png\" alt=\"The Walking Dead page 3\" width=\"724\" height=\"1024\" sizes=\"auto, (max-width: 724px) 100vw, 724px\"></a></p>\n"
    },
    {
        "id": "scraped-bourree-in-e-minor-bwv-996-electric-bass",
        "slug": "bourree-in-e-minor-bwv-996-electric-bass",
        "title": "Bourrée in E minor, BWV 996, Electric Bass",
        "excerpt": "...",
        "date": "2025-12-15",
        "author": "Jim Bennett",
        "tags": [
            "Transcription"
        ],
        "category": "Transcription",
        "image": "/images/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor000-791x1024.jpg",
        "content": "<p><a href=\"/images/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor000-791x1024.jpg\"><img decoding=\"async\" class=\"aligncenter size-large wp-image-69\" src=\"/images/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor000-791x1024.jpg\" alt=\"Bouree in e minor000\" width=\"791\" height=\"1024\" sizes=\"(max-width: 791px) 100vw, 791px\"></a></p>\n<hr>\n<p><a href=\"/images/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor002-791x1024.jpg\"><img decoding=\"async\" class=\"aligncenter size-large wp-image-70\" src=\"/images/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor002-791x1024.jpg\" alt=\"Bouree in e minor002\" width=\"791\" height=\"1024\" sizes=\"(max-width: 791px) 100vw, 791px\"></a></p>\n<hr>\n<p><a href=\"/images/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor003-791x1024.jpg\"><img loading=\"lazy\" decoding=\"async\" class=\"aligncenter size-large wp-image-71\" src=\"/images/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor003-791x1024.jpg\" alt=\"Bouree in e minor003\" width=\"791\" height=\"1024\" sizes=\"auto, (max-width: 791px) 100vw, 791px\"></a></p>\n<hr>\n<p>Bach arranged for 4-String Bass. This arrangement is meant for 2-hand tapping but you could separate and play each line individually.</p>\n<p><a href=\"/pdfs/transcriptions/bourree-in-e-minor-bwv-996-electric-bass/Bouree-in-e-minor.pdf\" target=\"_blank\" download=\"\">Bouree in e minor – PDF</a></p>\n"
    },
    {
        "id": "scraped-aerodynamic-daft-punk-bass-arrangement",
        "slug": "aerodynamic-daft-punk-bass-arrangement",
        "title": "Aerodynamic: Daft Punk – Bass Arrangement",
        "excerpt": "...",
        "date": "2025-12-15",
        "author": "Jim Bennett",
        "tags": [
            "Transcription"
        ],
        "category": "Transcription",
        "image": "/images/transcriptions/aerodynamic-daft-punk-bass-arrangement/Aerodynamic_1.png",
        "content": "<p><a href=\"/images/transcriptions/aerodynamic-daft-punk-bass-arrangement/Aerodynamic_1.png\"><img decoding=\"async\" class=\"aligncenter size-full wp-image-66\" src=\"/images/transcriptions/aerodynamic-daft-punk-bass-arrangement/Aerodynamic_1.png\" alt=\"Aerodynamic_1\" width=\"793\" height=\"8210\" sizes=\"(max-width: 793px) 100vw, 793px\"></a></p>\n<p>Arrangement transcribed from Daft Punk: Aerodymnic, arranged for 4-part Bass.</p>\n<p><a href=\"/pdfs/transcriptions/aerodynamic-daft-punk-bass-arrangement/Aerodynamic.pdf\" download=\"\" target=\"_blank\">Aerodynamic – PDF</a></p>\n"
    },
    {
        "id": "scraped-voyager-daft-punk-bass-arrangement",
        "slug": "voyager-daft-punk-bass-arrangement",
        "title": "Voyager: Daft Punk – Bass Arrangement",
        "excerpt": "...",
        "date": "2025-12-15",
        "author": "Jim Bennett",
        "tags": [
            "Transcription"
        ],
        "category": "Transcription",
        "image": "/images/transcriptions/voyager-daft-punk-bass-arrangement/Voyager-Basic-Parts.png",
        "content": "<p><a href=\"/images/transcriptions/voyager-daft-punk-bass-arrangement/Voyager-Basic-Parts.png\"><img decoding=\"async\" class=\"aligncenter size-full wp-image-63\" src=\"/images/transcriptions/voyager-daft-punk-bass-arrangement/Voyager-Basic-Parts.png\" alt=\"Voyager Basic Parts\" width=\"793\" height=\"4808\" sizes=\"(max-width: 793px) 100vw, 793px\"></a></p>\n"
    }
];
