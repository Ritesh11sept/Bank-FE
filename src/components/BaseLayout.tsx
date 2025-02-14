import { Box, Fab } from "@mui/material";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Chatbot from "@/chatbot";

type BaseLayoutProps = {
  children: React.ReactNode;
};

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {children}

      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          backgroundColor: '#10B981',
          zIndex: 1200,
          '&:hover': {
            backgroundColor: '#059669',
          }
        }}
        onClick={() => setIsChatOpen(true)}
      >
        <MessageSquare />
      </Fab>

      {/* Chatbot Dialog */}
      {isChatOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: 'blur(4px)',
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChatOpen(false);
          }}
        >
          <Box
            sx={{
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)',
              background: 'white',
            }}
          >
            <Chatbot onClose={() => setIsChatOpen(false)} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BaseLayout;
