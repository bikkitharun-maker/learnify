# ⚡ Learnify — Online Learning Platform

A professional, full-featured LMS built with **React + React Bootstrap + JSON Server**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run everything (frontend + backend)
```bash
npm start
```

This runs:
- **Frontend** → http://localhost:3000
- **JSON Server (API)** → http://localhost:3001x

### Or run separately:
```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run dev
```

---

## 🔑 Demo Login
| Field    | Value               |
|----------|---------------------|
| Email    | demo@learnify.com   |
| Password | demo1234            |

---

## 📁 Project Structure

```
learnify-lms/
├── backend/
│   └── db.json              # JSON Server database (12 courses, users, enrollments)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Sticky navbar with live search & mobile menu
│   │   ├── CourseCard.jsx   # Reusable course card with enroll/watch
│   │   └── Footer.jsx       # Site footer
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth + enrollment state
│   ├── pages/
│   │   ├── Home.jsx         # Hero, courses section, features, testimonials
│   │   ├── Courses.jsx      # Full course listing with search & filters
│   │   ├── CourseDetail.jsx # Course page with video player
│   │   ├── MyCourses.jsx    # Enrolled courses + progress (protected)
│   │   ├── Login.jsx        # Login page
│   │   └── Register.jsx     # Registration with password strength
│   ├── App.jsx              # Routes + AuthProvider
│   ├── main.jsx             # React entry point
│   └── index.css            # Complete design system
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔧 Git Operations

### Initialize repository
```bash
git init
git add .
git commit -m "feat: initial Learnify LMS setup"
```

### Connect to GitHub
```bash
git remote add origin https://github.com/yourusername/learnify-lms.git
git branch -M main
git push -u origin main
```

### Typical development workflow
```bash
# Create a feature branch
git checkout -b feature/add-progress-tracking

# Make changes, then stage
git add .

# Commit with conventional commits format
git commit -m "feat: add course progress tracking"

# Push branch
git push origin feature/add-progress-tracking

# Merge to main
git checkout main
git merge feature/add-progress-tracking
git push
```

### Useful git commands used in this project
```bash
# Check status
git status

# View commit history
git log --oneline --graph

# Stash changes temporarily
git stash
git stash pop

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View diff
git diff

# Tag a release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Suggested branch structure
```
main          # Production-ready code
develop       # Integration branch
feature/*     # New features
bugfix/*      # Bug fixes
hotfix/*      # Urgent production fixes
```

---

## 🎨 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18, React Router v6     |
| Styling    | Bootstrap 5, React Bootstrap  |
| Icons      | React Icons (Feather)         |
| HTTP       | Axios                         |
| Toast      | React Toastify                |
| Backend    | JSON Server                   |
| Build      | Vite                          |

---

## ✨ Features

- 🏠 **Home** — Hero with search, stats, course preview, features, testimonials, CTA
- 🔍 **Live Search** — Typeahead suggestions in navbar + full search page with filters
- 📚 **Course Listing** — Category tabs, level filters, sort options
- 🎬 **Course Detail** — Full info, instructor bio, video player (locked until enrolled)
- 🔒 **Auth System** — Login / Register / Logout with JWT-style localStorage
- 🎓 **My Learning** — Enrolled courses with progress bars (protected route)
- 📱 **Fully Responsive** — Mobile, tablet, desktop optimized
- 🍞 **Toast Notifications** — Enroll confirmations, login feedback
- 🌙 **Dark Theme** — Deep indigo + amber premium dark design

---

## 📝 License

MIT © 2024 Learnify
