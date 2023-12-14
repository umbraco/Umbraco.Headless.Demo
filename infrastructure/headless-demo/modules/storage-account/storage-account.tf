// Required variables

variable "environment" {
  description = "Environment designation ex. live, dev, staging. Used for resource naming."
}

variable "resource_group_name" {
  description = "Resource group in which to create the Azure resource"
}

variable "location" {
  description = "Location for the Azure resources"
}

variable "bounded_context" {
  description = "Name of the bounded context ex. Deployment, Hosting, Provisioning"
}

variable "service_name" {
  description = "Name of the service ex. Upgrades, Update, Orchestrator"
}

variable "allow_blob_public_access" {
  description = "Indicates whether to allow public access for blobs in the storage account"
}

// Optional variables

variable "tables" {
  default     = []
  description = "List of table names to create in the storage account"
  type        = list(string)
}

variable "containers" {
  default     = []
  description = "List of container names to create in the storage account"
  type        = list(string)
}

variable "azure_tags" {
  description = "Tags to apply to Azure resources"
}

// Unique id for the functions storage account
resource "random_integer" "storage_account_unique_id" {
  min = 1
  max = 99
  keepers = {
    name = var.resource_group_name
  }
}

// Storage Account
resource "azurerm_storage_account" "sa" {
  name                      = "sa${var.environment}${substr(var.bounded_context, 0, 5)}${substr(var.service_name, 0, 5)}${random_integer.storage_account_unique_id.result}"
  location                  = var.location
  resource_group_name       = var.resource_group_name
  account_tier              = "Standard"
  account_replication_type  = "ZRS"
  access_tier               = "Hot"
  min_tls_version           = "TLS1_2"
  account_kind              = "StorageV2"
  enable_https_traffic_only = true
  allow_blob_public_access  = var.allow_blob_public_access
  tags                      = var.azure_tags

  blob_properties {
    delete_retention_policy {
      days = 30
    }
  }
}

output "storage_account_connection_string" {
  value = azurerm_storage_account.sa.primary_connection_string
}

// Storage Account Tables
resource "azurerm_storage_table" "table" {
  count                = length(var.tables)
  name                 = var.tables[count.index]
  storage_account_name = azurerm_storage_account.sa.name
}

// Storage Account Containers
resource "azurerm_storage_container" "container" {
  count                 = length(var.containers)
  name                  = var.containers[count.index]
  storage_account_name  = azurerm_storage_account.sa.name
  container_access_type = "blob"
}