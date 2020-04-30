import { setup, RedisStore } from 'axios-cache-adapter';
import orderBy from 'lodash.orderby';

import asyncHandler from '../helpers/asyncHandler';
import { redisClient } from '../helpers/redis';

// models
import Search from '../models/search';

// config redis cache for axios requests
const axiosStore = new RedisStore(redisClient);
const maxAge = 60 * 1000; // TODO: make administrable via endpoint (1 min)

// config an axios instance with cache
const axiosCached = setup({
  baseURL: process.env.PEYA_API_URL,
  cache: {
    maxAge,
    store: axiosStore,
    exclude: {
      query: false,
    },
  },
});

const getRestaurants = asyncHandler(async (req, res) => {
  const { authorization: authHeader } = req.headers;
  const { country, point } = req.query;
  const limit = 20;

  const { data: searchResponse, request } = await axiosCached.get('/search/restaurants', {
    params: {
      country,
      point,
      fields:
        'id,name,logo,deliveryTimeMaxMinutes,link,ratingScore,coordinates,topCategories,categories,opened',
      max: limit,
    },
    headers: {
      Authorization: authHeader,
    },
  });

  // save last search if is not from cache
  if (!request.fromCache) {
    const newSearchHistory = new Search({
      point,
      countryId: country,
    });

    await newSearchHistory.save();
  }

  // filter and sort response data
  const filteredResponse = searchResponse.data.filter(({ opened }) => !!opened);
  const responseData = orderBy(filteredResponse, 'ratingScore', 'desc');

  res.json({
    count: searchResponse.count,
    data: responseData,
  });
});

export default { getRestaurants };
