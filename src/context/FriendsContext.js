import axios from 'axios';
import { useSnackbar } from 'notistack';

const apiUrl = 'http://localhost:3000/friends';

export const sendFriendRequest = async (receiverId, token, enqueueSnackbar) => {
    try {
      const response = await axios.post(`${apiUrl}/sendFriendRequest`, { receiverId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      enqueueSnackbar('Solicitud de amistad enviada con éxito.', { variant: 'success' });
      return response.data.friendshipId;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
};

export const revokeFriendRequest = async (friendshipId, token, enqueueSnackbar) => {
    try {
      await axios.delete(`${apiUrl}/revokeFriendRequest/${friendshipId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      enqueueSnackbar('Solicitud de amistad revocada con éxito.', { variant: 'success' });
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
};