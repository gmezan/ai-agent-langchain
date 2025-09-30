# Azure Function App Module

This Terraform module creates an Azure Linux Function App with all required dependencies including a Storage Account and Service Plan.

## Resources Created

- `azurerm_storage_account` - Storage account for the function app
- `azurerm_service_plan` - Service plan with Linux OS and S1 SKU
- `azurerm_linux_function_app` - Linux function app with Python runtime

## Usage

```hcl
module "function_app" {
  source = "./module/functionapp"

  # Required variables
  storage_account_name = "mystorageaccount123"
  service_plan_name    = "my-service-plan"
  function_app_name    = "my-function-app"
  resource_group_name  = "my-resource-group"
  location            = "East US"

  # Optional variables
  python_version = "3.9"
  app_settings = {
    "ENVIRONMENT" = "production"
    "DEBUG"       = "false"
  }
  tags = {
    Environment = "production"
    Owner       = "team-name"
  }
}
```

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.0 |
| azurerm | >= 3.0 |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| storage_account_name | Name of the storage account for the function app | `string` | n/a | yes |
| service_plan_name | Name of the service plan for the function app | `string` | n/a | yes |
| function_app_name | Name of the function app | `string` | n/a | yes |
| resource_group_name | Name of the resource group where resources will be created | `string` | n/a | yes |
| location | Azure region where resources will be created | `string` | `"East US"` | no |
| python_version | Python version for the function app | `string` | `"3.9"` | no |
| app_settings | Application settings for the function app | `map(string)` | `{}` | no |
| tags | Tags to apply to all resources | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| function_app_id | The ID of the Linux Function App |
| function_app_name | The name of the Linux Function App |
| function_app_default_hostname | The default hostname of the Function App |
| function_app_kind | The kind of the Function App |
| storage_account_id | The ID of the Storage Account |
| storage_account_name | The name of the Storage Account |
| storage_account_primary_access_key | The primary access key for the Storage Account (sensitive) |
| service_plan_id | The ID of the Service Plan |
| service_plan_name | The name of the Service Plan |

## Notes

- Storage account names must be globally unique and contain only lowercase letters and numbers
- The module uses default values for tiers, types, and SKUs as requested:
  - Storage Account: Standard tier with LRS replication
  - Service Plan: Linux OS with S1 SKU
  - Function App: Python 3.9 runtime (configurable)