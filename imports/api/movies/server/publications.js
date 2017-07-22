/* eslint-disable new-cap */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Movies } from '../movies.js';

Meteor.publish('movies.search', (searchTerm) => {
  check(searchTerm, Match.OneOf(String, null, undefined));

  let query = {"auction.end" : { $gte : new Date() }};
  const projection = { limit: 10, sort: { 'auction.end': 1 } };

  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    query['$or'] = [
        { description: regex },
        { brand: regex },
        { model: regex },
        { specs: regex },
      ];
    projection.limit = 100;
  }

  console.log(query, projection);
  return Movies.find(query, projection);
});
