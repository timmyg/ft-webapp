/* eslint-disable new-cap */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Movies } from '../movies.js';
import _ from 'underscore';

Meteor.publish('movies.search', (searchTerm, locationsArray, filters) => {
  console.log("filters", filters);

  check(filters, Match.ObjectIncluding({}));
  check(filters.completed, Match.OneOf(Boolean, null, undefined));
  check(filters.new, Match.OneOf(Boolean, null, undefined));
  check(filters.openbox, Match.OneOf(Boolean, null, undefined));
  check(searchTerm, Match.OneOf(String, null, undefined));
  check(locationsArray, Match.OneOf([String], null, undefined));

  let isCompleted = filters.completed;
  let isOpenBox = filters.openbox;
  let isNew = filters.new;

  let query = {
    "auction.end" : {
      $gte : new Date()
    }
  }

  if (isCompleted) {
    query = {
      "auction.end" : {
        $lte : new Date()
      }
    }
  }

  if (isOpenBox) {
    const regex = new RegExp("open box", 'i');
    query["$or"] = regex;
    query["additionalInfo"] = regex;
  }

  if (isNew) {
    const regex = new RegExp("appears new", 'i');
    query["additionalInfo"] = regex;
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
