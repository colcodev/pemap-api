import asyncHandler from '../helpers/asyncHandler';

// models
import Search from '../models/search';

const getStats = asyncHandler(async (req, res) => {
  const lastSearches = await Search.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .select('point countryId createdAt')
    .exec();

  const response = {
    lastSearches,
  };

  res.json(response);
});

export default { getStats };
