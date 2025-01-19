#!pip install transformers
from transformers import pipeline
from transformers import AutoTokenizer,AutoModelForSeq2SeqLM
# from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import login
require('dotenv').config();

# Log in to Hugging Face
login(
    new_session=False,           # Will not request the token if already saved on your machine
    token=process.env.HUGGINGFACE_TOKEN,          # Replace 'Your token' with your Hugging Face token
    add_to_git_credential=True   # Adds token to your Git credentials for authentication
)

model_name = "facebook/blenderbot-400M-distill"
#model_name = "meta-llama/Llama-3.1-8B-Instruct"
# Fetch the model and initialize a tokenizer
#model fetching for small facebook model
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

#Model fetching for llama 8B model
# model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

print("successfully fetched model")

# Chat loop to process user input and generate responses
def chat():
    print("Chatbot is ready! Type 'exit' to quit.")
    while True:
        # Get user input
        user_input = input("You: ")
        
        # Exit condition
        if user_input.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break
        
        # Tokenize user input
        inputs = tokenizer(user_input, return_tensors="pt")
        
        # Generate a response
        outputs = model.generate(inputs.input_ids, max_new_tokens=1000)
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Display the chatbot's response
        print(f"Chatbot: {response}")

# Start the chat
chat()