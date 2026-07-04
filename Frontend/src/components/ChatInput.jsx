// components/ChatInput.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendQuestion } from "../store/slices/chatSlice";

const ChatInput = ({ documentId }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput(""); // clear input immediately

    dispatch(sendQuestion({ question, documentId }));
  };

  // send on Enter key
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
        <button className="btn btn-ghost btn-xs btn-circle">
          <i className="ti ti-paperclip text-base-content/50" style={{ fontSize: 16 }} aria-hidden="true" />
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
          className="btn btn-primary btn-xs btn-circle"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <i className="ti ti-arrow-up" style={{ fontSize: 14 }} aria-hidden="true" />
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