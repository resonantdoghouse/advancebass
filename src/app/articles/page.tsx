import Link from "next/link";
import { articles } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

export default function ArticlesPage() {
    return (
        <div className="container py-12 mx-auto px-4 md:px-8">
            <div className="mb-10 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Articles & Resources</h1>
                <p className="text-muted-foreground text-lg">
                    Explore our collection of transcriptions, guides, and theory lessons.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`}>
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
        </div>
    );
}
