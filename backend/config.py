import os
import base64
from google.oauth2.service_account import Credentials
import gspread

# read from env or default to service_account.json file
SHEET_ID = os.getenv("GOOGLE_SHEET_ID", "15D2ZzKxKXuJhtxy5PO4PU1dAdP55kyYXSKabdR750YE")

# Allow deployment where JSON is stored as base64 in env var
sa_json_base64 = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")

if sa_json_base64:
    sa_json = base64.b64decode(sa_json_base64).decode()
    SERVICE_ACCOUNT_FILE = "/tmp/service_account.json"
    with open(SERVICE_ACCOUNT_FILE, "w") as f:
        f.write(sa_json)
else:
    SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "service_account.json")

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
client = gspread.authorize(creds)
