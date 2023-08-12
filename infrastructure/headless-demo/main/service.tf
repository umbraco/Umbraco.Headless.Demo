locals {
  bounded_context = "demos"
  service_name    = "headless-demo"
  domain = "headless-demo.umbraco.com"
  common_azure_tags = {
    environment = var.environment
    region      = "global"
    source      = "Umbraco.Headless.Demo/infrastructure/headless-demo"
    cost_center = "Development - Integrations"
  }
}

# Resource group
data "azurerm_resource_group" "rg_headlessdemo" {
  name = "rg-${var.environment}-global-${local.bounded_context}"
}

# App service plan
resource "azurerm_app_service_plan" "asp_umbraco_headlessdemo" {
  name                = "asp-${var.environment}-${local.bounded_context}-${local.service_name}-umbraco"
  location            = data.azurerm_resource_group.rg_headlessdemo.location
  resource_group_name = data.azurerm_resource_group.rg_headlessdemo.name
  tags                = local.common_azure_tags
  sku {
    tier = "Standard"
    size = "S1"
  }
}

# App service - Admin Web
resource "azurerm_app_service" "azapp_umbraco_headlessdemo" {
  name                = "azapp-${var.environment}-${local.bounded_context}-${local.service_name}-umbraco"
  location            = data.azurerm_resource_group.rg_headlessdemo.location
  resource_group_name = data.azurerm_resource_group.rg_headlessdemo.name
  app_service_plan_id = azurerm_app_service_plan.asp_umbraco_headlessdemo.id
  https_only          = true
  tags                = local.common_azure_tags

  site_config {
    dotnet_framework_version = "v6.0"
    always_on                = var.environment == "live" ? true : false
    http2_enabled            = true
  }
}

# Add CNAME records
resource "cloudflare_record" "umbraco_cname_headlessdemo" {
  zone_id = var.cf_zone_id
  name    = var.environment == "live" ? "admin.${local.domain}" : "${var.environment}.admin.${local.domain}"
  value   = azurerm_app_service.azapp_umbraco_headlessdemo.default_site_hostname
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "web_cname_headlessdemo" {
  zone_id = var.cf_zone_id
  name    = var.environment == "live" ?  "${local.domain}" : "${var.environment}.${local.domain}"
  value   = "cname.vercel-dns.com"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

# TXT records for domain validation
resource "cloudflare_record" "umbraco_txt_headlessdemo" {
  zone_id = var.cf_zone_id
  name    = var.environment == "live" ? "asuid.admin.${local.domain}" : "asuid.${var.environment}.admin.${local.domain}"
  value   = azurerm_app_service.azapp_umbraco_headlessdemo.custom_domain_verification_id
  type    = "TXT"
  ttl     = 1
}

# Time delay between the txt records and the hostname binding
resource "time_sleep" "umbraco_txt_wait_headlessdemo" {
  depends_on      = [cloudflare_record.umbraco_txt_headlessdemo]
  create_duration = "60s"
}

# Hostname Binding in Azure
resource "azurerm_app_service_custom_hostname_binding" "umbraco_hostname_binding_headlessdemo" {
  hostname            = var.environment == "live" ? "admin.${local.domain}" : "${var.environment}.admin.${local.domain}"
  app_service_name    = azurerm_app_service.azapp_umbraco_headlessdemo.name
  resource_group_name = data.azurerm_resource_group.rg_headlessdemo.name
  depends_on = [time_sleep.umbraco_txt_wait_headlessdemo]
}