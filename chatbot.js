const { HfInference } = require("@huggingface/inference");
const prompt = require("prompt-sync")();

const hf = new HfInference("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");

// Model name to use (similar to "facebook/blenderbot-400M-distill" in Python)
const modelName = "facebook/blenderbot-400M-distill";
//const modelName = "meta-llama/Llama-3.1-8B-Instruct"
console.log("Successfully initialized the model: llama.");

async function chat() {
    console.log("Chatbot is ready! Type 'exit' to quit.");

    while (true) {
    const userInput = prompt("You: ");

    if (userInput.toLowerCase() === "exit" || userInput.toLowerCase() === "quit") {
        console.log("Goodbye!");
        break;
    }
    
    try {
        const response = await hf.textGeneration({
        model: modelName,
        inputs: userInput,
        parameters: { max_new_tokens: 250 },
        });

      // Display the chatbot's response
        console.log(`Chatbot: ${response.generated_text}`);
    } catch (error) {
        console.error("Error generating response:", error.message);
    }node 
    }
}

chat();
