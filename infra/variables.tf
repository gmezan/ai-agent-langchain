variable "location" {
  description = "Azure region to deploy resources"
  type        = string
  default     = "eastus2"
}

variable "google_client_id" {
  description = "Google OAuth client ID for authentication"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth client secret for authentication"
  type        = string
  sensitive   = true
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default = [
    "http://localhost:5173",
    "https://gmezan.github.io"
  ]
}

variable "auth_enabled" {
  description = "Enable Azure authentication"
  type        = bool
  default     = true
}
