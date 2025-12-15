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
                    <Link key={article.id} href={getArticleUrl(article)} className="group">
                        <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/40 backdrop-blur-sm overflow-hidden border-muted">
                            {article.image && (
                                <div className="relative h-48 w-full overflow-hidden bg-muted">
                                    {/* Using standard img tag for simplicity with local files without needing extensive next.config setup for generic paths if strict, but next/image is better. 
                                        Since these are local public files, simpe <img /> works fine/fast. 
                                    */}
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <Badge variant="secondary" className="absolute bottom-2 left-2 bg-background/80 backdrop-blur text-xs">{article.category}</Badge>
                                </div>
                            )}
                            <CardHeader className={`${article.image ? 'pt-4' : ''}`}>
                                {!article.image && (
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                                    </div>
                                )}
                                <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">{article.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                    <Calendar className="h-3 w-3" />
                                    {article.date}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                    {article.excerpt}
                                </p>
                            </CardContent>
                            <CardFooter className="flex gap-2 flex-wrap pt-0 pb-6">
                                {article.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-[10px] border-primary/20 text-primary/80">
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
