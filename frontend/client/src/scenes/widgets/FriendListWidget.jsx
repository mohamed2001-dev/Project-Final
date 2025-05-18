import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Avatar,
  InputBase,
} from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { Search, Add, MoreHoriz } from "@mui/icons-material";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.user?._id);
  const friends = useSelector((state) => state.user?.friends ?? []);

  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(5);

  // Fetch friend list
  const getFriends = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      // If data is wrapped like { friends: [...] }, unwrap it:
      const friendsArray = Array.isArray(data) ? data : data.friends || [];
      dispatch(setFriends({ friends: friendsArray }));
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }, [userId, token, dispatch]);

  useEffect(() => {
    getFriends();
  }, [getFriends, userId]);

  // Filter based on search (safe fallback)
  const filteredFriends = Array.isArray(friends)
    ? friends.filter((friend) =>
        `${friend.firstName} ${friend.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const displayedFriends = filteredFriends.slice(0, displayCount);

  const handleSendRequest = async (targetId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${currentUserId}/send-request/${targetId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log(data.msg);
      alert("Request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send request.");
    }
  };

  return (
    <WidgetWrapper>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          color={theme.palette.neutral.dark}
          variant="h6"
          fontWeight="600"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
            }}
          >
            {Array.isArray(friends) ? friends.length : 0}
          </Avatar>
          Friends
        </Typography>

        <Box display="flex" gap={1}>
          <IconButton size="small">
            <Add fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          p: 1,
          mb: 2,
          boxShadow: theme.shadows[1],
        }}
      >
        <Search sx={{ color: theme.palette.neutral.medium, mr: 1 }} />
        <InputBase
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "100%" }}
        />
      </Box>

      {/* Friend List */}
      <Box display="flex" flexDirection="column" gap={2}>
        {displayedFriends.length > 0 ? (
          displayedFriends.map((friend) => (
            <Box
              key={friend._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Friend
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
              <IconButton
                onClick={() => handleSendRequest(friend._id)}
                title="Send Request"
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography
            color={theme.palette.neutral.medium}
            textAlign="center"
            py={2}
          >
            {searchTerm ? "No matching friends found" : "No friends to display"}
          </Typography>
        )}
      </Box>

      {/* Show More / Show Less */}
      {filteredFriends.length > displayCount && (
        <Box textAlign="center" mt={2}>
          <Typography
            onClick={() => setDisplayCount(displayCount + 5)}
            sx={{
              color: theme.palette.primary.main,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Show more
          </Typography>
        </Box>
      )}
      {displayCount > 5 && (
        <Box textAlign="center" mt={1}>
          <Typography
            onClick={() => setDisplayCount(5)}
            sx={{
              color: theme.palette.neutral.medium,
              cursor: "pointer",
              fontSize: "0.8rem",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Show less
          </Typography>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;
