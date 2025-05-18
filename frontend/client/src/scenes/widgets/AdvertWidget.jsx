import { Typography, useTheme, Button, Box, Avatar } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { Link } from "react-router-dom";
import { ShoppingBag, OpenInNew } from "@mui/icons-material";

const AdvertWidget = () => {
  const theme = useTheme();
  const { palette } = theme;
  const primaryDark = palette.primary.dark;
  const neutralDark = palette.neutral.dark;
  const neutralMedium = palette.neutral.medium;
  const neutralMain = palette.neutral.main;

  return (
    <WidgetWrapper>
      <FlexBetween mb={2}>
        <Typography 
          variant="h6" 
          fontWeight="600"
          color={neutralDark}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <ShoppingBag fontSize="small" />
          Sponsored Content
        </Typography>
        <Button 
          component={Link}
          to="/ads/create"
          variant="text"
          size="small"
          endIcon={<OpenInNew fontSize="small" />}
          sx={{
            color: neutralMedium,
            textTransform: 'none',
            '&:hover': {
              color: primaryDark,
              backgroundColor: 'transparent'
            }
          }}
        >
          Create Ad
        </Button>
      </FlexBetween>

      <Box
        component="img"
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        sx={{
          borderRadius: 2,
          mb: 2,
          boxShadow: theme.shadows[2],
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      />

      <FlexBetween alignItems="flex-start" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar 
            alt="MikaCosmetics" 
            src="/path/to/logo.jpg" 
            sx={{ width: 32, height: 32 }}
          />
          <Typography 
            color={neutralMain} 
            fontWeight="500"
            sx={{
              '&:hover': {
                color: primaryDark,
                textDecoration: 'underline',
                cursor: 'pointer'
              }
            }}
          >
            MikaCosmetics
          </Typography>
        </Box>
        <Typography 
          color={neutralMedium}
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <OpenInNew fontSize="inherit" />
          mikacosmetics.com
        </Typography>
      </FlexBetween>

      <Typography 
        color={neutralMedium} 
        variant="body2"
        paragraph
        mb={2}
      >
        Your pathway to stunning and immaculate beauty. Our products ensure your skin 
        is exfoliated and shines with natural radiance.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        size="medium"
        sx={{
          backgroundColor: primaryDark,
          color: palette.background.alt,
          borderRadius: 2,
          py: 1,
          '&:hover': {
            backgroundColor: palette.primary.main
          }
        }}
      >
        Shop Now
      </Button>
    </WidgetWrapper>
  );
};

export default AdvertWidget;