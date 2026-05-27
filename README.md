# 🧠 AI Notes - Intelligent Note-Taking Platform

📌 **AI Notes** is a full-stack intelligent note-taking web app built with **Next.js (Frontend)** and **Flask (Backend)**. This app enables users to create, edit, store, and enhance notes using powerful AI models such as **Gemini**, **Groq**, **LLaMA**, **OpenAI**, and **DeepSeek**. Users can even upload PDFs, get summaries, rewrite content, or ask structured AI prompts to generate well-organized notes in 📄 **Markdown** format.

> ✨ Built solo with  by [Atharva Karemore]

---

## 🔗 Live Demo

  🌐 **Visit Here**: [AI Notes Frontend](https://ai-notes-front.vercel.app))  

---

## 🚀 Features

- ✍️ Create, view, edit, and delete rich-text notes
- 🤖 Enhance your notes using AI (Summarize, Structure, Format, etc.)
- 📥 Upload PDF files and extract content
- 🧾 Supports Markdown syntax with live preview
- 🧠 AI Models used:
  - 🔹 Gemini
  - 🟪 Groq
  - 🐑 LLaMA
  - 🧠 OpenAI (GPT)
  - 🟡 DeepSeek
- 💬 Prompt-based interaction with AI
- ⬇️ Export notes as PDF
- 🌙 Beautiful dark-themed UI with modern animations
- 💻 Fully responsive (📱 Mobile + 💻 Desktop)

---

## 🛠️ Tech Stack

### 🌐 Frontend – `Next.js`, `TypeScript`, `Tailwind CSS`
- Animations: **Framer Motion**, **GSAP**,**Aceternity UI**
- Markdown Editor: `react-markdown`, `textarea-autosize`
- Toasts & Alerts: `react-hot-toast`, `radix-ui`

### ⚙️ Backend – `Flask`, `Python 3.12`
- AI Integration: Calls local/remote AI models
- File Upload: Handles PDF/image inputs
- Data Storage: `PostgreSQL` or `SQLite`
- API: RESTful endpoints to CRUD notes and interact with AI

---

## 📂 Project Structure

AI-Notes/
│
├── ai-notes-frontend/ # Next.js Frontend
│ ├── components/
│ ├── pages/
│ └── ...
│
├── ai-notes-backend/ # Flask Backend
│ ├── app.py
│ ├── models.py
│ ├── routes/
│ └── requirements.txt
│
└── README.md

yaml
Copy
Edit

---

## 📝 How It Works

1. **Create or Upload** a note manually or via PDF
2. **Choose an AI Model** (Gemini, Groq, LLaMA, etc.)
3. **Prompt the AI** or click `Generate` for auto-suggestions
4. **Edit in Markdown** or use visual live preview
5. **Save the note** in the database
6. **Download as PDF**, or return later to continue editing

---

## 📦 Installation

### Backend (Flask + Python)
```bash
cd ai-notes-backend
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
pip install -r requirements.txt
python app.py
📄 requirements.txt:

graphql
Copy
Edit
Flask
flask_cors
Flask_SQLAlchemy
python-dotenv
PyMuPDF  # For PDF text extraction
Frontend (Next.js)
bash
Copy
Edit
cd ai-notes-frontend
npm install
npm run dev
🌍 Deployment
🚀 Frontend deployed on Vercel

🌐 Backend deployed on Render

📸 Screenshots
📝 Note Editor	📄 PDF Upload	🤖 AI Generate

🧠 AI Model Capabilities
Model	Description
🔹 Gemini	Google’s multimodal AI for summarization and smart Q&A
🟪 Groq	Ultra-fast inference, great for large documents
🐑 LLaMA	Meta’s language model for general-purpose text generation
🧠 OpenAI	GPT-based responses for structured note transformation
🟡 DeepSeek	Ideal for technical, educational, or code-related summarization

📌 Future Plans
🗂️ AI-based categorization of notes


🧑‍🎓 Student mode with syllabus summarization

🙋‍♂️ Author
👤 Atharva Karemore
📧 Email: [karemoreatharva@gmail.com]

