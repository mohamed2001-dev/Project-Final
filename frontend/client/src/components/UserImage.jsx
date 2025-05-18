import { Avatar, Badge, useTheme } from "@mui/material";
import { styled } from "@mui/system";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserImage = ({ image, size = 40, isOnline = false, onClick }) => {
  const theme = useTheme();
  const avatar = (
    <Avatar
      src={`http://localhost:3001/assets/${image}`}
      sx={{
        width: size,
        height: size,
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          boxShadow: onClick ? `0 0 0 2px ${theme.palette.primary.main}` : "none",
        },
      }}
      onClick={onClick}
    />
  );

  return isOnline ? (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      {avatar}
    </StyledBadge>
  ) : (
    avatar
  );
};

export default UserImage;