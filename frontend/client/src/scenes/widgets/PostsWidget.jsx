import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, addPosts } from "state";
import PostWidget from "./PostWidget";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 5;

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = isProfile
        ? `http://localhost:3001/posts/${userId}/posts?page=${page}&limit=${postsPerPage}`
        : `http://localhost:3001/posts?page=${page}&limit=${postsPerPage}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Fetched posts:", data); // should be an array

      const newPosts = Array.isArray(data) ? data : data.posts || [];

      if (page === 1) {
        dispatch(setPosts({ posts: newPosts }));
      } else {
        dispatch(addPosts({ posts: newPosts }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, token, page, postsPerPage, userId, isProfile]);

  useEffect(() => {
    setPage(1);
    dispatch(setPosts({ posts: [] }));
  }, [userId, isProfile, dispatch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!Array.isArray(posts)) return null;

  return (
    <Box>
      {isLoading && posts.length === 0 ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            {isProfile ? "No posts to display" : "No posts found"}
          </Typography>
          {!isProfile && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              sx={{ mt: 2 }}
            >
              Create First Post
            </Button>
          )}
        </Box>
      ) : (
        <>
          {posts.map((post) => (
            <PostWidget
              key={post._id}
              postId={post._id}
              postUserId={post.userId}
              name={`${post.firstName} ${post.lastName}`}
              description={post.description}
              location={post.location}
              picturePath={post.picturePath}
              userPicturePath={post.userPicturePath}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
          {posts.length >= postsPerPage * page && (
            <Box textAlign="center" mt={2}>
              <Button
                variant="outlined"
                onClick={loadMorePosts}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PostsWidget;
