import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Movies = new Mongo.Collection('items');

Movies.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Movies.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const MoviesSchema = new SimpleSchema({
  id: {
    type: String,
    label: '',
  },
  msrp: {
    type: Number,
    label: '',
  },
  link: {
    type: String,
    label: '',
  },
  "auction.url": {
    type: String,
    label: '',
  },
  description: {
    type: String,
    label: '',
  },
  "auction.end": {
    type: Date,
    label: '',
  },
});

Movies.attachSchema(MoviesSchema);
