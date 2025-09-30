# Outputs for use in CI/CD pipelines
output "resource_group_name" {
  description = "Name of the resource group"
  value       = module.resource_group.name
}

output "function_app_name" {
  description = "Name of the Azure Function App"
  value       = azurerm_linux_function_app.function_app.name
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.function_storage.name
}

output "keyvault_name" {
  description = "Name of the Key Vault"
  value       = module.keyvault.keyvault_name
}