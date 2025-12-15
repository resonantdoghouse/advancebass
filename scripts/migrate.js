const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_URL = 'https://advancebass.com';
const TRANSCRIPTIONS_URL = 'https://advancebass.com/category/transcriptions/';
const OUTPUT_FILE = path.join(__dirname, '../src/lib/scraped_articles.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function fetchPage(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

async function downloadFile(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const buffer = await response.arrayBuffer();
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`Downloaded file: ${filepath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading file ${url}:`, error.message);
    return false;
  }
}

async function scrapeTranscriptions() {
  console.log('Fetching transcription list...');
  const html = await fetchPage(TRANSCRIPTIONS_URL);
  const $ = cheerio.load(html);

  const articleLinks = [];
  // Select article links from the archive page
  $('article h2.entry-title a').each((i, el) => {
    articleLinks.push($(el).attr('href'));
  });

  console.log(`Found ${articleLinks.length} articles.`);

  const scrapedArticles = [];

  for (const link of articleLinks) {
    console.log(`Processing ${link}...`);
    try {
      const articleHtml = await fetchPage(link);
      const $a = cheerio.load(articleHtml);

      const title = $a('h1.entry-title').text().trim();
      const date = $a('time.entry-date').first().attr('datetime')?.split('T')[0] || new Date().toISOString().split('T')[0];
      const author = $a('span.author.vcard a').text().trim() || 'Jim Bennett';
      const slug = link.match(/\/transcriptions\/([^/]+)\/?$/)[1];

      const contentDiv = $a('.entry-content');

      // Process images
      const images = contentDiv.find('img');
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const src = $a(img).attr('src');
        if (src) {
          const ext = path.extname(src).split('?')[0] || '.jpg';
          const imageName = path.basename(src).split('?')[0];
          const safeImageName = imageName.replace(/[^a-zA-Z0-9.-]/g, '_');

          const localRelPath = `/images/transcriptions/${slug}/${safeImageName}`;
          const localFullPath = path.join(PUBLIC_DIR, `images/transcriptions/${slug}`, safeImageName);

          await downloadFile(src, localFullPath);

          $a(img).attr('src', localRelPath);
          $a(img).removeAttr('srcset');
          const parent = $a(img).parent();
          if (parent.is('a') && parent.attr('href') && parent.attr('href').match(/\.(jpg|jpeg|png|gif)$/i)) {
            parent.attr('href', localRelPath);
          }
        }
      }

      // Process PDFs
      const pdfLinks = contentDiv.find('a[href$=".pdf"]');
      for (let i = 0; i < pdfLinks.length; i++) {
        const link = pdfLinks[i];
        const href = $a(link).attr('href');
        if (href) { // Ensure href exists
          const pdfName = path.basename(href).split('?')[0];
          const safePdfName = pdfName.replace(/[^a-zA-Z0-9.-]/g, '_');

          const localRelPath = `/pdfs/transcriptions/${slug}/${safePdfName}`;
          const localFullPath = path.join(PUBLIC_DIR, `pdfs/transcriptions/${slug}`, safePdfName);

          console.log(`Found PDF: ${href} -> ${localFullPath}`);
          await downloadFile(href, localFullPath);

          $a(link).attr('href', localRelPath);
          $a(link).attr('download', ''); // Optional: force download
          $a(link).attr('target', '_blank');
        }
      }

      let content = contentDiv.html();

      if (!content) {
        console.warn(`No content found for ${link}`);
        continue;
      }

      scrapedArticles.push({
        id: `scraped-${slug}`,
        slug,
        title,
        excerpt: $a('.entry-content p').first().text().substring(0, 150) + '...',
        date,
        author,
        tags: ['Transcription'],
        category: 'Transcription',
        content,
      });

    } catch (e) {
      console.error(`Failed to process ${link}:`, e);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedArticles, null, 2));
  console.log(`Saved ${scrapedArticles.length} articles to ${OUTPUT_FILE}`);
}

scrapeTranscriptions();
