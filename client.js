from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from PIL import Image
from io import BytesIO
import json

app = Flask(__name__)
CORS(app)

# Load valid API keys from api-keys.json file
api_keys_path = os.path.join(app.root_path, 'api-keys.json')

with open(api_keys_path, 'r') as json_file:
    valid_api_keys = json.load(json_file)
    
@app.route('/convert', methods=['POST'])
def convert_to_grayscale():
    # Check if API key is provided in the request headers
    api_key = request.headers.get('api-key')
    print(f'Received API Key: {api_key}')
    print(f'Valid API Keys: {valid_api_keys}')

    # Print each API key for detailed comparison
    user = None
    for valid_key in valid_api_keys:
        print(f'Comparing with: {valid_key["api_key"]}')
        if api_key == valid_key["api_key"]:
            user = valid_key
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

    # Convert the image to grayscale
    grayscale_image = convert_to_grayscale(image)

    # Save the converted image with a sequential filename
    image_filename = save_image(grayscale_image)

    # Respond with success message in the headers
    success_message = f'Successfully converted to grayscale with name {image_filename}'
    return jsonify({'message': success_message}), 200

def convert_to_grayscale(image):
    print('Converting to Grayscale')
    return image.convert('L')

def save_image(image):
    # Ensure the 'images' folder exists
    images_folder = 'images'
    os.makedirs(images_folder, exist_ok=True)

    # Find the next sequential filename
    i = 1
    while os.path.exists(os.path.join(images_folder, f'{i}.png')):
        i += 1

    # Save the image with the sequential filename
    image_filename = f'{i}.png'
    image_path = os.path.join(images_folder, image_filename)
    image.save(image_path)

    return image_filename

if __name__ == '__main__':
    # Use a dynamic port for Heroku deployment
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
