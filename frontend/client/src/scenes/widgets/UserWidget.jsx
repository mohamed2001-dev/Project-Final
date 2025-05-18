import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  LocationOn,
  Work,
  People,
  Visibility,
  TrendingUp,
  Twitter,
  LinkedIn,
  MoreHoriz,
} from "@mui/icons-material";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.user._id);
  const isCurrentUser = currentUserId === userId;

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
  }, [getUser]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow API call
  };

  if (!user) {
    return (
      <WidgetWrapper>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </WidgetWrapper>
    );
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* Profile Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box
          display="flex"
          gap={2}
          onClick={() => navigate(`/profile/${userId}`)}
          sx={{ cursor: "pointer" }}
        >
          <Avatar
            src={`http://localhost:3001/assets/${picturePath}`}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5" fontWeight="600">
              {firstName} {lastName}
            </Typography>
            <Typography color="textSecondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <People fontSize="small" /> {friends.length} friends
            </Typography>
            {!isCurrentUser && (
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                size="small"
                sx={{ mt: 1 }}
                onClick={handleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </Box>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreHoriz />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Share Profile</MenuItem>
          {isCurrentUser && <MenuItem onClick={() => navigate("/settings")}>Edit Profile</MenuItem>}
          <MenuItem onClick={handleMenuClose}>Report</MenuItem>
        </Menu>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* User Info */}
      <Box mb={2}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LocationOn color="primary" />
          <Typography>{location || "No location specified"}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Work color="primary" />
          <Typography>{occupation || "No occupation specified"}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stats */}
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Visibility color="primary" /> Profile Views
          </Typography>
          <Typography fontWeight="500">{viewedProfile}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TrendingUp color="primary" /> Post Impressions
          </Typography>
          <Typography fontWeight="500">{impressions}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Social Links */}
      <Box>
        <Typography variant="subtitle1" fontWeight="600" mb={1}>
          Social Profiles
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Twitter color="primary" />
            <Box>
              <Typography fontWeight="500">Twitter</Typography>
              <Typography variant="body2" color="textSecondary">
                Social Network
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <Edit fontSize="small" />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <LinkedIn color="primary" />
            <Box>
              <Typography fontWeight="500">LinkedIn</Typography>
              <Typography variant="body2" color="textSecondary">
                Professional Network
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;