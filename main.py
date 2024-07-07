from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import base64
from PIL import Image
from io import BytesIO
import pytesseract

pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

app = Flask(__name__)
CORS(app)

# Load valid API keys from api-keys.json file
api_keys_path = os.path.join(app.root_path, 'api-keys.json')

with open(api_keys_path, 'r') as json_file:
    valid_api_keys = json.load(json_file)

@app.route('/solve', methods=['POST'])
def solve_captcha():
    # Check if API key is provided in the request headers
    api_key = request.headers.get('api-key')
    print(f'Received API Key: {api_key}')
    print(f'Valid API Keys: {valid_api_keys}')

    # Print each API key for detailed comparison
    for valid_key in valid_api_keys:
        print(f'Comparing with: {valid_key["api_key"]}')
        if api_key == valid_key["api_key"]:
            print('API Key is valid!')
            break
    else:
        print('Invalid API Key!')
        return jsonify({'error': 'Invalid API key'}), 401

    # Check if 'image' data is present in the JSON payload
    if 'image' not in request.json:
        return jsonify({'error': 'No image data provided'}), 400

    # Decode base64-encoded image data
    base64_image_data = request.json['image']
    image_data = base64.b64decode(base64_image_data)
    image = Image.open(BytesIO(image_data))

    # Resolve captcha using pytesseract
    captcha_text = resolve_captcha(image)

    # Update the API key balance after a successful API call
    for user in valid_api_keys:
        if user['api_key'] == api_key:
            if user['subscription_plan'].lower() == 'limited':
                user['balance'] -= 1  # Deduct one from the balance for the Limited plan
                if user['balance'] == 0:
                    # If balance is exhausted, reject the request
                    return jsonify({'error': 'Balance exhausted'}), 402
            break

    # Save the updated users to the api-keys.json file
    with open('api-keys.json', 'w') as f:
        json.dump(valid_api_keys, f)

    return jsonify({
        'predictedText': captcha_text,
        'subscription_plan': user['subscription_plan'],
        'balance': user['balance']
    })

def resolve_captcha(image):
    print('Resolving Captcha')
    # You can customize the resolution logic here
    # For example, you can preprocess the image or apply additional settings
    return pytesseract.image_to_string(image)

if __name__ == '__main__':
    # Use a dynamic port for Heroku deployment
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
