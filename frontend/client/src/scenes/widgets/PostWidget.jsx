import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Avatar,
  TextField,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
  Share,
  MoreVert,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removePost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [postUser, setPostUser] = useState(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const isOwner = loggedInUserId === postUserId;

  // 🔍 Fetch post owner's user data
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3001/users/${postUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPostUser(data);
    };
    fetchUser();
  }, [postUserId, token]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const patchLike = async () => {
    const res = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await res.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        dispatch(removePost(postId));
      }
    } catch (err) {
      console.error("Error deleting post", err);
    } finally {
      handleMenuClose();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment }),
      });
      const updatedPost = await res.json();
      dispatch(setPost({ post: updatedPost }));
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <WidgetWrapper mb={3}>
      {/* Post Header */}
      <FlexBetween mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={`http://localhost:3001/assets/${userPicturePath}`} />
          <Box>
            <Typography fontWeight="500">
              {postUser ? postUser.firstName + " " + postUser.lastName : "Loading..."}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {location}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {isOwner && <MenuItem onClick={handleDelete}>Delete Post</MenuItem>}
          <MenuItem onClick={() => setIsBookmarked(!isBookmarked)}>
            {isBookmarked ? "Remove Bookmark" : "Save Post"}
          </MenuItem>
          <MenuItem>Report Post</MenuItem>
        </Menu>
      </FlexBetween>

      {/* Post Content */}
      <Typography mb={2}>{description}</Typography>
      {picturePath && (
        <Box
          component="img"
          width="100%"
          height="auto"
          alt="post"
          src={`http://localhost:3001/assets/${picturePath}`}
          sx={{ borderRadius: 2, mb: 2, boxShadow: 1 }}
        />
      )}

      {/* Post Actions */}
      <FlexBetween mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={patchLike}>
            {isLiked ? (
              <Favorite sx={{ color: palette.primary.main }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
          <Typography>{likeCount}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => setIsComments(!isComments)}>
            <ChatBubbleOutline />
          </IconButton>
          <Typography>{comments.length}</Typography>
        </Box>
        <IconButton>
          <Share />
        </IconButton>
        <IconButton onClick={() => setIsBookmarked(!isBookmarked)}>
          {isBookmarked ? (
            <Bookmark sx={{ color: palette.primary.main }} />
          ) : (
            <BookmarkBorder />
          )}
        </IconButton>
      </FlexBetween>

      {/* Comments Section */}
      {isComments && (
        <Box mt={2}>
          <form onSubmit={handleCommentSubmit}>
            <FlexBetween gap={1}>
              <Avatar
                src={`http://localhost:3001/assets/${userPicturePath}`}
                sx={{ width: 32, height: 32 }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit" variant="text" color="primary">
                Post
              </Button>
            </FlexBetween>
          </form>

          {comments.length > 0 && (
            <Box mt={2}>
              {comments.map((comment, i) => (
                <Box key={i} mb={1}>
                  <Divider />
                  <Box display="flex" gap={1} mt={1}>
                    <Avatar
                      src={`http://localhost:3001/assets/${comment.userPicturePath}`}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography fontWeight="500">{comment.userName}</Typography>
                      <Typography>{comment.text}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
