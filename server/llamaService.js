import Groq from "groq-sdk/index.mjs";
import dotenv from 'dotenv'

//Load env variables
dotenv.config()
const GROQ_API_KEY = process.env.GROQ_API_KEY

const groq = new Groq({ apiKey: GROQ_API_KEY })

async function llamaService(prompt) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": "You are Rectify AI, a medical diagnostic assistant. Always respond strictly in markdown format using headings (##), bold (**text**), bullet points (-), and sections as instructed. Do not use JSON or code blocks."

                },
                {
                    "role": "user",
                    "content": prompt
                },
            ],
            "model": "qwen/qwen3-32b",
            "temperature": 0.6,
            "max_completion_tokens": 4096,
            "top_p": 0.95,
            "stream": false,
            "reasoning_effort": "none",
            "stop": null
        })
        return chatCompletion.choices[0].message.content
    } catch (error) {
        console.error("Llama Service Error", error);
        return JSON.stringify({
            error: "Midical diagnosis service unavailable",
            details: error.message
        })
    }
}

export default llamaService
