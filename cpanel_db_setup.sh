#!/bin/bash

# =========================================================================
#  cPanel Database and User Creation Script
# =========================================================================
#  Instructions:
#  1. Upload this script and 'cpanel_db_setup.sql' to your cPanel directory.
#  2. Run 'chmod +x cpanel_db_setup.sh' to make it executable.
#  3. Run the script: './cpanel_db_setup.sh'
# =========================================================================

# Check if running in a cPanel environment
if ! command -v uapi &> /dev/null; then
    echo "========================================================================="
    echo " ERROR: 'uapi' command not found."
    echo " This script must be run on your cPanel server (via terminal or SSH)."
    echo "========================================================================="
    echo ""
    echo "If you do not have SSH access, please refer to the manual configuration"
    echo "instructions in the generated README/guide."
    exit 1
fi

# Attempt to auto-detect cPanel username
AUTO_USER=$(whoami)
read -p "Enter cPanel Username [$AUTO_USER]: " CPANEL_USER
CPANEL_USER=${CPANEL_USER:-$AUTO_USER}

# Read database name suffix
read -p "Enter Database Suffix [atromed]: " DB_SUFFIX
DB_SUFFIX=${DB_SUFFIX:-atromed}

# Read database user suffix
read -p "Enter Database User Suffix [atromed_user]: " USER_SUFFIX
USER_SUFFIX=${USER_SUFFIX:-atromed_user}

# Read database password
# Generate a strong password as a suggestion
SUGGESTED_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 16)
SUGGESTED_PASS="${SUGGESTED_PASS}aA1!"
read -p "Enter Database User Password [$SUGGESTED_PASS]: " DB_PASS
DB_PASS=${DB_PASS:-$SUGGESTED_PASS}

# Form full names
FULL_DB_NAME="${CPANEL_USER}_${DB_SUFFIX}"
FULL_DB_USER="${CPANEL_USER}_${USER_SUFFIX}"

echo ""
echo "--------------------------------------------------------"
echo " Configuration to be applied:"
echo "   cPanel User:     $CPANEL_USER"
echo "   Database Name:   $FULL_DB_NAME"
echo "   Database User:   $FULL_DB_USER"
echo "   Password:        $DB_PASS"
echo "--------------------------------------------------------"
read -p "Proceed? (y/n) [y]: " PROCEED
PROCEED=${PROCEED:-y}

if [[ ! "$PROCEED" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# 1. Create the MySQL database
echo ""
echo "Creating database: $FULL_DB_NAME..."
uapi --user="$CPANEL_USER" Mysql create_database name="$DB_SUFFIX"
if [ $? -eq 0 ]; then
    echo "Database created successfully."
else
    echo "Failed to create database."
fi

# 2. Create the MySQL user
echo ""
echo "Creating database user: $FULL_DB_USER..."
uapi --user="$CPANEL_USER" Mysql create_user name="$USER_SUFFIX" password="$DB_PASS"
if [ $? -eq 0 ]; then
    echo "Database user created successfully."
else
    echo "Failed to create database user."
fi

# 3. Associate user with database and grant privileges
echo ""
echo "Assigning privileges on $FULL_DB_NAME to $FULL_DB_USER..."
uapi --user="$CPANEL_USER" Mysql set_privileges_on_database user="$USER_SUFFIX" database="$DB_SUFFIX" privileges="ALL PRIVILEGES"
if [ $? -eq 0 ]; then
    echo "Privileges granted successfully."
else
    echo "Failed to set privileges."
fi

# 4. Import the SQL file if it is in the same directory
SQL_FILE="cpanel_db_setup.sql"
if [ -f "$SQL_FILE" ]; then
    echo ""
    echo "Found $SQL_FILE. Importing schema and seed data into $FULL_DB_NAME..."
    mysql -u "$FULL_DB_USER" -p"$DB_PASS" "$FULL_DB_NAME" < "$SQL_FILE"
    if [ $? -eq 0 ]; then
        echo "Database schema and seed data imported successfully!"
    else
        echo "Warning: SQL import failed. You may need to import it manually via phpMyAdmin."
    fi
else
    echo ""
    echo "Note: $SQL_FILE not found in the current directory. Skipping import."
    echo "You can import the schema manually using phpMyAdmin."
fi

echo ""
echo "========================================================="
echo " SETUP COMPLETED"
echo "========================================================="
echo "Add these variables to your .env file on cPanel:"
echo ""
echo "DB_HOST=localhost"
echo "DB_NAME=$FULL_DB_NAME"
echo "DB_USER=$FULL_DB_USER"
echo "DB_PASS=$DB_PASS"
echo "========================================================="
