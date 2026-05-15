# Editing Website Content

Most editable portfolio content now lives in `content.json`.

Use it for:
- Homepage text and hero image paths
- Project titles, summaries, tags, modules, captions, and case-study copy
- Project image paths
- About page copy
- Third Tone page copy and image
- Contact links, email, and location
- Focus areas and software lists
- Portfolio PDF path

Keep these rules in mind:
- Text values must stay inside double quotes.
- Every list item needs a comma after it, except the last item in that list.
- Image paths should point to files inside the project, usually `assets/img/...`.
- After editing `content.json`, refresh `http://localhost:4173/`.
- If the page shows a content loading message, the JSON likely has a missing comma or quote.

The visual layout still lives in:
- `styles.css` for colours, spacing, typography, and responsive layout
- `script.js` for the page templates and interactions
- `index.html` for metadata, navigation, and footer structure
