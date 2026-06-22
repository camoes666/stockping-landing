/**
 * fix-blog-images.mjs
 *
 * Keystatic saves MDX content images to src/content/blog/<slug>/content/<file>
 * but references them as bare filenames (e.g. `image.jpg`).
 * Astro's build cannot resolve these relative paths.
 *
 * This script:
 *  1. Scans every .mdx file in src/content/blog/
 *  2. Finds bare image references (no leading / or ./)
 *  3. Copies the source file to public/blog-images/<slug>/
 *  4. Rewrites the MDX reference to the absolute public path
 */

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join, basename, dirname } from "path";
import { readdirSync } from "fs";

const BLOG_DIR = "src/content/blog";
const PUBLIC_DIR = "public/blog-images";

// Match ![alt](filename.ext) where the path is a bare filename (no / prefix)
// Filename can contain backslash-escaped parens, e.g. file%20\(1\).jpg
const IMG_REGEX = /!\[([^\]]*)\]\((?!https?:\/\/)(?!\/)((?:\\.|[^()])+?\.(png|jpg|jpeg|gif|webp|svg|avif|webm))\)/gi;

let fixedCount = 0;

const mdxFiles = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

for (const mdxFile of mdxFiles) {
  const slug = mdxFile.replace(/\.mdx$/, "");
  const mdxPath = join(BLOG_DIR, mdxFile);
  let content = readFileSync(mdxPath, "utf-8");
  let changed = false;

  const matches = [...content.matchAll(IMG_REGEX)];
  if (matches.length === 0) continue;

  for (const match of matches) {
    const [fullMatch, alt, filename] = match;
    // Decode URL-encoding and backslash-escaped parens (e.g. file%20\(1\).jpg → file (1).jpg)
    const decodedFilename = decodeURIComponent(filename).replace(/\\([()])/g, "$1");

    // Look for the image in the Keystatic content directory
    const srcPath = join(BLOG_DIR, slug, "content", decodedFilename);

    if (!existsSync(srcPath)) {
      console.warn(`  ⚠️  ${slug}: source not found for "${decodedFilename}" — skipping`);
      continue;
    }

    // Sanitize filename for URL-safe public path (replace spaces, Korean chars, etc.)
    const safeFilename = decodedFilename
      .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII
      .replace(/\s+/g, "-")          // spaces → hyphens
      .replace(/-+/g, "-")           // collapse multiple hyphens
      .replace(/^-|-$/g, "")         // trim leading/trailing hyphens
      || basename(srcPath);          // fallback to original if sanitization empties it

    // Copy to public
    const destDir = join(PUBLIC_DIR, slug);
    mkdirSync(destDir, { recursive: true });
    const destPath = join(destDir, safeFilename);
    copyFileSync(srcPath, destPath);

    // Rewrite path in MDX
    const newRef = `![${alt}](/blog-images/${slug}/${safeFilename})`;
    content = content.replace(fullMatch, newRef);
    changed = true;
    fixedCount++;
    console.log(`  ✅ ${slug}: ${decodedFilename} → /blog-images/${slug}/${safeFilename}`);
  }

  if (changed) {
    writeFileSync(mdxPath, content, "utf-8");
  }
}

console.log(`\nDone. Fixed ${fixedCount} image path(s).`);
