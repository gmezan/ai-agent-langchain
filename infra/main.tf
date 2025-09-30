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

  site_config {
    application_stack {
      python_version = "3.12"
    }
  }
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
