import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobile = useMediaQuery("(min-width: 900px)");
  const theme = useTheme();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    handleMenuClose();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        {/* Left side - Logo */}
        <Box
          onClick={() => navigate("/home")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Connectly
          </Typography>
        </Box>

        {/* Center - Navigation Items (Desktop) */}
        {/* Removed navItems */}

        {/* Right side - Icons and Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isNonMobile && (
            <>
              <IconButton onClick={() => dispatch(setMode())} size="large">
                {theme.palette.mode === "dark" ? (
                  <LightMode sx={{ color: theme.palette.neutral.light }} />
                ) : (
                  <DarkMode sx={{ color: theme.palette.neutral.dark }} />
                )}
              </IconButton>

              <IconButton size="large">
                <Badge badgeContent={4} color="primary">
                  <Message />
                </Badge>
              </IconButton>

              <IconButton size="large">
                <Badge badgeContent={3} color="primary">
                  <Notifications />
                </Badge>
              </IconButton>
            </>
          )}

          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{ p: 0, ml: 1 }}
            size="large"
          >
            <Avatar
              alt={user.firstName}
              src={user.picturePath}
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>

          {!isNonMobile && (
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              size="large"
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                navigate(`/profile/${user._id}`);
                handleMenuClose();
              }}
            >
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Avatar /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

        {/* Mobile Menu */}
        {!isNonMobile && (
          <Menu
            anchorEl={mobileMenuOpen ? document.body : null}
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            PaperProps={{
              sx: {
                width: "80vw",
                maxWidth: 400,
                mt: 6,
                p: 2,
              },
            }}
          >
            {/* Removed navItems */}
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <>
                  <LightMode sx={{ mr: 2 }} /> Light Mode
                </>
              ) : (
                <>
                  <DarkMode sx={{ mr: 2 }} /> Dark Mode
                </>
              )}
            </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
