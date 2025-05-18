import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// updateUser
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = req.body;

    // Handle file if uploaded
    if (req.file) {
      updatedData.picturePath = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { id, targetId } = req.params;

    const user = await User.findById(id);
    const target = await User.findById(targetId);

    if (!user || !target) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.friends.includes(targetId) ||
      target.friendRequests.includes(id)
    ) {
      return res.status(400).json({ message: "Already friends or request sent" });
    }

    target.friendRequests.push(id);
    await target.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Confirm a friend request
export const confirmFriendRequest = async (req, res) => {
  try {
    const { id, senderId } = req.params;

    const user = await User.findById(id);
    const sender = await User.findById(senderId);

    if (!user || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "No request from this user" });
    }

    // Add each other as friends
    user.friends.push(senderId);
    sender.friends.push(id);

    // Remove request
    user.friendRequests = user.friendRequests.filter((uid) => uid.toString() !== senderId);

    await user.save();
    await sender.save();

    res.status(200).json({ message: "Friend request confirmed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


