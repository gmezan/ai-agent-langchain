# Azure Functions HTTP Trigger Agent

A simple Azure Functions Python application with HTTP trigger functionality and automated deployment capabilities.

## 📋 Overview

This project contains a Python-based Azure Functions app that provides an HTTP-triggered endpoint. The function accepts requests and responds with personalized messages, making it ideal for webhook integrations, API endpoints, or as a foundation for more complex serverless applications.

## 🚀 Features

- **HTTP Trigger Function**: Responds to HTTP requests with personalized greetings
- **Flexible Input**: Accepts parameters via query string or request body
- **Anonymous Access**: No authentication required (configurable)
- **Automated Deployment**: One-click deployment script included
- **Production Ready**: Proper logging and error handling

## 📁 Project Structure

```
├── function_app.py          # Main function application code
├── host.json               # Azure Functions host configuration
├── requirements.txt        # Python dependencies
├── local.settings.json     # Local development settings
├── deploy.sh              # Automated deployment script
├── deploy.ps1             # PowerShell deployment script
├── .funcignore            # Files to exclude from deployment
└── README.md              # This file
```

## 🛠 Prerequisites

- Python 3.9+
- Azure CLI installed and configured
- Azure subscription with Function App created
- Azure Functions Core Tools (for local development)

## ⚡ Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd ai-agent-langchain/tmp
```

### 2. Local Development

```bash
# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Install dependencies
pip install -r requirements.txt

# Run locally
func start
```

Your function will be available at: `http://localhost:7071/api/http_trigger_agent`

### 3. Test the Function

```bash
# Test with query parameter
curl "http://localhost:7071/api/http_trigger_agent?name=World"

# Test with JSON body
curl -X POST "http://localhost:7071/api/http_trigger_agent" \
     -H "Content-Type: application/json" \
     -d '{"name": "Azure"}'
```

## 🚢 Deployment

### Automated Deployment (Recommended)

1. **Update deployment configuration** in `deploy.sh`:
   ```bash
   RESOURCE_GROUP="your-resource-group-name"
   FUNCTION_APP_NAME="your-function-app-name"
   ```

2. **Run deployment**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Manual Deployment

```bash
# Create deployment package
zip -r function-app.zip . -x "*.pyc" "__pycache__/*" "local.settings.json" ".git/*"

# Deploy using Azure CLI
az functionapp deployment source config-zip \
    --resource-group "your-resource-group" \
    --name "your-function-app" \
    --src function-app.zip
```

## 🔧 Configuration

### Function Authorization Levels

The function supports different authorization levels in `function_app.py`:

- **`AuthLevel.ANONYMOUS`** - No authentication required (current setting)
- **`AuthLevel.FUNCTION`** - Function key required
- **`AuthLevel.ADMIN`** - Master key required

Example:
```python
app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)
```

### Environment Variables

For production deployment, configure these in your Azure Function App settings:

```json
{
  "AzureWebJobsStorage": "your-storage-connection-string",
  "FUNCTIONS_WORKER_RUNTIME": "python"
}
```

## 📡 API Reference

### Endpoint: `/api/http_trigger_agent`

**Method**: `GET` or `POST`

**Parameters**:
- `name` (optional): Name for personalized greeting

**Query String Example**:
```
GET /api/http_trigger_agent?name=World
```

**JSON Body Example**:
```json
{
  "name": "Azure Functions"
}
```

**Response**:
```
Hello, World. This HTTP triggered function executed successfully.
```

## 🔐 Security Considerations

- **Production**: Change `AuthLevel.ANONYMOUS` to `AuthLevel.FUNCTION` or `AuthLevel.ADMIN`
- **HTTPS Only**: Ensure your Function App enforces HTTPS
- **CORS**: Configure appropriate CORS settings if called from browsers
- **Input Validation**: Add input validation for production use

## 📊 Monitoring

- **Application Insights**: Uncomment Azure Monitor OpenTelemetry in `requirements.txt`
- **Logging**: Function includes built-in logging via Azure Functions runtime
- **Metrics**: Monitor invocations, duration, and errors in Azure Portal

## 🛠 Development

### Adding New Functions

```python
@app.route(route="new-endpoint")
def new_function(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("New endpoint response")
```

### Adding Dependencies

```bash
# Add to requirements.txt
pip install new-package
echo "new-package==1.0.0" >> requirements.txt
```

## 🚨 Troubleshooting

### Common Issues

1. **Deployment fails**: Check Azure CLI login and permissions
2. **Function doesn't start**: Verify Python version and dependencies
3. **Authentication errors**: Check authorization level settings
4. **Timeout issues**: Increase function timeout in `host.json`

### Debug Logs

```bash
# View live logs
az webapp log tail --name your-function-app --resource-group your-resource-group
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Python Developer Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-python)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/functionapp)

---

**Live Endpoint**: `https://mytestfunction001gmezan.azurewebsites.net/api/http_trigger_agent`

*Built with ❤️ using Azure Functions and Python*