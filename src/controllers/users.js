import axios from 'axios';

import asyncHandler from '../helpers/asyncHandler';

const getAccountInfo = asyncHandler(async (req, res) => {
  const { authorization: authHeader } = req.headers;

  const { data } = await axios.get(`${process.env.PEYA_API_URL}/myAccount`, {
    headers: {
      Authorization: authHeader,
    },
  });

  res.json(data);
});

export default { getAccountInfo };
