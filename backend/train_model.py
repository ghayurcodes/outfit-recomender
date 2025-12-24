import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# 1. Load Data
print("Loading dataset...")
df = pd.read_csv('dataset.csv')

# 2. Preprocessing
print("Preprocessing...")
X = df.drop('score', axis=1)
y = df['score']

categorical_features = [
    'weather', 'event',
    'top_color', 'top_substyle', 'top_warmth', 'top_formality',
    'bottom_color', 'bottom_substyle', 'bottom_warmth', 'bottom_formality',
    'shoes_color', 'shoes_substyle', 'shoes_warmth', 'shoes_formality',
    'outer_color', 'outer_substyle', 'outer_warmth', 'outer_formality'
]

# We use OneHotEncoder for all categorical features.
# handle_unknown='ignore' ensures the model doesn't crash if it sees a new color/style in production.
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# 3. Define Model (Simple Neural Network)
# MLPRegressor with 1 hidden layer of 50 neurons.
# 'relu' activation is standard. 'adam' solver is efficient.
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', MLPRegressor(hidden_layer_sizes=(50, 25), activation='relu', solver='adam', max_iter=500, random_state=42))
])

# 4. Train
print("Training Neural Network...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluate
print("Evaluating...")
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"\n--- Model Performance ---")
print(f"Mean Absolute Error: {mae:.2f}")
print(f"Root Mean Squared Error: {rmse:.2f}")
print(f"R² Score: {r2:.2f}")

# 6. Generate Graphs
print("Generating Performance Graphs...")
plt.figure(figsize=(10, 5))

# Graph 1: Actual vs Predicted
plt.subplot(1, 2, 1)
sns.scatterplot(x=y_test, y=y_pred, alpha=0.5)
plt.plot([0, 10], [0, 10], 'r--') # Perfect prediction line
plt.xlabel("Actual Score")
plt.ylabel("Predicted Score")
plt.title("Actual vs Predicted (Test Set)")

# Graph 2: Residuals
plt.subplot(1, 2, 2)
residuals = y_test - y_pred
sns.histplot(residuals, kde=True)
plt.xlabel("Error (Residual)")
plt.title("Error Distribution")

plt.tight_layout()
plt.savefig('model_performance.png')
print("Graph saved to model_performance.png")

# 7. Save Model
print("Saving model...")
joblib.dump(model, 'outfit_model.pkl')
print("Model saved to outfit_model.pkl")
