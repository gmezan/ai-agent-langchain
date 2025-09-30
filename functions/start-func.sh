#!/bin/bash

# Activate virtual environment and start Azure Functions
echo "Activating virtual environment..."
source .venv/bin/activate

echo "Starting Azure Functions host..."
func host start