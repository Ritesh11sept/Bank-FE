import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "1rem",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "300px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(229, 231, 235, 0.5)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)",
  }
}));

export default DashboardBox;
