# Central Key Vault approach for secret management
# Secrets are read from a centralized Key Vault and stored in the application Key Vault

# Data source to reference central secrets Key Vault
data "azurerm_key_vault" "central_secrets" {
  name                = var.central_keyvault_name
  resource_group_name = var.central_keyvault_resource_group
}

# Data sources to read secrets from central Key Vault
data "azurerm_key_vault_secret" "google_client_secret" {
  name         = "ai-agent-langchain-google-client-secret"
  key_vault_id = data.azurerm_key_vault.central_secrets.id
}

data "azurerm_key_vault_secret" "deepseek_api_key" {
  name         = "deepseek-api-key"
  key_vault_id = data.azurerm_key_vault.central_secrets.id
}

locals {
  google_client_secret_value = sensitive(data.azurerm_key_vault_secret.google_client_secret.value)
  deepseek_api_key_value     = sensitive(data.azurerm_key_vault_secret.deepseek_api_key.value)
}