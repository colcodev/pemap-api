import axios from 'axios';

const tokensApiUrl = `${process.env.PEYA_API_URL}/tokens`;

const getAppToken = (req, res, next) => {
  axios
    .get(tokensApiUrl, {
      params: {
        clientId: process.env.PEYA_CLIENT_ID,
        clientSecret: process.env.PEYA_CLIENT_SECRET,
      },
    })
    .then(({ data }) => res.json(data))
    .catch((err) => next(err));
};

const getUserToken = (req, res, next) => {
  const { userName, password } = req.query;
  const { authorization: authHeader } = req.headers;

  axios
    .get(tokensApiUrl, {
      params: {
        userName,
        password,
      },
      headers: {
        Authorization: authHeader,
      },
    })
    .then(({ data }) => res.json(data))
    .catch((err) => next(err));
};

export default { getAppToken, getUserToken };
