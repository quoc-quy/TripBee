import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "bot";
    content: string;
}

export default function Chatbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: "Xin chào! Mình là trợ lý ảo TripBee. Mình có thể giúp gì cho bạn?",
        },
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Gọi API backend
    const chatMutation = useMutation({
        mutationFn: async (msg: string) => {
            // Thay đổi URL nếu backend chạy port khác
            const res = await axios.post("http://localhost:8080/api/ai/chat", { message: msg });
            return res.data.response;
        },
        onSuccess: (data) => {
            setMessages((prev) => [...prev, { role: "bot", content: data }]);
        },
        onError: () => {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau." },
            ]);
        },
    });

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        chatMutation.mutate(userMsg);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Nút mở chat */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                        <MessageCircle size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Cửa sổ chat */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center text-white shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-full">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">TripBee AI</h3>
                                    <p className="text-xs text-blue-100 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth"
                        >
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`flex items-end gap-2 max-w-[80%] ${
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white ${
                                                msg.role === "user" ? "bg-gray-500" : "bg-blue-500"
                                            }`}
                                        >
                                            {msg.role === "user" ? (
                                                <User size={12} />
                                            ) : (
                                                <Bot size={12} />
                                            )}
                                        </div>
                                        <div
                                            className={`p-3 rounded-2xl text-sm shadow-sm ${
                                                msg.role === "user"
                                                    ? "bg-blue-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {chatMutation.isPending && (
                                <div className="flex justify-start">
                                    <div className="bg-white border p-3 rounded-2xl rounded-tl-none text-gray-400 text-xs flex items-center gap-1">
                                        <span className="animate-bounce">●</span>
                                        <span className="animate-bounce delay-100">●</span>
                                        <span className="animate-bounce delay-200">●</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Hỏi về tour du lịch..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || chatMutation.isPending}
                                    className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
