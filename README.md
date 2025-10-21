Simple To-Do List (static site)
===============================

What's included
- index.html : main page
- style.css  : styling
- app.js     : JavaScript (uses localStorage)
- README.md  : this file

Features
- Add tasks
- Edit tasks (click pencil)
- Mark complete / incomplete
- Delete tasks
- Filter: All / Active / Completed
- Tasks persist in the browser using localStorage

How to run locally
1. Open `index.html` in your browser.
2. Or serve it with a simple static server:
   - Python 3: `python3 -m http.server 8000`
   - Node: `npx serve` (if you have `serve`)

How to host online (two easy options)
1. GitHub Pages
   - Create a new repository, commit these files, push to GitHub.
   - In repo settings, enable GitHub Pages from the main branch. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

2. Netlify / Vercel
   - Drag-and-drop the folder in Netlify's dashboard or connect the GitHub repo.
   - Both services detect static sites and deploy automatically.

Notes
- Data is stored in the visitor's browser (localStorage). If you need a shared backend (multiple users syncing tasks), I can add a simple Node/Express + JSON file or Firebase integration — tell me if you want that.
