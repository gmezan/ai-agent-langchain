from app.agent import DogChatAgent

def main():
    thread_id = "abc123"
    agent = DogChatAgent()
    prompt = "Hi, I'm Bob and I live in SF."
    print("Agent response (invoke):", agent.invoke(prompt, thread_id=thread_id))
    print("Agent response (stream):", agent.stream(prompt, thread_id=thread_id))

if __name__ == "__main__":
    main()
