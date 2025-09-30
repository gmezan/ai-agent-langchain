resource "random_pet" "rg_name" {
  prefix = "rg"
}

resource "random_pet" "storage_name" {
  prefix = "stagmezan"
}

resource "random_pet" "service_plan_name" {
  prefix = "spgmezan"
}

resource "random_pet" "function_app_name" {
  prefix = "fagmezan"
}

resource "random_pet" "function_name" {
  prefix = "funcgmezan"
}

resource "random_pet" "keyvault_name" {
  prefix = "kvgmezan"
}

data "azurerm_client_config" "current" {}

module "resource_group" {
  source   = "git::https://github.com/gmezan/terraform-infra-gh-actions.git//module/azure/rg?ref=main-azure"
  name     = random_pet.rg_name.id
  location = var.location
}

resource "azurerm_storage_account" "function_storage" {
  name                     = replace(random_pet.storage_name.id, "-", "")
  resource_group_name      = module.resource_group.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

module "keyvault" {
  source = "./module/keyvault"

  keyvault_name          = replace(random_pet.keyvault_name.id, "-", "")
  location               = var.location
  resource_group_name    = module.resource_group.name
  tenant_id              = data.azurerm_client_config.current.tenant_id
  terraform_principal_id = data.azurerm_client_config.current.object_id
}

resource "azurerm_key_vault_secret" "google_client_id" {
  name         = "google-client-id"
  value        = var.google_client_id
  key_vault_id = module.keyvault.keyvault_id

  depends_on = [module.keyvault]
}

resource "azurerm_key_vault_secret" "google_client_secret" {
  name         = "google-client-secret"
  value        = var.google_client_secret
  key_vault_id = module.keyvault.keyvault_id

  depends_on = [module.keyvault]
}

resource "azurerm_service_plan" "consumption_plan" {
  name                = random_pet.service_plan_name.id
  location            = var.location
  resource_group_name = module.resource_group.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "function_app" {
  name                = random_pet.function_app_name.id
  location            = var.location
  resource_group_name = module.resource_group.name
  service_plan_id     = azurerm_service_plan.consumption_plan.id

  storage_account_name       = azurerm_storage_account.function_storage.name
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      python_version = "3.12"
    }

    cors {
      allowed_origins     = var.allowed_origins
      support_credentials = true
    }
  }

  auth_settings_v2 {
    auth_enabled           = var.auth_enabled
    require_authentication = true
    require_https          = true
    runtime_version        = "~2"

    unauthenticated_action = "Return401"
    default_provider       = "google"

    google_v2 {
      client_id                  = "@Microsoft.KeyVault(VaultName=${module.keyvault.keyvault_name};SecretName=${azurerm_key_vault_secret.google_client_id.name})"
      client_secret_setting_name = "GOOGLE_CLIENT_SECRET"
      allowed_audiences          = []
      login_scopes               = ["openid", "profile", "email"]
    }

    login {
      logout_endpoint = "/.auth/logout"
    }
  }

  app_settings = {
    "GOOGLE_CLIENT_ID"     = "@Microsoft.KeyVault(VaultName=${module.keyvault.keyvault_name};SecretName=${azurerm_key_vault_secret.google_client_id.name})"
    "GOOGLE_CLIENT_SECRET" = "@Microsoft.KeyVault(VaultName=${module.keyvault.keyvault_name};SecretName=${azurerm_key_vault_secret.google_client_secret.name})"
  }
}

# Role assignment for Function App to read Key Vault secrets
resource "azurerm_role_assignment" "function_app_keyvault_secrets" {
  scope                = module.keyvault.keyvault_id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_function_app.function_app.identity.0.principal_id
}

resource "azurerm_function_app_function" "example_function" {
  name            = replace(random_pet.function_name.id, "-", "")
  function_app_id = azurerm_linux_function_app.function_app.id
  language        = "Python"
  test_data = jsonencode({
    "name" = "Azure"
  })
  config_json = jsonencode({
    "bindings" = [
      {
        "authLevel" = "function"
        "direction" = "in"
        "methods" = [
          "get",
          "post",
        ]
        "name" = "req"
        "type" = "httpTrigger"
      },
      {
        "direction" = "out"
        "name"      = "$return"
        "type"      = "http"
      },
    ]
  })
}
