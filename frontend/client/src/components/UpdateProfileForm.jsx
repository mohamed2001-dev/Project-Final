import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LocationOn, Work, Edit, Check, Close } from "@mui/icons-material";
import { setUser } from "state"; // <-- import your Redux action

const UpdateProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    location: user.location || "",
    occupation: user.occupation || "",
    bio: user.bio || "",
  });

  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("location", formData.location);
    data.append("occupation", formData.occupation);
    data.append("bio", formData.bio);
    if (picture) {
      data.append("picture", picture);
      data.append("picturePath", picture.name);
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();

      // Update global redux user state immediately
      dispatch(setUser(updatedUser));

      // Also call onUpdate prop if parent needs update
      if (onUpdate) onUpdate(updatedUser);

      setPreview(null);
      setPicture(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 2,
        backgroundColor: palette.background.paper,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="600" color={palette.text.primary}>
          Profile Information
        </Typography>
        {isEditing ? (
          <Box>
            <IconButton onClick={() => setIsEditing(false)} sx={{ color: palette.error.main }}>
              <Close />
            </IconButton>
            <IconButton
              onClick={handleSubmit}
              sx={{ color: palette.primary.main }}
              disabled={isLoading}
            >
              <Check />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={() => setIsEditing(true)}>
            <Edit />
          </IconButton>
        )}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Avatar
          src={preview || `http://localhost:3001/assets/${user.picturePath}`}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: `2px solid ${palette.primary.main}`,
          }}
        />
        {isEditing && (
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderColor: palette.primary.main,
              color: palette.primary.main,
              "&:hover": {
                backgroundColor: palette.primary.light,
                color: palette.primary.contrastText,
              },
            }}
          >
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePictureChange}
            />
          </Button>
        )}
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mb={2}>
          <TextField
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: isEditing
                  ? palette.background.default
                  : palette.action.disabledBackground,
              },
            }}
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: isEditing
                  ? palette.background.default
                  : palette.action.disabledBackground,
              },
            }}
          />
        </Box>

        <TextField
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
          disabled={!isEditing}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn color={isEditing ? "primary" : "disabled"} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiInputBase-root": {
              backgroundColor: isEditing
                ? palette.background.default
                : palette.action.disabledBackground,
            },
          }}
        />

        <TextField
          name="occupation"
          label="Occupation"
          value={formData.occupation}
          onChange={handleChange}
          disabled={!isEditing}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Work color={isEditing ? "primary" : "disabled"} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiInputBase-root": {
              backgroundColor: isEditing
                ? palette.background.default
                : palette.action.disabledBackground,
            },
          }}
        />

        <TextField
          name="bio"
          label="About You"
          value={formData.bio}
          onChange={handleChange}
          disabled={!isEditing}
          fullWidth
          multiline
          rows={4}
          sx={{
            mb: 2,
            "& .MuiInputBase-root": {
              backgroundColor: isEditing
                ? palette.background.default
                : palette.action.disabledBackground,
            },
          }}
        />

        {isEditing && (
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              backgroundColor: palette.primary.main,
              "&:hover": {
                backgroundColor: palette.primary.dark,
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UpdateProfileForm;
