# logbook

markdown content source for some writing

## Add a post

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
3. run `npm ci` and `npm run generate` locally.
   push the post to `main`. github actions validates posts and commits the
   regenerated index only when it changes

![davidchicas.me](https://davidchicas.me/) reads
`https://raw.githubusercontent.com/dchicasduena/logbook/main/posts/index.json`
and fetches each post at
`https://raw.githubusercontent.com/dchicasduena/logbook/main/posts/<slug>.md`.
the index contains `{ "posts": [{ "slug": "...", "title": "...", "date": "YYYY-MM-DD" }] }`,
ordered newest first