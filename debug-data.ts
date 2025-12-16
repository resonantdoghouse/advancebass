import { getAllArticles } from './src/lib/data';
import { remark } from 'remark';
import html from 'remark-html';

async function main() {
    try {
        const slug = 'daft-punk-giorgio-moroder-2';
        console.log(`Fetching raw article for slug: ${slug}`);

        const all = await getAllArticles();
        const rawArticle = all.find(a => a.slug === slug);

        if (!rawArticle) {
            console.log('Raw article not found');
            return;
        }

        console.log('Raw Content length:', rawArticle.content?.length);
        console.log('Raw Content preview:', rawArticle.content?.substring(0, 100));

        console.log('Processing with remark...');
        const processedContent = await remark()
            .use(html, { sanitize: false })
            .process(rawArticle.content || '');
        console.log('Processed Content length:', processedContent.toString().length);
        console.log('Processed Content preview:', processedContent.toString().substring(0, 100));

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
