resource "random_pet" "rg_name" {
  prefix = "rg"
}

module "resource_group" {
  source   = "git::https://github.com/gmezan/terraform-infra-gh-actions.git//module/azure/rg?ref=main-azure"
  name     = random_pet.rg_name.id
  location = var.location
}
