# Outfit Recommender System

A smart wardrobe assistant that suggests the best outfit based on weather, event type, and fuzzy style matching.

## 🚀 How It Works

This project uses a **Hybrid Algorithm** combining three advanced concepts to recommend outfits:

### 1. Constraint Satisfaction Problem (CSP)
**"The Guardrails"**
Before making ANY suggestion, the system filters out invalid combinations:
*   **Mandatory Items**: Every outfit must have a Top, Bottom, and Shoes.
*   **Safety Rules**:
    *   No "warm" clothes in **Hot** weather.
    *   **Exception**: You CAN wear sport clothes in cold weather (since you generate heat!).
    *   **Sports Event**: You MUST wear items tagged as `sport` (e.g., no formal shoes on the field).

### 2. Beam Search Generator
**"The Engine"**
Instead of checking millions of random combinations (slow), the app builds outfits step-by-step:
1.  Picks the best Tops.
2.  Tries matching Bottoms to those tops.
3.  Adds Shoes, then Outerwear.
*   At each step, it only keeps the top 50-100 best partial combinations ("beams"), making the app instant even with large wardrobes.

### 3. Fuzzy Logic Scoring
**"The Stylist"**
It doesn't just say "Yes" or "No". It assigns a score (0-100) based on how *well* things fit:

| Factor | How it helps |
| :--- | :--- |
| **Style Match** | Does the item fit the vibe? (e.g., "Casual" looks for `casual`, `street`, `outdoor` tags). |
| **Weather Fit** | "Medium" warmth is perfect for Mild weather (Score 1.0), but bad for Hot weather (Score 0.1). |
| **Formality** | Ensures all items have a similar fanciness level (Don't mix a blazer with track pants). |
| **Color Harmony** | Gives bonus points for matching or complementary colors. |

---

## 🛠️ Project Structure

*   `src/data/wardrobe.js`: The database of all your clothes, tags, and images.
*   `src/utils/outfitUtils.js`: The brain containing the CSP, Beam Search, and Fuzzy Logic code.
*   `src/components`: React UI components (Header, Controls, Results).

## 🏃‍♂️ Running the Project

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
