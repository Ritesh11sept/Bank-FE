import PixIcon from "@mui/icons-material/Pix";
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Navbar = () => {
  const { palette } = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: "background.paper",
        boxShadow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <FlexBetween>
          <Box display="flex" alignItems="center" gap={1}>
            <PixIcon sx={{ fontSize: 28, color: palette.primary.main }} />
            <Typography variant="h4" fontSize={20} color={palette.grey[800]} fontWeight="bold">
              Finanseer
            </Typography>
          </Box>
        </FlexBetween>

        <Box display="flex" gap={2}>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton>
            <PersonOutlineIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
