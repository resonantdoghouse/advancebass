import Link from "next/link";
import Image from "next/image";
import { getAllArticles, getCategoryFromSlug, getArticleUrl } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { TranscriptionCard } from "@/components/content/TranscriptionCard";

type Props = {
    params: Promise<{ category: string }>;
};

const CATEGORY_DISPLAY: Record<string, { plural: string; description: string }> = {
    Transcription: {
        plural: "Transcriptions",
        description:
            "Bass transcriptions for classic and modern tracks — full charts, notation, and playback to learn note-for-note.",
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryArticles.map((article, index) => (
                    <TranscriptionCard key={article.id} article={article} priority={index === 0} />
                ))}
            </div>

            {categoryArticles.length === 0 && (
                <p className="text-muted-foreground">No articles found in this category.</p>
            )}
        </div>
    );
}
