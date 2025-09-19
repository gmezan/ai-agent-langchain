
import os
from dotenv import load_dotenv

load_dotenv()

from langchain.chat_models import init_chat_model

chat_model = init_chat_model("deepseek-chat", model_provider="deepseek")