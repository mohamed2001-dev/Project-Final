import { Box, useMediaQuery, Container, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";


const HomePage = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>

      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          [theme.breakpoints.down("sm")]: {
            px: 2,
          },
        }}
      >
        <Box
          display="grid"
          gridTemplateColumns={
            isNonMobile
              ? "minmax(300px, 1fr) 2fr minmax(300px, 1fr)"
              : "1fr"
          }
          gap={4}
        >
          {/* Left Sidebar - User Info */}
          {isNonMobile && (
            <Box
              sx={{
                borderRight: `1px solid ${theme.palette.divider}`,
                pr: 3,
              }}
            >
              <UserWidget userId={_id} picturePath={picturePath} />
            </Box>
          )}

          {/* Main Content */}
          <Box
            sx={{
              borderRight: isNonMobile
                ? `1px solid ${theme.palette.divider}`
                : "none",
              pr: isNonMobile ? 3 : 0,
            }}
          >
            <MyPostWidget picturePath={picturePath} />
            <Box mt={3}>
              <PostsWidget userId={_id} />
            </Box>
          </Box>

          
          {!isNonMobile && (
            <Box mt={4}>
              <FriendListWidget userId={_id} />
            </Box>
          )}

          {isNonMobile && (
            <Box>
              <AdvertWidget />
              <Box mt={3}>
                <FriendListWidget userId={_id} />
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
