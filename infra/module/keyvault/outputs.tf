output "keyvault_id" {
  description = "The ID of the Key Vault"
  value       = azurerm_key_vault.keyvault.id
}

output "keyvault_name" {
  description = "The name of the Key Vault"
  value       = azurerm_key_vault.keyvault.name
}

output "keyvault_uri" {
  description = "The URI of the Key Vault"
  value       = azurerm_key_vault.keyvault.vault_uri
}

output "terraform_role_assignment_id" {
  description = "The ID of the Terraform role assignment"
  value       = azurerm_role_assignment.terraform_keyvault_admin.id
}