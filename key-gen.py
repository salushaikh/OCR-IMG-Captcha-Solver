import argparse
import csv
import uuid

def generate_api_key(username):
    # Generate a unique API key using UUID
    api_key = str(uuid.uuid4())

    # Print the API key on the console
    print(f"Generated API key for {username}: {api_key}")

    # Append the username and API key to a CSV file
    with open('api_keys.csv', mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([username, api_key])

if __name__ == '__main__':
    # Create an argument parser
    parser = argparse.ArgumentParser(description='Generate API key for a given username.')

    # Add command line arguments
    parser.add_argument('-u', '--username', required=True, help='Username for which to generate the API key')

    # Parse the command line arguments
    args = parser.parse_args()

    # Generate and print the API key
    generate_api_key(args.username)
