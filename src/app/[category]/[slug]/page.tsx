import Link from "next/link";
import { getArticleBySlug, getCategorySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import parse, { Element } from "html-react-parser";
import { TranscriptionImageViewer } from "@/components/content/TranscriptionImageViewer";

type Props = {
    params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug, slug } = await params;
    const article = await getArticleBySlug(slug);

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
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: "article",
            publishedTime: article.date,
            authors: [article.author],
            images: article.image ? [article.image] : [],
        },
    };
}

import { JsonLd } from "@/components/seo/JsonLd";

export default async function ArticlePage({ params }: Props) {
    const { category: categorySlug, slug } = await params;
    const article = await getArticleBySlug(slug);

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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        image: article.image ? `https://advancebass.com${article.image}` : undefined,
        datePublished: article.date,
        author: {
            "@type": "Person",
            name: article.author,
        },
    };

    return (
        <div className="container py-12 max-w-4xl mx-auto px-4 md:px-8">
            <JsonLd data={jsonLd} />
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
                    {article.content ? (
                        <div className="prose-img:my-0">
                            {(() => {
                                // Extract all images from the content string first
                                // This is a simple regex extraction. For more robustness we could parse the full tree first.
                                // Given we are using 'remark-html', the output is predictable.
                                const imgRegex = /<img[^>]+src="([^">]+)"[^>]+alt="([^">]*)"[^>]*>/g;
                                const images: { src: string; alt: string }[] = [];
                                let match;
                                while ((match = imgRegex.exec(article.content || '')) !== null) {
                                    images.push({ src: match[1], alt: match[2] });
                                }

                                let isFirstImageRendered = false;

                                return parse(article.content || '', {
                                    replace: (domNode) => {
                                        // Helper to check if node is an image
                                        const isImage = (node: any) => node instanceof Element && node.name === 'img';

                                        // Helper to check if node is a link wrapping an image
                                        const isImageLink = (node: any) =>
                                            node instanceof Element &&
                                            node.name === 'a' &&
                                            node.children.some((child: any) => isImage(child));

                                        if (isImage(domNode) || isImageLink(domNode)) {
                                            if (!isFirstImageRendered && images.length > 0) {
                                                isFirstImageRendered = true;
                                                return <TranscriptionImageViewer images={images} />;
                                            } else {
                                                // Suppress subsequent images as they are now in the viewer
                                                return <></>;
                                            }
                                        }
                                    }
                                });
                            })()}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No content available for this article.</p>
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
