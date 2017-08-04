/* eslint-disable new-cap */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Movies } from '../movies.js';
import _ from 'underscore';

Meteor.publish('movies.search', (searchTerm, locationsArray, completed) => {
  check(completed, Match.OneOf(Boolean, null, undefined));
  check(searchTerm, Match.OneOf(String, null, undefined));
  check(locationsArray, Match.OneOf([String], null, undefined));
  console.log("completed", completed);

  let query = {
    "auction.end" : {
      $gte : new Date()
    }
  }
  if (completed) {
    query = {
      "auction.end" : {
        $lte : new Date()
      }
    }
  }
  if (locationsArray && locationsArray.length) {
    query["auction.location"] = {};
    query["auction.location"]["$in"] = locationsArray;
  }

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
  console.log(JSON.stringify(query));
  return Movies.find(query, projection);
});
