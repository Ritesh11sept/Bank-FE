export type ChatMessage = {
    message: string;
    sentTime?: string;
    sender: "ChatGPT" | "user";
    direction?: "outgoing" | "incoming";
  };
  
  export type ChatbotProps = {
    onClose?: () => void;
  };
  