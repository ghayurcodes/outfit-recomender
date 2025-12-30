# Project Report: Outfit Recommender

## 1. Project Scope & Vision
The core idea behind this project was to tackle a common daily problem: *decision fatigue* when choosing what to wear. We often have a closet full of clothes but struggle to put them together in a way that matches the weather, the occasion, and general color coordination.

The initial scope was to build a web application where a user could upload their wardrobe and get instant, valid suggestions. However, the deeper technical goal was to explore **Semantic Knowledge Representation**. We wanted to see if we could teach a computer the "rules" of fashion—first by hard-coding them (Expert System) and then by seeing if an AI could learn them on its own (Machine Learning).

## 2. Methodology: Two Approaches to Intelligence
To solve this, we implemented two distinct "brains" for the application.

### The "Expert System" (The Rule Book)
Our first approach was logic-based. In the frontend, we wrote a "Fuzzy Logic" algorithm. Unlike standard filtering (which just says Yes/No), this system calculates a "Degree of Truth."
For example, if it's 20°C (Mild) and you wear a heavy sweater, a strict system might reject it. Our fuzzy system keeps it but lowers the score slightly. We factored in four key dimensions:
1.  **Weather Compatibility**: Matching fabric warmth to temperature.
2.  **Event Appropriateness**: Ensuring you don't wear flip-flops to a formal dinner.
3.  **Color Harmony**: Using algorithms to detect clashing color families.
4.  **Formality Consistency**: Checking if the items "belong" together (e.g., avoiding a blazer with track pants).

This system works perfectly because it follows strict rules we defined. However, writing rules for every possible fashion trend is exhausting and rigid. This led us to the second approach.

### The AI Integration (The Intuition)
We wanted to see if a machine could *learn* these rules without being explicitly told what they are. This is where **Supervised Learning** comes in.

We reasoned that if we could generate a large dataset of outfits and score them using our Expert System, we could train a Neural Network to predict these scores. Essentially, the Expert System acts as the "Teacher," and the AI acts as the "Student."

## 3. Deep Dive: The AI Model Architecture
For the AI, we chose a **Multi-Layer Perceptron (MLPRegressor)** from the Scikit-Learn library. We chose a Neural Network over simpler models (like Linear Regression) because fashion is non-linear. The relationship between "Red" and "Green" isn't a straight line; it depends on the context (Christmas vs. Summer).

### Why this Architecture?
We designed the network with specific layers to balance complexity and performance:

*   **Input Layer (Preprocessing)**: We take the raw text data (Blue, Casual, Cotton) and convert it into numbers using specific "One-Hot Encoding." This turns our wardrobe attributes into about 67 distinct input signals.
*   **First Hidden Layer (50 Neurons)**: We used 50 neurons here to capture the broad, primary features. Think of this layer as learning the big rules, like "Winter needs warm clothes." 50 was chosen as it's large enough to capture these categories without making the model too slow.
*   **Second Hidden Layer (25 Neurons)**: We narrowed this down to 25 neurons to force the model to synthesize specific combinations. This layer handles the nuance, finding subtle interactions like "White sneakers can actually work with a formal suit if the event is smart-casual."
*   **Output Layer (1 Neuron)**: Finally, it condenses everything into a single number—the predicted score (0 to 10).

## 4. Comparison & Results
So, how did the "Student" do?

We created a test where we asked the AI to rate 1,000 outfits it had never seen before, and then we compared its rating to the "Teacher's" strict calculation.

*   **Accuracy**: The model achieved an **R² score of ~0.98**. In plain English, this means the AI's understanding matches the Algorithm 98% of the time.
*   **The "Human" Element**: Interestingly, the AI isn't perfectly rigid. It has an average error margin of about **0.15 points**. While the algorithm might strictly calculate a `9.0`, the AI might feel it's an `8.9` or `9.1`. This slight "fuzziness" actually feels more natural and organic, mimicking human estimation rather than robotic calculation.

### Final Verdict
By combining a React frontend for the user experience with a Python Flask backend for the intelligence, we created a system that is both **robust** (thanks to the rules) and **scalable** (thanks to the AI). We proved that fashion rules—which seem subjective—can actually be effectively learned by a Neural Network with a simple, well-designed architecture.
