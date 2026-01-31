import axios from 'axios';

/**
 * Proxy para HubSpot: Evita exposição do Token no Frontend
 */
export const hubspotProxy = async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      req.body,
      {
        headers: {
          Authorization: 'Bearer ' + process.env.VITE_HUBSPOT_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'HubSpot Proxy Error' });
  }
};
