from app.agents.agent import DogChatAgent


class CommandLineAgent:
    def __init__(self, thread_id: str = "cli-session"):
        self.thread_id = thread_id
        self.agent = DogChatAgent()

    def run(self):
        print("Welcome to the DogChatAgent CLI! Type 'exit' to quit.")
        while True:
            user_input = input("You: ")
            if user_input.strip().lower() == "exit":
                print("Goodbye!")
                break
            response = self.agent.invoke(user_input, thread_id=self.thread_id)
            agent_content = response["messages"][-1].content
            print("\033[94mAgent:\033[0m", agent_content)  # Blue color for agent response

if __name__ == "__main__":
    CommandLineAgent().run()
