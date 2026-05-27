from flask import Flask ,render_template,request,redirect,jsonify  # request use when form send any requiest like get post
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS 
import os
from dotenv import load_dotenv
from models import db, AiNotes
import requests
from groq import Groq
from openai import OpenAI
import fitz  # PyMuPDF
import io
# ✅ Load environment variables from .env
load_dotenv()


frontend_origin = os.getenv("FRONTEND_URL")

app = Flask(__name__) # Create the Flask application instance
# Correct and complete CORS setup
CORS(app, supports_credentials=True, origins=[frontend_origin])

# Optional: enforce headers in every response
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", frontend_origin)
    response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE")
    return response
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

if os.environ.get("CREATE_TABLES_ON_START") == "1":
    with app.app_context():
        db.create_all()
        print("✅ Tables created successfully.")

# By using class we can define our  database schema 


# Define a route for the root URL
@app.route('/Addnotes', methods=['POST'])
def handle_notes():
    if request.method == 'POST':
        data = request.get_json()

        title = data.get("title", "")
        content = data.get("content", "")
        category = data.get("category", "")
        store = data.get("store", True)  # Default: save to DB

        if not title or not content or not category:
            return jsonify({"error": "Missing fields"}), 400

        if store:
            note = AiNotes(title=title, content=content, category=category)
            db.session.add(note)
            db.session.commit()
            return jsonify({"message": "Note saved", "note": note.to_dict()})
        
        return jsonify({
            "preview": {
                "title": title,
                "content": content,
                "category": category
            }
        })
    
    # ✅ Minimal required return for GEt
    return jsonify({"message": "GET request received. This route is for POSTing notes."}), 200

@app.route('/')
def redirect_to_frontend():
    return redirect("/Notes")


# Show
@app.route("/Notes", methods=["POST"])
def get_all_notes():
    print("POST request received at /Notes")
    all_notes = AiNotes.query.all()
    return jsonify([note.to_dict() for note in all_notes])




# Run the application '''

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_note(id):
    note = AiNotes.query.filter_by(id=id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404

    if request.method == 'POST':
        data = request.get_json()
        note.title = data.get("title", note.title)
        note.content = data.get("content", note.content)
        note.category = data.get("category", note.category)
        note.created_at = datetime.utcnow()
        db.session.commit()
        return jsonify(note.to_dict())

    return jsonify(note.to_dict())  # ✅ Ensure this returns JSON




@app.route("/debug", methods=["GET"])
def debug_notes():
    return str(AiNotes.query.count())




# Run the application
# delete
@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_note(id):
    note = AiNotes.query.get(id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted successfully"}), 200



@app.route('/show/<int:id>', methods=['GET'])
def show_note(id):
    note = AiNotes.query.filter_by(id=id).first()
    if note:
        return jsonify(note.to_dict())
    return jsonify({"error": "Note not found"}), 404



# Gemini



@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    title = data.get("title")
    content = data.get("note")  # From frontend
    category = data.get("category", "General")
    ai_category = data.get("ai_category", "Write Yourself")

    if not content:
        return jsonify({"error": "Note content is required"}), 400

    # 🧠 Common prompt
    base_prompt = f"""
📚 **Category**: {category}

🧾 **Instruction**:
You're an intelligent assistant specialized in improving study notes. Enhance the clarity, formatting, and structure of the note below. Follow these rules strictly:

1. 📝 Format everything using **Markdown**.
2. 📌 Use `#`, `##`, `###` for headings and subheadings.
3. ✅ Use bullet points (`-`) or numbered lists where needed.
4. 💡 Bold key terms or definitions using `**` for quick scanning.
4. 💡 Bold key terms.
5. 🔍 Insert emojis (✅, 💡, ❗, 📘, 🔢) to guide the reader.

---

🔤 **Original Note**:
{content}
"""

    # ✅ 1. Groq manual logic
    if ai_category == "Groq":
        try:
          
            return jsonify({"generated_content": f"{content}\n\n"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ✅ 2. Google Gemini API
    # elif ai_category == "Google Gemini":
    #     try:
    #         gemini_payload = {
    #             "contents": [{"parts": [{"text": base_prompt}]}]
    #         }

    #         headers = {
    #             "Content-Type": "application/json",
    #             "X-goog-api-key": os.environ.get("GEMINI_API_KEY")
    #         }

    #         gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    #         response = requests.post(gemini_url, headers=headers, json=gemini_payload)
    #         response.raise_for_status()

    #         gemini_content = response.json()["candidates"][0]["content"]["parts"][0]["text"]
    #         return jsonify({"generated_content": gemini_content}), 200

    #     except Exception as e:
    #         return jsonify({"error": "Gemini API failed", "details": str(e)}), 500

    # ✅ 3. Claude or ChatGPT via Groq
    if ai_category in ["Claude", "ChatGPT", "LLaMA", "Google Gemini","DeepSeek"]:
        # ✅ AI generation using OpenAI-compatible models via Groq
        try:
            client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=os.environ.get("GROQ_API_KEY")
            )

            # Set model based on selected AI category
            model = {
                "DeepSeek":"deepseek-r1-distill-llama-70b",
                "LLaMA": "llama3-70b-8192",
                "Google Gemini": "gemma2-9b-it",
                "Mixtral": "mixtral-8x7b-32768"
            }.get(ai_category, "llama3-70b-8192") # default fallback

            response = client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that formats and enhances study notes."
                    },
                    {
                        "role": "user",
                        "content": base_prompt
                    }
                ],
                temperature=0.7
            )

            ai_output = response.choices[0].message.content
            return jsonify({"generated_content": ai_output}), 200

        except Exception as e:
            return jsonify({"error": "AI generation failed", "details": str(e)}), 500

    # ✏️ 4. Fallback
    return jsonify({"generated_content": content + "\n\n(No AI enhancement applied)"}), 200




@app.route('/generate-pdf', methods=['POST'])
def generate_pdf_ai():
    file = request.files.get('file')
    category = request.form.get('category')
    ai_category = request.form.get('ai_category')

    if not file or file.filename == '':
        return jsonify({"error": "No file uploaded"}), 400
    if not category or not ai_category:
        return jsonify({"error": "Missing fields"}), 400

    try:
        # ✅ Read file in memory using BytesIO
        pdf_bytes = file.read()
        pdf_stream = io.BytesIO(pdf_bytes)

        text = ""
        with fitz.open(stream=pdf_stream, filetype="pdf") as pdf:
            for page in pdf:
                text += page.get_text()

        prompt = f"Category: {category}\nAI Category: {ai_category}\n\n{text}\n\nSummarize or convert this content to notes:"
        output = dummy_ai_generate(prompt)

        return jsonify({"output": output})

    except Exception as e:
        print("PDF Processing Error:", e)
        return jsonify({"error": "Could not read PDF"}), 500

def dummy_ai_generate(prompt):
    return f"[AI OUTPUT BASED ON PROMPT]\n\n{prompt[:400]}..."

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render provides PORT env variable
    app.run(host='0.0.0.0', port=port)



