import { Box, useMediaQuery, Fab } from "@mui/material";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import Chatbot from "../../chatbot";

const gridTemplateLargeScreens = `
  "a b c"
  "a b c"
  "a b c"
  "a b f"
  "d e f"
  "d e f"
  "d h i"
  "g h i"
  "g h j"
  "g h j"
`;
const gridTemplateSmallScreens = `
  "a"
  "a"
  "a"
  "a"
  "b"
  "b"
  "b"
  "b"
  "c"
  "c"
  "c"
  "d"
  "d"
  "d"
  "e"
  "e"
  "f"
  "f"
  "f"
  "g"
  "g"
  "g"
  "h"
  "h"
  "h"
  "h"
  "i"
  "i"
  "j"
  "j"
`;

const Dashboard = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Box position="relative" height="100%">
      {/* Main Dashboard Grid */}
      <Box
        width="100%"
        height="100%"
        display="grid"
        gap="1.5rem"
        sx={
          isAboveMediumScreens
            ? {
                gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
                gridTemplateAreas: gridTemplateLargeScreens,
              }
            : {
                gridAutoColumns: "1fr",
                gridAutoRows: "80px",
                gridTemplateAreas: gridTemplateSmallScreens,
              }
        }
      >
        <Row1 />
        <Row2 />
        <Row3 />
      </Box>

      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 60,
          height: 60,
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
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
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
              m: 2,
            }}
          >
            <Chatbot onClose={() => setIsChatOpen(false)} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
