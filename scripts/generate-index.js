const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const postsDirectory = path.join(__dirname, "..", "posts");
const indexPath = path.join(postsDirectory, "index.json");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

function findPostFiles(directory, relativeDirectory = "") {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findPostFiles(path.join(directory, entry.name), relativePath));
    } else if (entry.name.toLowerCase().endsWith(".md")) {
      if (!entry.isFile() || relativeDirectory || !entry.name.endsWith(".md")) {
        throw new Error(`${relativePath}: posts must be regular files directly under posts/ with a .md extension`);
      }
      files.push(entry.name);
    }
  }
  return files;
}

function generateIndex() {
  const seenSlugs = new Set();
  const posts = [];
  const filenames = findPostFiles(postsDirectory).sort();
  for (const filename of filenames) {
    const slug = filename.slice(0, -3);
    const normalizedSlug = slug.toLowerCase();
    if (seenSlugs.has(normalizedSlug)) {
      throw new Error(`${filename}: duplicate slug "${normalizedSlug}"`);
    }
    seenSlugs.add(normalizedSlug);
  }
  for (const filename of filenames) {
    const slug = filename.slice(0, -3);
    if (!slugPattern.test(slug)) {
      throw new Error(`${filename}: slug must contain lowercase letters or numbers separated by single hyphens`);
    }

    const content = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
    const frontmatter = content.match(/^---\r?\n([\s\S]*?)^---(?:\r?\n|$)/m);
    if (!frontmatter || frontmatter.index !== 0) {
      throw new Error(`${filename}: missing or invalid YAML frontmatter`);
    }
    const document = YAML.parseDocument(frontmatter[1], { uniqueKeys: true });
    if (document.errors.length) {
      throw new Error(`${filename}: invalid YAML frontmatter: ${document.errors.map((error) => error.message).join("; ")}`);
    }
    const data = document.toJS();
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error(`${filename}: frontmatter must be a YAML mapping`);
    }
    if (typeof data.title !== "string" || !data.title.trim()) {
      throw new Error(`${filename}: title must be a non-empty string`);
    }
    if (!isValidDate(data.date)) {
      throw new Error(`${filename}: date must be a valid calendar date in YYYY-MM-DD format`);
    }
    posts.push({ slug, title: data.title, date: data.date });
  }
  posts.sort((a, b) => b.date.localeCompare(a.date) || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
  fs.writeFileSync(indexPath, `${JSON.stringify({ posts }, null, 2)}\n`);
}

try {
  generateIndex();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
