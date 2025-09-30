output "function_app_id" {
  description = "The ID of the Linux Function App"
  value       = azurerm_linux_function_app.function_app.id
}

output "function_app_name" {
  description = "The name of the Linux Function App"
  value       = azurerm_linux_function_app.function_app.name
}

output "function_app_default_hostname" {
  description = "The default hostname of the Function App"
  value       = azurerm_linux_function_app.function_app.default_hostname
}

output "function_app_kind" {
  description = "The kind of the Function App"
  value       = azurerm_linux_function_app.function_app.kind
}

output "storage_account_id" {
  description = "The ID of the Storage Account"
  value       = azurerm_storage_account.function_storage.id
}

output "storage_account_name" {
  description = "The name of the Storage Account"
  value       = azurerm_storage_account.function_storage.name
}

output "storage_account_primary_access_key" {
  description = "The primary access key for the Storage Account"
  value       = azurerm_storage_account.function_storage.primary_access_key
  sensitive   = true
}

output "service_plan_id" {
  description = "The ID of the Service Plan"
  value       = azurerm_service_plan.function_service_plan.id
}

output "service_plan_name" {
  description = "The name of the Service Plan"
  value       = azurerm_service_plan.function_service_plan.name
}