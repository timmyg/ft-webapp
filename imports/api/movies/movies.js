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
  description: {
    type: String,
    label: '',
  },
  additionalInfo: {
    type: String,
    label: '',
  },
  brand: {
    type: String,
    label: '',
  },
  model: {
    type: String,
    label: '',
  },
  specs: {
    type: String,
    label: '',
  },
  auction: {
    type: Object,
  },
});

Movies.attachSchema(MoviesSchema);
