import { Box, useMediaQuery } from "@mui/material"; // Remove Fab import
import { useState } from "react";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import DashboardLayout from "@/components/DashboardLayout";
// Remove MessageSquare and Chatbot imports

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
  "a" "a" "a" "a"
  "b" "b" "b" "b"
  "c" "c" "c"
  "d" "d" "d"
  "e" "e"
  "f" "f" "f"
  "g" "g" "g"
  "h" "h" "h" "h"
  "i" "i"
  "j" "j"
`;

const Dashboard = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  // Remove isChatOpen state

  return (
    <DashboardLayout>
      <Box
        width="100%"
        height="100%"
        p="1.5rem 2rem"
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          minHeight: 'calc(100vh - 64px)', // Account for navbar height
        }}
      >
        <Box
          width="100%"
          height="100%"
          display="grid"
          gap="1.5rem"
          sx={{
            gridTemplateColumns: isAboveMediumScreens
              ? "repeat(3, minmax(370px, 1fr))"
              : "1fr",
            gridTemplateRows: "auto",
            gridTemplateAreas: isAboveMediumScreens
              ? gridTemplateLargeScreens
              : gridTemplateSmallScreens,
            "& > div": {
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
              }
            }
          }}
        >
          <Row1 />
          <Row2 />
          <Row3 />
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
