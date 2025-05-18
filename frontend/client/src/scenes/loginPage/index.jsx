import { Box, Typography, useTheme, useMediaQuery, Container } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:900px)");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          py: 4,
          px: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          boxShadow: theme.shadows[2],
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            fontWeight="bold"
            textAlign="center"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.secondary.main} 40%, ${theme.palette.primary.light} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Connectly
          </Typography>
        </Container>
      </Box>

      <Container
        maxWidth="md"
        sx={{
          py: 6,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: isNonMobile ? "600px" : "100%",
            mx: "auto",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            gutterBottom
            textAlign="center"
            sx={{ mb: 4 }}
          >
            {isNonMobile
              ? "Connect with friends and share your experiences"
              : "Welcome to Connectly"}
          </Typography>
          <Form />
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;