# Azure Infrastructure for AI Agent Function App

This directory contains Terraform configuration for deploying Azure infrastructure to support the AI Agent Function App with secure secret management using Azure Key Vault.

## Architecture

The infrastructure includes:

- **Resource Group**: Container for all resources
- **Azure Function App**: Serverless compute for the AI agent
- **Storage Account**: Required for Function App operation
- **Key Vault**: Secure storage for secrets and API keys
- **Service Plan**: Consumption-based pricing for the Function App

## Security Features

✅ **Managed Identity**: Function App uses system-assigned managed identity  
✅ **RBAC**: Role-based access control for Key Vault  
✅ **Key Vault Integration**: Secrets automatically injected as environment variables  
✅ **HTTPS Only**: All communication encrypted  
✅ **Authentication**: Google OAuth integration  

## Prerequisites

1. **Azure CLI** installed and configured
   ```bash
   az login
   az account set --subscription "your-subscription-id"
   ```

2. **Terraform** installed (version >= 1.0)
   ```bash
   # On macOS with Homebrew
   brew install terraform
   ```

3. **Required secrets**:
   - Google OAuth client secret
   - DeepSeek API key (optional)

## Quick Start

1. **Clone and navigate to infrastructure directory**:
   ```bash
   cd infra
   ```

2. **Create terraform.tfvars from example**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. **Edit terraform.tfvars with your values**:
   ```bash
   # Required
   google_client_secret = "your-google-oauth-secret"
   
   # Optional
   deepseek_api_key = "your-deepseek-api-key"
   ```

4. **Deploy infrastructure**:
   ```bash
   ./deploy.sh
   ```

## Manual Deployment

If you prefer to run Terraform commands manually:

```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply changes
terraform apply
```

## Configuration Variables

### Required Variables
- `google_client_secret`: Google OAuth client secret for authentication

### Optional Variables
- `deepseek_api_key`: API key for DeepSeek AI model (falls back to local env if not provided)
- `location`: Azure region (default: "eastus2")
- `google_client_id`: Google OAuth client ID (has default)
- `allowed_origins`: CORS origins for frontend (has defaults)
- `auth_enabled`: Enable/disable authentication (default: true)

## Key Vault Secrets

The following secrets are automatically created and configured:

| Secret Name | Environment Variable | Usage |
|-------------|---------------------|-------|
| `google-client-secret` | `GOOGLE_CLIENT_SECRET` | OAuth authentication |
| `deepseek-api-key` | `DEEPSEEK_API_KEY` | AI model API access |

## Function App Settings

The Function App is automatically configured with these environment variables:

- `GOOGLE_CLIENT_ID`: OAuth client ID
- `GOOGLE_CLIENT_SECRET`: OAuth secret (from Key Vault)
- `DEEPSEEK_API_KEY`: AI API key (from Key Vault, if provided)
- `KEYVAULT_NAME`: Name of the Key Vault (for SDK access)

## Outputs

After deployment, these outputs are available:

- `resource_group_name`: Name of the created resource group
- `function_app_name`: Name of the Function App
- `keyvault_name`: Name of the Key Vault
- `storage_account_name`: Name of the storage account

## Adding New Secrets

To add additional secrets:

1. **Add variable in `variables.tf`**:
   ```terraform
   variable "my_new_secret" {
     description = "My new secret"
     type        = string
     sensitive   = true
     default     = ""
   }
   ```

2. **Add secret resource in `main.tf`**:
   ```terraform
   resource "azurerm_key_vault_secret" "my_new_secret" {
     count        = var.my_new_secret != "" ? 1 : 0
     name         = "my-new-secret"
     value        = var.my_new_secret
     key_vault_id = module.keyvault.keyvault_id
     depends_on   = [time_sleep.wait_for_rbac]
   }
   ```

3. **Add to app settings**:
   ```terraform
   app_settings = merge({
     # ... existing settings
   }, var.my_new_secret != "" ? {
     "MY_NEW_SECRET" = "@Microsoft.KeyVault(VaultName=${module.keyvault.keyvault_name};SecretName=${azurerm_key_vault_secret.my_new_secret[0].name})"
   } : {})
   ```

## Accessing Secrets in Function Code

### Method 1: Environment Variables (Recommended)
```python
import os
from utils.secrets import get_secret

# Direct access
api_key = os.getenv('DEEPSEEK_API_KEY')

# With error handling
api_key = get_secret('DEEPSEEK_API_KEY')
```

### Method 2: Azure SDK (Dynamic Access)
```python
from utils.keyvault_client import get_secret_from_keyvault

# Direct Key Vault access
api_key = get_secret_from_keyvault('deepseek-api-key')
```

## Local Development

For local development:

1. Create a `.env` file in your function directory:
   ```bash
   DEEPSEEK_API_KEY=your-local-api-key
   GOOGLE_CLIENT_SECRET=your-local-secret
   ```

2. The code automatically falls back to environment variables when Key Vault is not available.

## Cleanup

To destroy all infrastructure:

```bash
./destroy.sh
```

Or manually:

```bash
terraform destroy
```

## Security Notes

- All secrets are stored securely in Key Vault
- Function App uses managed identity (no credentials in code)
- RBAC provides least-privilege access
- Secrets are injected at runtime as environment variables
- Never commit `terraform.tfvars` to version control

## Troubleshooting

### Common Issues

1. **"Key Vault access denied"**
   - Ensure you have sufficient permissions in Azure
   - Wait for RBAC propagation (handled by `time_sleep` resource)

2. **"Secret not found"**
   - Check that the secret exists in Key Vault
   - Verify the secret name matches the reference

3. **"Function App not starting"**
   - Check Application Insights logs
   - Verify all required environment variables are set

### Debugging

1. **Check Function App logs**:
   ```bash
   az functionapp logs tail --name <function-app-name> --resource-group <resource-group-name>
   ```

2. **Verify Key Vault access**:
   ```bash
   az keyvault secret show --vault-name <keyvault-name> --name deepseek-api-key
   ```

3. **Test configuration endpoint**:
   ```bash
   curl https://<function-app-name>.azurewebsites.net/api/config
   ```

## Contributing

When making changes to the infrastructure:

1. Test changes with `terraform plan`
2. Update this README if adding new features
3. Update the example variables file
4. Test both deployment and destruction scripts