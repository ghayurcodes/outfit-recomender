# Outfit Recommender AI

## 🚀 How to Run the Project

This project uses a **Python Backend** (for AI) and a **React Frontend** (for UI). You need to run both in separate terminals.

### 1. Start the Backend (AI Server)
The backend runs on port `5000`.
1. Open a terminal.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Run the server:
   ```bash
   python app.py
   ```
   *(You should see "Running on http://127.0.0.1:5000")*

### 2. Start the Frontend (React App)
The frontend runs on port `3000`.
1. Open a **new** terminal.
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Start the app:
   ```bash
   npm start
   ```

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
