import Link from "next/link";
import { articles, getCategoryFromSlug, getArticleUrl } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug } = await params;
    const categoryName = getCategoryFromSlug(categorySlug);

    if (!categoryName) {
        return {
            title: "Category Not Found"
        }
    }

    return {
        title: `${categoryName} | Advance Bass`,
        description: `Browse our ${categoryName.toLowerCase()} articles and resources.`,
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

    const categoryArticles = articles.filter(a => a.category === categoryName);

    return (
        <div className="container py-12 mx-auto px-4 md:px-8">
            <div className="mb-10 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">{categoryName}</h1>
                <p className="text-muted-foreground text-lg">
                    Latest {categoryName.toLowerCase()} articles.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryArticles.map((article) => (
                    <Link key={article.id} href={getArticleUrl(article)}>
                        <Card className="h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer bg-card/50">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                                </div>
                                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                    <Calendar className="h-3 w-3" />
                                    {article.date}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {article.excerpt}
                                </p>
                            </CardContent>
                            <CardFooter className="flex gap-2 flex-wrap">
                                {article.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-[10px]">
                                        {tag}
                                    </Badge>
                                ))}
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>

            {categoryArticles.length === 0 && (
                <p className="text-muted-foreground">No articles found in this category.</p>
            )}
        </div>
    );
}
