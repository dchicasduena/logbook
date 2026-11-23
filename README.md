# logbook

markdown content source for some writing

## add a post

1. create `posts/your-post-slug.md` 

   ```markdown
   ---
   title: post title
   date: 2026-11-23
   ---

   write your post here
   ```

2. use a non-empty yaml string for `title` and a real calendar date in
   `YYYY-MM-DD` format for `date`.
3. github actions will run `npm ci` and `npm run generate`after pushing to `main`
   github actions validates posts and commits the regenerated index only when it changes

[davidchicas.me](https://davidchicas.me/) reads `https://raw.githubusercontent.com/dchicasduena/logbook/main/posts/index.json`
and fetches each post at `https://raw.githubusercontent.com/dchicasduena/logbook/main/posts/<slug>.md`

the index contains `{ "posts": [{ "slug": "...", "title": "...", "date": "YYYY-MM-DD" }] }` ordered newest first

## markdown cheatsheet

# heading 1
## heading 2
### heading 3

**bold text**
*italicized text*
> blockquote

1. item one
2. item two
3. item three

- item one
- item two
- item three

`code`
---
[link](https://davidchicas.me/)
![alt text](https://dchicasduena.github.io/thirty-five-mm/assets/pictures/image-edited-04.jpg)