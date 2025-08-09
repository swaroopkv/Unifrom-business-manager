from config import client, SHEET_ID

def _ws(name):
    return client.open_by_key(SHEET_ID).worksheet(name)

def get_all_records(sheet_name):
    return _ws(sheet_name).get_all_records()

def append_row(sheet_name, row):
    ws = _ws(sheet_name)
    ws.append_row(row, value_input_option="USER_ENTERED")
