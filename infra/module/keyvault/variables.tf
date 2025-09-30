variable "keyvault_name" {
  type        = string
  description = "Name of the Key Vault"

  validation {
    condition     = length(var.keyvault_name) >= 3 && length(var.keyvault_name) <= 24
    error_message = "Key Vault name must be between 3 and 24 characters."
  }

  validation {
    condition     = can(regex("^[a-zA-Z0-9-]+$", var.keyvault_name))
    error_message = "Key Vault name can only contain alphanumeric characters and hyphens."
  }
}

variable "location" {
  type        = string
  description = "Azure region where the Key Vault will be created"
}

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group where the Key Vault will be created"
}

variable "tenant_id" {
  type        = string
  description = "Azure AD tenant ID"
}

variable "terraform_principal_id" {
  type        = string
  description = "Object ID of the Terraform service principal that needs admin access to the Key Vault"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to the Key Vault"
  default     = {}
}