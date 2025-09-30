"""
Utility module for accessing secrets from environment variables
that are populated from Azure Key Vault.
"""

import os
import logging

def get_secret(secret_name: str, default: str = None) -> str:
    """
    Get a secret from environment variables.
    
    Args:
        secret_name: The name of the environment variable containing the secret
        default: Default value if secret is not found
    
    Returns:
        The secret value or default if not found
        
    Raises:
        ValueError: If secret is not found and no default provided
    """
    secret_value = os.getenv(secret_name, default)
    
    if secret_value is None:
        logging.error(f"Secret '{secret_name}' not found in environment variables")
        raise ValueError(f"Secret '{secret_name}' not found")
    
    return secret_value

def get_deepseek_api_key() -> str:
    """Get DeepSeek API key from Key Vault via environment variable."""
    return get_secret("DEEPSEEK_API_KEY")

def get_google_client_secret() -> str:
    """Get Google client secret from Key Vault via environment variable."""
    return get_secret("GOOGLE_CLIENT_SECRET")

def get_google_client_id() -> str:
    """Get Google client ID from environment variable."""
    return get_secret("GOOGLE_CLIENT_ID")