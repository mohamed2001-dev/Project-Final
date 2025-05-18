import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  PersonAdd,
  PersonRemove,
  Message,
  MoreVert,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";

const Friend = ({ friendId, name, subtitle, userPicturePath, isOnline }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const theme = useTheme();

  const isFriend = friends.find((friend) => friend._id === friendId);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const patchFriend = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error updating friend status:", error);
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${friendId}`);
  };

  return (
    <FlexBetween
      sx={{
        p: 1,
        borderRadius: 2,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <FlexBetween gap={2}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          color={isOnline ? "success" : "default"}
          invisible={!isOnline}
        >
          <Avatar
            src={`http://localhost:3001/assets/${userPicturePath}`}
            sx={{ width: 56, height: 56 }}
            onClick={() => navigate(`/profile/${friendId}`)}
          />
        </Badge>
        <Box
          onClick={() => navigate(`/profile/${friendId}`)}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="500"
            color={theme.palette.text.primary}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color={theme.palette.text.secondary}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>

      <Box display="flex" gap={1}>
        <Tooltip title={isFriend ? "Remove friend" : "Add friend"}>
          <IconButton
            onClick={patchFriend}
            sx={{
              backgroundColor: theme.palette.action.selected,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {isFriend ? (
              <PersonRemove color="error" />
            ) : (
              <PersonAdd color="primary" />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Message">
          <IconButton
            onClick={handleMessage}
            sx={{
              backgroundColor: theme.palette.action.selected,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Message color="primary" />
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={handleMenuClick}
          sx={{
            backgroundColor: theme.palette.action.selected,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Block User</MenuItem>
          <MenuItem onClick={handleMenuClose}>Report User</MenuItem>
        </Menu>
      </Box>
    </FlexBetween>
  );
};

export default Friend;