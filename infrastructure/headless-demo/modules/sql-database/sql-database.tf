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

// Optional variables
variable "sql_edition" {
  default     = "Basic"
  description = "The edition to use for the sql database"
}

variable "azure_tags" {
  description = "Tags to apply to Azure resources"
}

locals {
  allowed_ips = [
    { name = "hq-office", ip = "2.109.65.126" },
    { name = "admin-vpn", ip = "134.122.92.108" },
    { name = "all-azure-services", ip = "0.0.0.0" },
    { name = "perimeter-vpn-uk", ip = "165.22.124.72" },
    { name = "perimeter-vpn-us", ip = "96.30.199.143" }
  ]
}

// SQL Server Master Login
resource "random_string" "sql_server_master_login" {
  length  = 16
  special = false
}

// SQL Server Master Password
resource "random_password" "sql_server_master_login_password" {
  length           = 52
  special          = true
  override_special = "_@~#*()"
}

// SQL Server
resource "azurerm_sql_server" "server" {
  name                         = "sqlsrv-${var.environment}-${var.bounded_context}-${var.service_name}"
  location                     = var.location
  resource_group_name          = var.resource_group_name
  administrator_login          = random_string.sql_server_master_login.result
  administrator_login_password = random_password.sql_server_master_login_password.result
  version                      = "12.0"
  tags                         = var.azure_tags
}

// SQL Server Firewall Rules
resource "azurerm_sql_firewall_rule" "allowed_ip_rules" {
  for_each = {
    for index, allowed_ip in local.allowed_ips :
    index => allowed_ip
  }
  name                = each.value.name
  resource_group_name = var.resource_group_name
  server_name         = azurerm_sql_server.server.name
  start_ip_address    = each.value.ip
  end_ip_address      = each.value.ip
}

// Connection Strings
output "database_connection_string" {
  value = "Server=tcp:${azurerm_sql_server.server.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_sql_database.db.name};Persist Security Info=False;User ID=${azurerm_sql_server.server.administrator_login};Password=${azurerm_sql_server.server.administrator_login_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
}

// SQL Database
resource "azurerm_sql_database" "db" {
  name                = "sqldb-${var.environment}-${var.bounded_context}-${var.service_name}"
  location            = var.location
  resource_group_name = var.resource_group_name
  server_name         = azurerm_sql_server.server.name
  edition             = var.sql_edition
  tags                = var.azure_tags
  max_size_bytes      = 1073741824
}