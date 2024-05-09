import axios from 'axios';
import { useSnackbar } from 'notistack';

const apiUrl = 'http://localhost:3000/friends';

export const sendFriendRequest = async (receiverId, token, enqueueSnackbar) => {
    try {
      const response = await axios.post(`${apiUrl}/sendFriendRequest`, { receiverId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      enqueueSnackbar('Friend request sent successfully.', { variant: 'success' });
      return response.data.friendshipId;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
};

export const revokeFriendRequest = async (friendshipId, token, enqueueSnackbar, admin=false, userId=null) => {
    try {
      if (admin){
        await axios.delete(`${apiUrl}/adminRevokeFriendRequest/${friendshipId}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId }
        });
      }
      else{
        await axios.delete(`${apiUrl}/revokeFriendRequest/${friendshipId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      enqueueSnackbar('Friend request revoked successfully.', { variant: 'success' });
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
};

export const rejectFriendRequest = async (friendshipId, token, enqueueSnackbar, admin=false) => {
  try {
    await axios.patch(`${apiUrl}/rejectFriendRequest/${friendshipId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    enqueueSnackbar('Friend request rejected successfully.', { variant: 'success' });
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (friendshipId, token, enqueueSnackbar, admin=false, userId=null) => {
  try {
    if (admin){
      await axios.patch(`${apiUrl}/adminAcceptFriendRequest/${friendshipId}`, {
        userId: userId
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    }
    else{
      await axios.patch(`${apiUrl}/acceptFriendRequest/${friendshipId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    enqueueSnackbar('Friend request accepted successfully.', { variant: 'success' });
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const removeFriend = async (friendshipId, token, enqueueSnackbar, admin=false, userId=null) => {
  try {
    if (admin){
      await axios.delete(`${apiUrl}/adminDeleteFriendship/${friendshipId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId }
      });
    }
    else{
      await axios.delete(`${apiUrl}/deleteFriendship/${friendshipId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    enqueueSnackbar('Friend removed successfully.', { variant: 'success' });
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}