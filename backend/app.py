from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
# Enable CORS so React (localhost:3000) can talk to Flask (localhost:5000)
CORS(app) 

# Load the trained model
print("Loading model...")
try:
    model = joblib.load('outfit_model.pkl')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.json
    
    # We expect a JSON object with the feature names matching training data
    # The frontend must send 'weather', 'event', 'top_color', etc.
    try:
        # Wrap data in a DataFrame
        input_df = pd.DataFrame([data])
        
        # Predict
        prediction = model.predict(input_df)[0]
        
        # Clip to 0-10 range just in case
        score = max(0, min(10, prediction))
        
        return jsonify({
            'score': round(score, 1),
            'status': 'success'
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'AI Backend Running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
