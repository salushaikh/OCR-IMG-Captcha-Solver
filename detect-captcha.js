// ==UserScript==
// @name         Captcha Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically solve image captchas using a server and API key
// @author       You
// @match        https://example.com/*  // Replace with the URL of the website where you want to run this script
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    // Replace 'your_server_url' with the actual URL where your Flask server is running
    const SERVER_URL = 'http://your_server_url/solve_captcha';

    // Replace 'your_api_key' with the actual API key you received after running the key generation script
    const API_KEY = 'your_api_key';

    // Function to check if an image is a captcha (customize based on your captcha image characteristics)
    function isCaptchaImage(image) {
        // Example: Check if the image has 'captcha' in its source URL
        return image.src.toLowerCase().includes('captcha');
    }

    // Function to fetch the captcha image data and send it to the server
    function solveCaptcha(image) {
        const captchaDataURL = getBase64Image(image);

        // Send the captcha image data to the server
        GM_xmlhttpRequest({
            method: 'POST',
            url: SERVER_URL,
            headers: {
                'Content-Type': 'application/json',
                'API-Key': API_KEY,
            },
            data: JSON.stringify({ captcha_image: captchaDataURL }),
            onload: function (response) {
                const result = JSON.parse(response.responseText);
                console.log('Captcha Text:', result.captcha_text);

                // Fill the captcha text into the text input field associated with a label containing 'captcha'
                const captchaLabel = findCaptchaLabel();
                if (captchaLabel) {
                    const associatedInput = findAssociatedInput(captchaLabel);
                    if (associatedInput) {
                        associatedInput.value = result.captcha_text;
                    }
                }
            },
            onerror: function (error) {
                console.error('Error:', error);
            },
        });
    }

    // Function to convert an image to base64 data URL
    function getBase64Image(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL('image/png');
        return dataURL;
    }

    // Function to find a label associated with 'captcha'
    function findCaptchaLabel() {
        const labels = document.getElementsByTagName('label');
        for (const label of labels) {
            if (label.textContent.toLowerCase().includes('captcha')) {
                return label;
            }
        }
        return null;
    }

    // Function to find the input associated with a label
    function findAssociatedInput(label) {
        const associatedInputId = label.getAttribute('for');
        if (associatedInputId) {
            const associatedInput = document.getElementById(associatedInputId);
            if (associatedInput && associatedInput.tagName === 'INPUT' && associatedInput.type === 'text') {
                return associatedInput;
            }
        }
        return null;
    }

    // Main function to find and solve captchas on the webpage
    function findAndSolveCaptchas() {
        const images = document.getElementsByTagName('img');

        for (const image of images) {
            if (isCaptchaImage(image)) {
                solveCaptcha(image);
                // Assuming you want to solve only one captcha; remove this line if you want to solve multiple captchas
                break;
            }
        }
    }

    // Execute the main function when the page is fully loaded
    window.addEventListener('load', findAndSolveCaptchas);
})();
