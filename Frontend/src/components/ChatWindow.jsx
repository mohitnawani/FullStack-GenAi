// components/ChatWindow.jsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatHistory, clearChat } from "../store/slices/chatSlice";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ documentId }) => {
  const dispatch = useDispatch();
  const { messages, isLoading, error } = useSelector((state) => state.chat);
  const bottomRef = useRef(null);

  // load chat history when document changes
  useEffect(() => {
    if (documentId) {
      dispatch(fetchChatHistory(documentId));
    }
  }, [documentId, dispatch]);

  // auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleClearChat = () => {
    dispatch(clearChat(documentId));
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* clear chat button */}
      {messages.length > 0 && (
        <div className="flex justify-end px-3 sm:px-4 pt-2">
          <button
            onClick={handleClearChat}
            className="text-xs text-base-content/40 hover:text-base-content/60
                       border border-base-300 rounded px-2 py-1"
          >
            Clear chat
          </button>
        </div>
      )}

      {/* messages area */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-4 flex flex-col gap-4">

        {/* empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
              <i className="ti ti-robot text-base-content/40" style={{ fontSize: 20 }} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-base-content/60">
              Ask me anything about your document
            </p>
            <p className="text-xs text-base-content/30 text-center max-w-xs">
              I'll answer based only on the content of your uploaded file
            </p>

            {/* suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                "Summarize this document",
                "What are the key concepts?",
                "Explain the main topics",
              ].map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  className="text-xs px-3 py-1.5 rounded-full border border-base-300
                             text-base-content/50 cursor-pointer hover:bg-base-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}

        {/* typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-base-200 flex items-center justify-center">
              <i className="ti ti-robot text-base-content/40" style={{ fontSize: 12 }} aria-hidden="true" />
            </div>
            <div className="flex items-center gap-1 bg-base-200 px-3 py-2 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* error */}
        {error && (
          <div className="text-xs text-error text-center py-2">
            {error}
          </div>
        )}

        {/* scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
