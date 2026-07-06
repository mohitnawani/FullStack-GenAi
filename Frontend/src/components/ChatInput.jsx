import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendQuestion } from "../store/slices/chatSlice";
import { IoArrowUp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import DocumentUpload from "./DocumentUpload";
const ChatInput = ({ documentId }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    dispatch(sendQuestion({ question, documentId }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-base-300">
      <div className="flex items-center gap-2 bg-base-200 border border-base-300 rounded-xl px-3 py-2">

        {/* attach button */}
        <button className="p-1 rounded-lg hover:bg-base-300 transition-colors">
          <MdAttachFile
            size={18}
            className="text-base-content/40"
          />
        </button>

        {/* text input */}
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your document..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none resize-none
                     text-sm text-base-content placeholder:text-base-content/30
                     max-h-24 py-0.5"
        />

        {/* send button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`
            flex items-center justify-center
            w-8 h-8 rounded-full
            transition-all duration-200
            ${!input.trim() || isLoading
              ? "bg-base-300 cursor-not-allowed"
              : "bg-primary hover:scale-105 active:scale-95 cursor-pointer"
            }
          `}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters
              size={16}
              className="text-base-content/40 animate-spin"
            />
          ) : (
            <IoArrowUp
              size={16}
              className={
                !input.trim()
                  ? "text-base-content/30"
                  : "text-primary-content"
              }
            />
          )}
        </button>

      </div>
      <p className="text-xs text-base-content/30 text-center mt-1">
        Answers are based on your uploaded document only
      </p>
    </div>
  );
};

export default ChatInput;