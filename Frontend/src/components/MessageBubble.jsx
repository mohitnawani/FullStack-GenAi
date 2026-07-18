import { useState } from "react";
import userAvatar from "../assets/user-avatar.svg";
import aiAvatar from "../assets/ai-avatar.svg";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ✅ separate component for code block with copy button
const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
  };

  return (
    <div className="relative my-2 rounded-lg overflow-hidden">

      {/* top bar — language + copy button */}
      <div className="flex items-center justify-between
                      bg-[#282c34] px-3 py-1.5
                      border-b border-white/10">
        {/* language label */}
        <span className="text-xs text-white/40 font-mono">
          {language || "code"}
        </span>

        {/* copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-white/50
                     hover:text-white/90 transition-colors"
        >
          {copied ? (
            <>
              <i className="ti ti-check" style={{ fontSize: 13 }} aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <i className="ti ti-copy" style={{ fontSize: 13 }} aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* syntax highlighted code */}
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.75rem",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";
  const avatar = isUser ? userAvatar : aiAvatar;
  const avatarAlt = isUser ? "User profile" : "EduMind AI profile";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

      {/* avatar */}
      <div className="w-8 h-8 rounded-full bg-base-200 border border-base-300
                      p-0.5 shrink-0 shadow-sm shadow-black/20">
        <img
          src={avatar}
          alt={avatarAlt}
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      {/* bubble */}
      <div
        className={`
          max-w-[calc(100%_-_2.5rem)] sm:max-w-xl lg:max-w-2xl min-w-0 px-3 py-2 text-sm leading-relaxed break-words
          ${isUser
            ? "bg-primary text-primary-content rounded-2xl rounded-br-sm"
            : "bg-base-200 text-base-content rounded-2xl rounded-bl-sm border border-base-300"
          }
        `}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              // ✅ code blocks with copy button
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");

                return !inline && match ? (
                  <CodeBlock language={match[1]}>
                    {codeString}
                  </CodeBlock>
                ) : (
                  <code
                    className="bg-base-300 px-1 py-0.5 rounded text-xs font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mt-1 mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 mt-1 mb-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-sm ml-2">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-bold mt-3 mb-1 border-b border-base-300 pb-1">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-2 last:mb-0">{children}</p>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
