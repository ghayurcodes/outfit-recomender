# Outfit Recommender AI

An AI-powered outfit recommendation system that combines rule-based algorithms with machine learning to score and suggest outfits based on weather, occasion, and style preferences.

## 🚀 How to Run the Project

This project uses a **Python Backend** (Flask + scikit-learn) and a **React Frontend**. Follow these steps to set up and run both servers.

### Prerequisites
- Python 3.8 or higher
- Node.js and npm
- Git (to clone the repository)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd outfit-recomender
```

#### 2. Set Up Python Backend

**Navigate to the backend folder:**
```bash
cd backend
```

**Create a virtual environment:**
```bash
# On Windows
python -m venv ../.venv

# On macOS/Linux
python3 -m venv ../.venv
```

**Activate the virtual environment:**
```bash
# On Windows (PowerShell)
../.venv/Scripts/Activate.ps1

# On Windows (Command Prompt)
../.venv\Scripts\activate.bat

# On macOS/Linux
source ../.venv/bin/activate
```

**Install Python dependencies:**
```bash
pip install -r requirements.txt
```

**Start the backend server:**
```bash
python app.py
```
You should see: `* Running on http://127.0.0.1:5000`

*Note: The trained model (`outfit_model.pkl`) is included in the repository. If you need to retrain it, run `python train_model.py` first.*

#### 3. Set Up React Frontend

**Open a NEW terminal** and navigate to the frontend folder:
```bash
cd frontend
```

**Install Node dependencies:**
```bash
npm install
```

**Start the development server:**
```bash
npm start
```
The app will automatically open in your browser at `http://localhost:3000`

### Running the Application

1. **Backend:** http://127.0.0.1:5000 (must be running)
2. **Frontend:** http://localhost:3000 (connects to backend)

Both servers must be running simultaneously for the app to work properly.

---

## 🧠 Understanding the Scores

The app provides two different scores for every outfit. Here is what they mean:

### 1. Alg (Algorithm Score) - "The Rule Book"
*   **What it is:** A strict calculation based on pre-defined logical rules written in JavaScript.
*   **How it works:** It acts like a checklist.
    *   *Is the weather Cold?* AND *Is the top Warm?* -> **+ Points**.
    *   *Is the event Formal?* AND *Are you wearing Sneakers?* -> **- Points**.
    *   *Do the colors match?* -> **+ Points**.
*   **Basis:** 100% Logic and Rules.

### 2. AI (Artificial Intelligence) - "The Intuition"
*   **What it is:** A prediction made by a **Neural Network** (Machine Learning model).
*   **How it works:** The AI doesn't know the rules explicitly. Instead, it was trained on 5,000 examples of outfits. It "studied" the patterns of what makes an outfit Good or Bad.
*   **Basis:** Statistics and Pattern Recognition. It looks at the combination of items and guesses, *"Based on what I've learned, I predict this outfit is a 9.2/10".*

### Why are they slightly different?
*   The **Alg** score is the "Ground Truth" (exact).
*   The **AI** score is an "Estimate".
*   If they are close (e.g., Alg: 9.0, AI: 8.9), it means the AI understands your fashion style well!
