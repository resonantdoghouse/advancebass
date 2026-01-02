import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";
import { Article, getArticleUrl } from "@/lib/data";

interface TranscriptionCardProps {
    article: Article;
}

export function TranscriptionCard({ article }: TranscriptionCardProps) {
    return (
        <Link href={getArticleUrl(article)} className="group h-full">
            <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/40 backdrop-blur-sm overflow-hidden border-muted">
                {article.image && (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
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
                        {article.pages && (
                            <>
                                <span>•</span>
                                <FileText className="h-3 w-3" />
                                {article.pages} {article.pages === 1 ? 'Page' : 'Pages'}
                            </>
                        )}
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
    );
}
