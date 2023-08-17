terraform {
  required_version = "1.1.7"
  backend "azurerm" {}
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.98.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "= 3.10.1"
    }
  }
}

provider "azurerm" {
  skip_provider_registration = true
  features {}
}

provider "cloudflare" {
  api_key    = var.cf_api_key
  email      = var.cf_email
  account_id = var.cf_account_id
}