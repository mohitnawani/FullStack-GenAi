import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendQuestion } from "../store/slices/chatSlice";
import { IoArrowUp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
    <div className="px-3 sm:px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-base-300 bg-base-100">
      <div className="flex items-end gap-2 bg-base-200 border border-base-300 rounded-2xl px-3 py-2 shadow-lg shadow-black/10">

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
                     max-h-28 py-1 leading-5"
        />

        {/* send button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`
            flex items-center justify-center
            w-9 h-9 shrink-0 rounded-full
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
      <p className="text-[11px] text-base-content/30 text-center mt-1.5">
        Answers are based on your uploaded document only
      </p>
    </div>
  );
};

export default ChatInput;
