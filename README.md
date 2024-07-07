# OCR-IMG-Captcha-Solver

This project implements a server-side OCR (Optical Character Recognition) solution for solving image CAPTCHAs using Flask. It includes a client-side script to capture CAPTCHA images and send them to the server for processing.

### Project Overview

The OCR image CAPTCHA solver project utilizes pytesseract, a Python wrapper for Google's Tesseract-OCR Engine, to decode CAPTCHA images. The server-side application is built using Flask, a lightweight WSGI web application framework. On the client side, a JavaScript script is used with Tampermonkey to interact with the server.

### Features

- **Server-side (main.py):**
  - **API Endpoint (`/solve`)**: Accepts POST requests with a base64-encoded CAPTCHA image, validates API keys, and resolves the CAPTCHA using pytesseract.
  - **API Key Management**: Handles API key validation and deducts usage from the balance based on subscription plans stored in `api-keys.json`.

- **Client-side (client.js):**
  - **API Endpoint (`/convert`)**: Sends base64-encoded CAPTCHA images to the server for conversion and processing.
  - **Cross-Origin Resource Sharing (CORS)**: Allows the client to interact with the server from different domains.

### Requirements

To run the project, ensure you have the following dependencies installed:

- Python 3.x
- Flask
- Flask-CORS
- Pillow (PIL)
- pytesseract
- A web browser with Tampermonkey installed (for client-side interaction)

### Setup and Usage

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ocr-image-captcha-solver.git
   cd ocr-image-captcha-solver
   ```

2. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure pytesseract Path:**
   Modify `pytesseract.pytesseract.tesseract_cmd` in `main.py` to point to your Tesseract executable path.

4. **Run the Server:**
   ```bash
   python main.py
   ```

5. **Client Usage:**
   - Include the client.js script in your web browser using Tampermonkey or another userscript manager.
   - Ensure the API endpoints (`/solve` and `/convert`) are accessible from your client environment.

### API Key Management

API keys and subscription plans are managed using `api-keys.json`. Ensure this file is correctly configured with valid keys and plans before running the server.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Authors

- Saleha Shaikh

### Acknowledgments

Special thanks to the developers of Flask, pytesseract, and the contributors to the open-source community.
