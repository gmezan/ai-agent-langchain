resource "azurerm_key_vault" "keyvault" {
  name                = var.keyvault_name
  location            = var.location
  resource_group_name = var.resource_group_name
  tenant_id           = var.tenant_id
  sku_name            = "standard"

  purge_protection_enabled   = false
  soft_delete_retention_days = 7

  network_acls {
    default_action = "Allow"
    bypass         = "AzureServices"
  }

  # In module/keyvault/main.tf
  access_policy {
    tenant_id = var.tenant_id
    object_id = var.terraform_principal_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Recover", "Backup", "Restore"
    ]
  }

  tags = var.tags
}

# Role assignment for Terraform to manage Key Vault secrets
resource "azurerm_role_assignment" "terraform_keyvault_admin" {
  scope                = azurerm_key_vault.keyvault.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = var.terraform_principal_id
}