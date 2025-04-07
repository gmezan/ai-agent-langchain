import os
from langchain_openai import AzureChatOpenAI

# https://python.langchain.com/docs/tutorials/llm_chain/

model = AzureChatOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_deployment=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
    openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
)

from langchain_core.messages import HumanMessage, SystemMessage

messages = [
    SystemMessage("Translate the following from English into Italian"),
    HumanMessage("hi!"),
]

results = [
    model.invoke(messages),
    model.invoke("Hello"),
    model.invoke([{"role": "user", "content": "Hello"}]),
    model.invoke([HumanMessage("Hello")])
]
for r in results:
    print(r.content)

for token in model.stream(messages):
    print(token.content, end="|")