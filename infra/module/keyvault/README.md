# Azure Key Vault Module

This Terraform module creates an Azure Key Vault with administrator role assignment for Terraform management.

## Resources Created

- `azurerm_key_vault` - Azure Key Vault with standard SKU
- `azurerm_role_assignment` - Key Vault Administrator role for Terraform principal

## Usage

```hcl
module "keyvault" {
  source = "./module/keyvault"

  # Required variables
  keyvault_name          = "my-keyvault-name"
  location              = "East US"
  resource_group_name   = "my-resource-group"
  tenant_id             = "your-tenant-id"
  terraform_principal_id = "terraform-service-principal-object-id"

  # Optional variables
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
| keyvault_name | Name of the Key Vault | `string` | n/a | yes |
| location | Azure region where the Key Vault will be created | `string` | n/a | yes |
| resource_group_name | Name of the resource group where the Key Vault will be created | `string` | n/a | yes |
| tenant_id | Azure AD tenant ID | `string` | n/a | yes |
| terraform_principal_id | Object ID of the Terraform service principal that needs admin access to the Key Vault | `string` | n/a | yes |
| tags | Tags to apply to the Key Vault | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| keyvault_id | The ID of the Key Vault |
| keyvault_name | The name of the Key Vault |
| keyvault_uri | The URI of the Key Vault |
| terraform_role_assignment_id | The ID of the Terraform role assignment |

## Features

- **Standard SKU** for cost efficiency
- **Soft delete** with 7-day retention period
- **Network access** from Azure services
- **RBAC-based access** control
- **Terraform admin role** assignment for secret management