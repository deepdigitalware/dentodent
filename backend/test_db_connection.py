#!/usr/bin/env python3
"""
Test database connection for DentODent application.
"""

import psycopg2
import sys

def test_connection(host, port, database, user, password):
    """Test database connection"""
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        print(f"Successfully connected to database '{database}' as user '{user}'")
        conn.close()
        return True
    except Exception as e:
        print(f"Failed to connect to database '{database}' as user '{user}': {e}")
        return False

def main():
    # Test with dentodent_user credentials
    print("Testing database connection with dentodent_user credentials...")
    if test_connection("localhost", 5432, "dentodent", "dentodent_user", "Deep@DOD"):
        print("Database connection successful!")
        return
    
    # Test with postgres credentials (if known)
    print("\nTesting database connection with postgres credentials...")
    # We don't know the postgres password, so we'll skip this for now
    
    print("\nDatabase connection failed. Please ensure:")
    print("1. PostgreSQL is running")
    print("2. The database 'dentodent' exists")
    print("3. The user 'dentodent_user' exists with password 'Deep@DOD'")
    print("4. The user has privileges on the database")

if __name__ == "__main__":
    main()