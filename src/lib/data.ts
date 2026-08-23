
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Article, getCategorySlug, getCategoryFromSlug, getArticleUrl } from './article-meta';

export type { Article };
export { getCategorySlug, getCategoryFromSlug, getArticleUrl };

function deriveExcerpt(content: string): string {
    const firstParagraph = content.match(/<p>([\s\S]*?)<\/p>/);
    if (!firstParagraph) return '';
    const text = firstParagraph[1].replace(/<[^>]+>/g, '').trim();
    return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

const contentDirectory = path.join(process.cwd(), 'content');

export async function getAllArticles(): Promise<Article[]> {
    // recursively get all files or just check specific folders?
    // For now, let's assume strict structure: content/transcriptions/*.md
    // OR just search all subdirectories.

    // Check if content directory exists
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const categories = ['transcriptions']; // Add other folders as they are created
    let allArticles: Article[] = [];

    for (const categoryDir of categories) {
        const fullCategoryDir = path.join(contentDirectory, categoryDir);
        if (!fs.existsSync(fullCategoryDir)) continue;

        const fileNames = fs.readdirSync(fullCategoryDir);
        for (const fileName of fileNames) {
            if (!fileName.endsWith('.md')) continue;

            const filePath = path.join(fullCategoryDir, fileName);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const matterResult = matter(fileContents);

            const slug = fileName.replace(/\.md$/, '');

            // Extract ID from frontmatter or just use slug
            const id = matterResult.data.id || slug;

            allArticles.push({
                id,
                slug,
                title: matterResult.data.title,
                excerpt: matterResult.data.excerpt || deriveExcerpt(matterResult.content),
                date: matterResult.data.date,
                author: matterResult.data.author,
                tags: matterResult.data.tags || [],
                category: matterResult.data.category as Article['category'],
                image: matterResult.data.image,
                pages: matterResult.data.pages,
                content: matterResult.content, // Raw markdown
            });
        }
    }

    // Sort posts by date
    return allArticles.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const allArticles = await getAllArticles();
    const article = allArticles.find(a => a.slug === slug);
    if (!article) return null;

    // Process markdown to HTML
    const processedContent = await remark()
        .use(html, { sanitize: false })
        .process(article.content || '');
    const contentHtml = processedContent.toString();

    return {
        ...article,
        content: contentHtml,
    };
}
