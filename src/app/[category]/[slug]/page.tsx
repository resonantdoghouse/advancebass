import Link from "next/link";
import { articles, getCategoryFromSlug, getCategorySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug, slug } = await params;
    const article = articles.find((a) => a.slug === slug);

    // Check if category matches
    const expectedCategorySlug = article ? getCategorySlug(article.category) : null;

    if (!article || categorySlug !== expectedCategorySlug) {
        return {
            title: "Article Not Found",
        };
    }

    return {
        title: `${article.title} | Advance Bass`,
        description: article.excerpt,
    };
}

export default async function ArticlePage({ params }: Props) {
    const { category: categorySlug, slug } = await params;
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    // Verify category matches URL
    const expectedCategorySlug = getCategorySlug(article.category);
    if (categorySlug !== expectedCategorySlug) {
        // If article exists but category is wrong, we could redirect to correct one, or 404.
        // Redirect is better for SEO if they landed on wrong link but content is same?
        // Actually, if we want strict silos, 404 is safer against duplicate content.
        // BUT, if user guessed, redirect is nice.
        // Let's redirect to canonical.
        redirect(`/${expectedCategorySlug}/${slug}`);
    }

    return (
        <div className="container py-12 max-w-4xl mx-auto px-4 md:px-8">
            <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all" asChild>
                <Link href={`/${categorySlug}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to {article.category}
                </Link>
            </Button>

            <article className="space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{article.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
                </div>

                <div className="prose prose-invert max-w-none border-t pt-8">
                    {/* 
                  In a real app, this would be MDX. 
                  For now we just render the raw HTML content if available, or placeholder.
                */}
                    {article.content && article.content.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    ) : (
                        <p>{article.content}</p>
                    )}
                    { /* Render filler text only if it's a placeholder article */}
                    {!article.id.startsWith('scraped') && (
                        <>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <h3>Why this technique works</h3>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </>
                    )}
                </div>

                <div className="border-t pt-8 mt-8">
                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-4 text-muted-foreground">
                        <Tag className="h-4 w-4" /> Related Tags
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                        {article.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
}
