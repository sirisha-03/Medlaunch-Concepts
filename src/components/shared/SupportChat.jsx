import React from "react";

export function SupportChat() {
  return (
    <button
      type="button"
      className="support-chat"
      onClick={() => alert("Support Chat (mock)")}
    >
      <span className="support-chat-indicator" />
      Support Chat
    </button>
  );
}

