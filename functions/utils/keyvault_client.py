"""
Alternative method for accessing Key Vault secrets using Azure SDK.
This is useful when you need to dynamically fetch secrets at runtime.
"""

import os
import logging
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

class KeyVaultClient:
    def __init__(self):
        """
        Initialize Key Vault client using DefaultAzureCredential.
        This will use the Function App's managed identity when deployed.
        """
        # Get Key Vault URL from environment or construct it
        keyvault_name = os.getenv('KEYVAULT_NAME')
        if not keyvault_name:
            # You could also pass this as an app setting from Terraform
            raise ValueError("KEYVAULT_NAME environment variable not set")
        
        keyvault_url = f"https://{keyvault_name}.vault.azure.net/"
        
        # DefaultAzureCredential will automatically use:
        # 1. Managed Identity when running in Azure
        # 2. Azure CLI credentials when running locally
        credential = DefaultAzureCredential()
        
        self.client = SecretClient(vault_url=keyvault_url, credential=credential)
    
    def get_secret(self, secret_name: str) -> str:
        """
        Retrieve a secret from Key Vault.
        
        Args:
            secret_name: The name of the secret in Key Vault
            
        Returns:
            The secret value
            
        Raises:
            Exception: If secret cannot be retrieved
        """
        try:
            secret = self.client.get_secret(secret_name)
            return secret.value
        except Exception as e:
            logging.error(f"Failed to retrieve secret '{secret_name}': {str(e)}")
            raise

# Global instance (initialize once)
_keyvault_client = None

def get_keyvault_client() -> KeyVaultClient:
    """Get a singleton KeyVault client instance."""
    global _keyvault_client
    if _keyvault_client is None:
        _keyvault_client = KeyVaultClient()
    return _keyvault_client

def get_secret_from_keyvault(secret_name: str) -> str:
    """
    Convenience function to get a secret from Key Vault.
    
    Args:
        secret_name: The name of the secret in Key Vault
        
    Returns:
        The secret value
    """
    client = get_keyvault_client()
    return client.get_secret(secret_name)