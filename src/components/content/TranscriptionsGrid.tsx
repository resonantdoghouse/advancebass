"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TranscriptionCard } from "@/components/content/TranscriptionCard";
import { Article } from "@/lib/article-meta";

interface TranscriptionsGridProps {
  articles: Article[];
  basePath: string;
}

export function TranscriptionsGrid({ articles, basePath }: TranscriptionsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const allTags = useMemo(
    () => Array.from(new Set(articles.flatMap((a) => a.tags))).sort(),
    [articles]
  );

  const filteredArticles = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  const selectTag = (tag: string | null) => {
    if (!tag) {
      router.push(basePath);
    } else {
      router.push(`${basePath}?tag=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="space-y-8">
      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => selectTag(null)}>
            <Badge
              variant={activeTag ? "outline" : "default"}
              className="cursor-pointer transition-colors"
            >
              All
            </Badge>
          </button>
          {allTags.map((tag) => (
            <button key={tag} onClick={() => selectTag(tag)}>
              <Badge
                variant={activeTag === tag ? "default" : "outline"}
                className="cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article, index) => (
          <TranscriptionCard key={article.id} article={article} priority={index === 0} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <p className="text-muted-foreground">No articles found for this tag.</p>
      )}
    </div>
  );
}
