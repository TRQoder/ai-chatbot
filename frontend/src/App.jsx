import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import robot from "./assets/robot.png";
import "./index.css";
import { socket } from "./services/socket";
import ReactMarkdown from "react-markdown";


export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("ai-response", (data) => {
      const botMessage = { text: data, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    });

    return () => {
      socket.off("ai-response");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ Handle mobile keyboard resize
  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // run once at mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    socket.emit("prompt", input);
    setInput("");
    setIsTyping(true);
  };

  return (
    <div
      className="flex items-center justify-center bg-[#0a0a0a]"
      style={{ height: "var(--app-height, 100dvh)" }} // ✅ dynamic height fix
    >
      <div className="flex flex-col w-full h-full md:h-[95%] md:w-[430px] bg-[#111] bg-opacity-90 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.6)] md:rounded-2xl overflow-hidden border border-gray-800">

        {/* HEADER */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#2d2d2d] via-[#1f1f1f] to-[#2d2d2d] text-white shadow-md border-b border-gray-700">
          <motion.img
            src={robot}
            alt="AI Chatbot"
            className="w-11 h-11 rounded-full border border-purple-500 shadow-lg"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -3, 3, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <h1 className="text-lg font-semibold tracking-wide">AI Chatbot</h1>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto px-3 py-3 bg-[#0d0d0d] custom-scrollbar">
          {messages.length === 0 && !isTyping && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <motion.img
                src={robot}
                alt="AI Chatbot"
                className="w-16 h-16 rounded-full border border-purple-500 shadow-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.p
                className="text-sm text-gray-400 text-center max-w-[220px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                👋 No messages yet…
                <br /> Type something to start the conversation!
              </motion.p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={`my-1 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                      : "bg-[#1e1e1e] text-gray-200 border border-gray-800"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex justify-start my-2">
              <div className="px-4 py-2 rounded-2xl bg-[#1e1e1e] border border-gray-800 text-gray-400 text-sm flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="animate-bounce delay-300">●</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* ✅ INPUT (sticky at bottom) */}
        <div className="p-3 bg-[#161616] flex items-center gap-2 border-t border-gray-800 sticky bottom-0">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-full border border-gray-700 bg-[#0d0d0d] text-white outline-none text-sm focus:border-purple-500 transition-all placeholder-gray-400"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onFocus={() =>
              setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 300)
            } // ✅ auto-scroll when keyboard opens
          />
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 p-3 rounded-full text-white shadow-lg transition-all"
          >
            <IoSend size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
