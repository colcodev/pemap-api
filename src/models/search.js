import mongoose from 'mongoose';

const { Schema } = mongoose;

const searchSchema = new Schema(
  {
    point: {
      type: Schema.Types.String,
      required: true,
    },
    countryId: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Search = mongoose.model('Search', searchSchema);

export default Search;
