import userAvatar from "../assets/user-avatar.svg";
import aiAvatar from "../assets/ai-avatar.svg";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";
  const avatar = isUser ? userAvatar : aiAvatar;
  const avatarAlt = isUser ? "User profile" : "EduMind AI profile";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

      {/* avatar */}
      <div className="w-8 h-8 rounded-full bg-base-200 border border-base-300 p-0.5 shrink-0 shadow-sm shadow-black/20">
        <img
          src={avatar}
          alt={avatarAlt}
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      {/* bubble */}
      <div
        className={`
          max-w-xs lg:max-w-md px-3 py-2 text-sm leading-relaxed
          ${isUser
            ? "bg-primary text-primary-content rounded-2xl rounded-br-sm"
            : "bg-base-200 text-base-content rounded-2xl rounded-bl-sm border border-base-300"
          }
        `}
      >
        {content}
      </div>

    </div>
  );
};

export default MessageBubble;
