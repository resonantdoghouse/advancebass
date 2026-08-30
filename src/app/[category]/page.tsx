import { Suspense } from "react";
import { getAllArticles, getCategoryFromSlug, getCategorySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TranscriptionsGrid } from "@/components/content/TranscriptionsGrid";

type Props = {
    params: Promise<{ category: string }>;
};

const CATEGORY_DISPLAY: Record<string, { plural: string; description: string }> = {
    Transcription: {
        plural: "Transcriptions",
        description:
            "Bass transcriptions for classic and modern tracks — full charts, notation, and playback to learn note-for-note.",
    },
    Lesson: {
        plural: "Lessons",
        description:
            "Free bass lessons covering technique, fretboard geography, and fundamentals — with notation, tab, and practice tips for every level.",
    },
};

function getCategoryDisplay(categoryName: string) {
    return (
        CATEGORY_DISPLAY[categoryName] ?? {
            plural: `${categoryName}s`,
            description: `Browse our ${categoryName.toLowerCase()} articles and resources.`,
        }
    );
}

export async function generateStaticParams() {
    const articles = await getAllArticles();
    const categorySlugs = new Set(articles.map((article) => getCategorySlug(article.category)));
    return Array.from(categorySlugs).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug } = await params;
    const categoryName = getCategoryFromSlug(categorySlug);

    if (!categoryName) {
        return {
            title: "Category Not Found"
        }
    }

    const { plural, description } = getCategoryDisplay(categoryName);

    return {
        title: plural,
        description,
        openGraph: {
            title: `${plural} | Advance Bass`,
            description,
            url: `/${categorySlug}`,
        },
        twitter: {
            title: `${plural} | Advance Bass`,
            description,
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category: categorySlug } = await params;

    // Explicitly handle "articles" path if we want to support /articles as "All"
    // But normally /articles shouldn't match [category] if "articles" folder existed.
    // However, we plan to keep src/app/articles for "All".
    // So this file handles OTHER categories.

    const categoryName = getCategoryFromSlug(categorySlug);

    if (!categoryName) {
        notFound();
    }

    const allArticles = await getAllArticles();
    const categoryArticles = allArticles.filter(a => a.category === categoryName);
    const { plural, description } = getCategoryDisplay(categoryName);

    return (
        <div className="container py-12 mx-auto px-4 md:px-8">
            <div className="mb-10 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">{plural}</h1>
                <p className="text-muted-foreground text-lg">
                    {description}
                </p>
            </div>

            <Suspense fallback={null}>
                <TranscriptionsGrid articles={categoryArticles} basePath={`/${categorySlug}`} />
            </Suspense>
        </div>
    );
}
