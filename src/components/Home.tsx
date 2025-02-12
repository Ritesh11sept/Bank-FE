import { Box, Button, Card, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Typography
          variant="h1"
          component={motion.h1}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            fontSize: { xs: "2.5rem", md: "4rem" },
            fontWeight: "bold",
            textAlign: "center",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Welcome to FinanceHub
        </Typography>

        <Card
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          sx={{
            p: 4,
            maxWidth: 600,
            width: "100%",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            We're your trusted partner in financial planning and analysis. Our platform
            provides cutting-edge tools and insights to help you make better financial
            decisions.
          </Typography>
        </Card>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Grid item>
            <Button
              variant="contained"
              size="large"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                color: "white",
                px: 4,
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderColor: "#2196F3",
                color: "#2196F3",
                px: 4,
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderColor: "#FF9800",
                color: "#FF9800",
                px: 4,
              }}
              onClick={() => navigate("/landing")}
            >
              Landing Page
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
