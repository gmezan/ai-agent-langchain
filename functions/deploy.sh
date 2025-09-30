#!/bin/bash

# Azure Functions Zip Deployment Script
# Make sure you have Azure CLI installed and are logged in

# Configuration - Update these values
RESOURCE_GROUP="rg-warm-bluebird"
FUNCTION_APP_NAME="fagmezan-enabling-ewe"
#SUBSCRIPTION="your-subscription-id"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Azure Functions deployment...${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${RED}Not logged in to Azure. Please run 'az login' first.${NC}"
    exit 1
fi

# Set subscription (optional)
if [ ! -z "$SUBSCRIPTION" ]; then
    echo -e "${YELLOW}Setting subscription to $SUBSCRIPTION${NC}"
    az account set --subscription "$SUBSCRIPTION"
fi

# Create deployment package
echo -e "${YELLOW}Creating deployment package...${NC}"

# Create a temporary directory for the package
TEMP_DIR=$(mktemp -d)
ZIP_FILE="$TEMP_DIR/function-app.zip"

# Copy function files (exclude unnecessary files)
cp function_app.py "$TEMP_DIR/"
cp host.json "$TEMP_DIR/"
cp requirements.txt "$TEMP_DIR/"

# Copy all source directories
cp -r agents/ "$TEMP_DIR/" 2>/dev/null || true
cp -r apis/ "$TEMP_DIR/" 2>/dev/null || true
cp -r memory/ "$TEMP_DIR/" 2>/dev/null || true
cp -r model/ "$TEMP_DIR/" 2>/dev/null || true
cp -r tools/ "$TEMP_DIR/" 2>/dev/null || true
cp -r utils/ "$TEMP_DIR/" 2>/dev/null || true

# Copy .python_packages directory if it exists
if [ -d ".python_packages" ]; then
    cp -r .python_packages "$TEMP_DIR/"
    echo -e "${GREEN}.python_packages directory copied to deployment package${NC}"
elif [ -f ".python_packages" ]; then
    cp .python_packages "$TEMP_DIR/"
    echo -e "${GREEN}.python_packages file copied to deployment package${NC}"
else
    echo -e "${YELLOW}Warning: .python_packages not found${NC}"
fi

# Create the zip file
cd "$TEMP_DIR"
zip -r function-app.zip . -x "*.pyc" "__pycache__/*" "local.settings.json" ".git/*" ".vscode/*"

echo -e "${GREEN}Package created: $ZIP_FILE${NC}"

# Deploy to Azure
echo -e "${YELLOW}Deploying to Azure Functions...${NC}"
az functionapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$FUNCTION_APP_NAME" \
    --src "$ZIP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment successful!${NC}"
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo -e "${GREEN}Deployment complete!${NC}"