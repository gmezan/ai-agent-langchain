variable "storage_account_name" {
  type        = string
  description = "Name of the storage account for the function app"
  
  validation {
    condition     = length(var.storage_account_name) >= 3 && length(var.storage_account_name) <= 24
    error_message = "Storage account name must be between 3 and 24 characters."
  }
  
  validation {
    condition     = can(regex("^[a-z0-9]+$", var.storage_account_name))
    error_message = "Storage account name can only contain lowercase letters and numbers."
  }
}

variable "service_plan_name" {
  type        = string
  description = "Name of the service plan for the function app"
}

variable "function_app_name" {
  type        = string
  description = "Name of the function app"
}

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group where resources will be created"
}

variable "location" {
  type        = string
  description = "Azure region where resources will be created"
  default     = "East US"
}

variable "python_version" {
  type        = string
  description = "Python version for the function app"
  default     = "3.9"
  
  validation {
    condition     = contains(["3.7", "3.8", "3.9", "3.10", "3.11"], var.python_version)
    error_message = "Python version must be one of: 3.7, 3.8, 3.9, 3.10, 3.11."
  }
}

variable "app_settings" {
  type        = map(string)
  description = "Application settings for the function app"
  default     = {}
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
  default     = {}
}