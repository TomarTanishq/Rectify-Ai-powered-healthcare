import { useState } from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios"
import { div } from "motion/react-client";
import api from "../../api";

const AskAI = () => {

    const [inputPrompt, setInputPrompt] = useState("")
    const [aiResponse, setAiResponse] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState([])

    const fetchAiResponse = async (userPrompt) => {
        try {
            setLoading(true)
            const res = await api.post('http://localhost:3000/diagnosis', {
                userPrompt: userPrompt
            })

            const aiResponse = {
                role: "ai",
                content: res.data,
                id: Date.now()
            }

            setMessage((prev) => [...prev, aiResponse])
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    }


    const handleSend = async () => {
        if (inputPrompt.trim() === "") return

        const newMessage = {
            role: "user",
            content: inputPrompt,
            id: Date.now()
        }

        setMessage((prev) => [...prev, newMessage])
        await fetchAiResponse(inputPrompt)
        setInputPrompt("")
    }

    return (

        <div className="bg-white mx-auto text-center pb-25" id="aiSection">

            {/* Text */}
            <div className="pt-20 md:max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-semibold text-gray-700">Need Help Understanding Your Symptoms?</h1>
                <p className="mx-8 md:mx-0 mt-5 text-gray-500">Let our AI assist you. <br />Just ask your symptoms and get valuable insights.</p>
            </div>

            {/* Card */}
            <div className="max-w-xl mx-5 md:mx-auto mt-10 rounded-2xl">
                <div>
                    <div className="flex flex-col md:flex-col">

                        {/* Heading */}
                        <div className="flex md:flex-row px-5 py-4 items-center gap-5 rounded-2xl rounded-br-none rounded-bl-none bg-zinc-800">

                            {/* Logo */}
                            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-zinc-600">
                                <div className="flex h-8 w-8 rounded-full bg-zinc-700 animate-pulse items-center justify-center">
                                    <h1 className=" text-sm font-extralight text-white">
                                        R
                                    </h1>
                                </div>

                            </div>

                            {/* Text */}
                            <div className="flex flex-col items-start">
                                <h1 className="font-semibold text-white ">Rectify AI</h1>
                                <p className="text-zinc-300 text-xs">Your Healthcare Assistant</p>
                            </div>
                        </div>
                        <hr className="border-zince-900" />

                        {/* Text Area */}
                        <div className="h-[500px] overflow-auto bg-zinc-900">

                            <div className="space-y-5">

                                {/* Default message */}
                                <div className="flex text-left max-w-xs md:max-w-fit py-3 px-3 mt-10 mx-6 rounded-2xl rounded-bl-lg bg-zinc-800">
                                    <h2 className="text-sm md:text-[15px] text-white">Hey! I am your healthcare assistant, how may I help you today.</h2>
                                </div>

                                {message.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                    >

                                        <div
                                            className={`max-w-xs md:max-w-xl break-words whitespace-pre-wrap py-3 px-3 mt-5 mx-6 ${msg.role === 'user'
                                                ? 'rounded-br-md rounded-2xl bg-zinc-800'
                                                : 'rounded-2xl bg-zinc-800 rounded-bl-lg'
                                                }`}
                                        >

                                            <div className="text-sm md:text-base text-white markdown">
                                                {/* <MarkdownView
                                                    markdown={msg.content}
                                                /> */}
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                                {/* {msg.content} */}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Loading State */}
                                {loading && (
                                    <div className="flex justify-start text-left">
                                        <div className="max-w-xs md:max-w-xl py-3 px-3 mt-5 mx-6 rounded-3xl bg-zinc-800">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-1 rounded-full bg-gray-400 animate-bounce"></div>
                                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Input Field */}
                <div className="px-4 py-4 bg-zinc-900 rounded-br-2xl rounded-bl-2xl">
                    <div className="flex items-center bg-zinc-900 rounded-xl border border-gray-600 px-3 py-2 shadow-md">
                        <input
                            type="text"
                            placeholder="Ask your symptoms..."
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            className="flex-grow outline-none text-sm bg-transparent text-white"
                        />
                        <button
                            className="ml-3 text-white bg-zinc-700 hover:bg-zinc-700/50 px-4 py-1 rounded-lg text-sm font-medium"
                            onClick={handleSend}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AskAI
