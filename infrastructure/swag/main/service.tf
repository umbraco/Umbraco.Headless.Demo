locals {
  bounded_context = "demos"
  service_name    = "swag"
  common_azure_tags = {
    environment = var.environment
    region      = "global"
    source      = "Umbraco.Headless.Demo/infrastructure/swag"
    cost_center = "Development - Integrations"
  }
}

# Resource group
data "azurerm_resource_group" "rg" {
  name = "rg-${var.environment}-global-${local.bounded_context}"
}

# App service plan
resource "azurerm_app_service_plan" "asp" {
  name                = "asp-${var.environment}-${local.bounded_context}-${local.service_name}"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  tags                = local.common_azure_tags
  sku {
    tier = "Standard"
    size = "S1"
  }
}

# App service - Admin Web
resource "azurerm_app_service" "azapp-adminweb" {
  name                = "azapp-${var.environment}-${local.bounded_context}-${local.service_name}-adminweb"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.asp.id
  https_only          = true
  tags                = local.common_azure_tags

  site_config {
    dotnet_framework_version = "v6.0"
    always_on                = var.environment == "live" ? true : false
    http2_enabled            = true
  }
}

# Add CNAME records
resource "cloudflare_record" "adminweb_cname" {
  zone_id = var.cf_zone_id
  name    = var.environment == "live" ? "admin.headlessdemo.umbraco.com" : "${var.environment}.admin.headlessdemo.umbraco.com"
  value   = azurerm_app_service.azapp-adminweb.default_site_hostname
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "web_cname" {
  zone_id = var.cf_zone_id
  name    = var.environment == "live" ?  "headlessdemo.umbraco.com" : "${var.environment}.headlessdemo.umbraco.com"
  value   = "cname.vercel-dns.com"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

# TXT records for domain validation
resource "cloudflare_record" "adminweb_txt" {
  zone_id = var.cf_zone_id
  name    = var.environment == "live" ? "asuid.admin.headlessdemo.umbraco.com" : "asuid.${var.environment}.admin.headlessdemo.umbraco.com"
  value   = azurerm_app_service.azapp-adminweb.custom_domain_verification_id
  type    = "TXT"
  ttl     = 1
}

# Time delay between the txt records and the hostname binding
resource "time_sleep" "adminweb_txt_wait" {
  depends_on      = [cloudflare_record.adminweb_txt]
  create_duration = "60s"
}

# Hostname Binding in Azure
resource "azurerm_app_service_custom_hostname_binding" "adminweb_hostname_binding" {
  hostname            = var.environment == "live" ? "admin.headlessdemo.umbraco.com" : "${var.environment}.admin.headlessdemo.umbraco.com"
  app_service_name    = azurerm_app_service.azapp-adminweb.name
  resource_group_name = data.azurerm_resource_group.rg.name
  depends_on = [time_sleep.adminweb_txt_wait]
}