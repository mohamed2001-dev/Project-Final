import {
  Box,
  useMediaQuery,
  Typography,
  Container,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import UpdateProfileForm from "../../components/UpdateProfileForm";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.user?._id);
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const theme = useTheme();

  const getUser = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [userId, token]);

  useEffect(() => {
    getUser();
  }, [getUser, userId]);

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const isCurrentUser = userId === currentUserId;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Navbar removed here */}

      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            <Box>
              <UserWidget userId={userId} picturePath={user.picturePath} />
              <Divider sx={{ my: 3 }} />
              <FriendListWidget userId={userId} />
            </Box>
          )}

          {/* Main Content */}
          <Box>
            {isCurrentUser && (
              <Box
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 4,
                  p: 3,
                  mb: 3,
                  boxShadow: theme.shadows[1],
                }}
              >
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Edit Profile
                </Typography>
                <UpdateProfileForm user={user} onUpdate={getUser} />
              </Box>
            )}

            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 4,
                p: 3,
                mb: 3,
                boxShadow: theme.shadows[1],
              }}
            >
              <MyPostWidget picturePath={user.picturePath} />
            </Box>

            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 4,
                p: 3,
                boxShadow: theme.shadows[1],
              }}
            >
              <PostsWidget userId={userId} isProfile />
            </Box>
          </Box>

          {/* Right Sidebar - Friends (Mobile shows at bottom) */}
          {!isNonMobile && (
            <Box mt={4}>
              <UserWidget userId={userId} picturePath={user.picturePath} />
              <Divider sx={{ my: 3 }} />
              <FriendListWidget userId={userId} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
