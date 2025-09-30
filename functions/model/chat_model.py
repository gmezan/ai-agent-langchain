
import os
from utils.secrets import get_secret
from langchain.chat_models import init_chat_model

deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
if not deepseek_api_key:
    raise ValueError("DEEPSEEK_API_KEY not found in Key Vault or environment variables")
print("DEEPSEEK_API_KEY loaded from environment variables")

chat_model = init_chat_model("deepseek-chat", model_provider="deepseek")