#!/usr/bin/env python3
"""
Database setup and verification script for DentODent application.
This script checks if the required database and user exist, and creates them if needed.
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys
import os

def connect_as_postgres():
    """Connect to PostgreSQL as the postgres user"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            database="postgres",
            user="postgres",
            password="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        return conn
    except Exception as e:
        print(f"Error connecting as postgres user: {e}")
        return None

def check_database_exists(conn, db_name):
    """Check if database exists"""
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
        exists = cur.fetchone() is not None
        cur.close()
        return exists
    except Exception as e:
        print(f"Error checking database existence: {e}")
        return False

def create_database(conn, db_name):
    """Create database"""
    try:
        cur = conn.cursor()
        cur.execute(f"CREATE DATABASE {db_name}")
        cur.close()
        print(f"Database '{db_name}' created successfully")
        return True
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

def check_user_exists(conn, username):
    """Check if user exists"""
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_catalog.pg_user WHERE usename = %s", (username,))
        exists = cur.fetchone() is not None
        cur.close()
        return exists
    except Exception as e:
        print(f"Error checking user existence: {e}")
        return False

def create_user(conn, username, password):
    """Create user"""
    try:
        cur = conn.cursor()
        cur.execute(f"CREATE USER {username} WITH PASSWORD %s", (password,))
        cur.close()
        print(f"User '{username}' created successfully")
        return True
    except Exception as e:
        print(f"Error creating user: {e}")
        return False

def grant_privileges(conn, db_name, username):
    """Grant privileges to user"""
    try:
        cur = conn.cursor()
        cur.execute(f"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {username}")
        cur.execute(f"\\c {db_name}")
        cur.execute(f"GRANT ALL ON SCHEMA public TO {username}")
        cur.close()
        print(f"Privileges granted to user '{username}' on database '{db_name}'")
        return True
    except Exception as e:
        print(f"Error granting privileges: {e}")
        return False

def main():
    # Database configuration
    DB_NAME = "dentodent"
    DB_USER = "dentodent_user"
    DB_PASSWORD = "Deep@DOD"
    
    print("Checking PostgreSQL database setup...")
    
    # Connect as postgres user
    conn = connect_as_postgres()
    if not conn:
        print("Failed to connect to PostgreSQL as postgres user")
        sys.exit(1)
    
    # Check if database exists
    if not check_database_exists(conn, DB_NAME):
        print(f"Database '{DB_NAME}' does not exist. Creating...")
        if not create_database(conn, DB_NAME):
            print("Failed to create database")
            conn.close()
            sys.exit(1)
    else:
        print(f"Database '{DB_NAME}' already exists")
    
    # Check if user exists
    if not check_user_exists(conn, DB_USER):
        print(f"User '{DB_USER}' does not exist. Creating...")
        if not create_user(conn, DB_USER, DB_PASSWORD):
            print("Failed to create user")
            conn.close()
            sys.exit(1)
    else:
        print(f"User '{DB_USER}' already exists")
    
    # Grant privileges
    print(f"Granting privileges to user '{DB_USER}' on database '{DB_NAME}'...")
    if not grant_privileges(conn, DB_NAME, DB_USER):
        print("Failed to grant privileges")
        conn.close()
        sys.exit(1)
    
    # Close connection
    conn.close()
    
    print("\nDatabase setup completed successfully!")
    print(f"Database: {DB_NAME}")
    print(f"User: {DB_USER}")
    print(f"Password: {DB_PASSWORD}")
    print("\nYou can now start the backend server.")

if __name__ == "__main__":
    main()