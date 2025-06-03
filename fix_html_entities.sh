#!/bin/bash

# Script to replace HTML entities with their proper characters in TypeScript/React files
# Specifically targets &lt; -> < and &gt; -> >

# Set the directory to search in (current directory by default)
DIR=${1:-.}

# Find all TypeScript and React files
echo "Finding TypeScript and React files in $DIR..."
FILES=$(find "$DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \))

# Count the number of files to process
FILE_COUNT=$(echo "$FILES" | wc -l)
echo "Found $FILE_COUNT files to process"

# Process each file
PROCESSED=0
MODIFIED=0

for file in $FILES; do
  PROCESSED=$((PROCESSED + 1))
  echo -ne "Processing file $PROCESSED of $FILE_COUNT: $file\r"
  
  # Check if the file contains any HTML entities we want to replace
  if grep -q "&lt;" "$file" || grep -q "&gt;" "$file"; then
    # Create a backup of the original file
    cp "$file" "${file}.bak"
    
    # Replace HTML entities with their proper characters
    sed -i 's/&lt;/</g; s/&gt;/>/g' "$file"
    
    MODIFIED=$((MODIFIED + 1))
    echo -e "\nModified: $file"
  fi
done

echo -e "\nDone! Processed $PROCESSED files, modified $MODIFIED files."
echo "Backup files were created with .bak extension for modified files."
echo "To remove backup files, you can run: find $DIR -name "*.bak" -delete"
