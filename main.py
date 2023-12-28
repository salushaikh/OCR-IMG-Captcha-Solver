import os
from flask import Flask, request, jsonify
from huggingface_hub import from_pretrained_keras
import keras_ocr
from io import BytesIO
import csv

app = Flask(__name__)

# Load the Keras-OCR model
model = from_pretrained_keras("keras-io/ocr-for-captcha")

# Load API keys from the CSV file
api_keys = {}
csv_file = 'api_keys.csv'

if os.path.exists(csv_file):
    with open(csv_file, mode='r') as file:
        reader = csv.reader(file)
        api_keys = {row[1]: row[0] for row in reader}

def solve_captcha(image_data):
    # Use Keras-OCR to recognize captcha text
    predictions = model.recognize([image_data])
    captcha_text = ' '.join([word[0] for word in predictions[0]])
    return captcha_text

@app.route('/solve_captcha', methods=['POST'])
def solve_captcha_endpoint():
    try:
        # Extract API key from the request headers
        api_key = request.headers.get('API-Key')

        # Validate API key
        if api_key not in api_keys:
            return jsonify({"error": "Invalid API key"}), 401

        # Extract captcha image data from the JSON request
        captcha_image_data = request.json.get('captcha_image')

        # Solve the captcha
        captcha_text = solve_captcha(captcha_image_data)

        # Respond with the recognized captcha text
        return jsonify({"captcha_text": captcha_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Flask app
if __name__ == '__main__':
    try:
        app.run(port=5000)
    except KeyboardInterrupt:
        # Shutdown gracefully on keyboard interrupt
        print("Shutting down...")
