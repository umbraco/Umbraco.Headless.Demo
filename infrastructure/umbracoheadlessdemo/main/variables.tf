variable "environment" {
  type        = string
  description = "Environment designation. Possible values: dev, stg, live"
  validation {
    condition     = (var.environment == "dev") || (var.environment == "stg") || (var.environment == "live")
    error_message = "Environment variable can be one of these values: dev, stg, live."
  }
  validation {
    condition     = (length(var.environment) <= 4)
    error_message = "The environment value must be max 4 characters long."
  }
  default = "live"
}

variable "location" {
  description = "Location for the Azure resources"
  default     = "West Europe"
}

## Cloudflare
variable "cf_api_key" {
  description = "Cloudflare API key."
}

variable "cf_email" {
  description = "Cloudflare account email."
}

variable "cf_account_id" {
  description = "Cloudflare account id."
}

variable "cf_zone_id" {
  description = "Cloudflare zone id."
}