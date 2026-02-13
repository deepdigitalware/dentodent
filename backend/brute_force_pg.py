import psycopg2
import sys

passwords = ["", "postgres", "admin", "root", "password", "123456", "Deep@DOD", "Deep@SM#01170628"]
user = "postgres"

for pw in passwords:
    try:
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            database="postgres",
            user=user,
            password=pw
        )
        print(f"SUCCESS! Password for {user} is: '{pw}'")
        conn.close()
        sys.exit(0)
    except Exception as e:
        print(f"Failed with '{pw}': {e}")

print("All common passwords failed.")
sys.exit(1)
