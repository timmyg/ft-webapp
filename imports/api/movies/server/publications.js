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

  // let query = {
  //   "auction.end" : {
  //     $gte : new Date()
  //   }
  // }
  let query = {
    "$and": []
  }

  if (isCompleted) {
    query["$and"].push({
      "auction.end" : {
        $lt: new Date()
      }
    })
  } else {
    query["$and"].push({
      "auction.end" : {
        $gte: new Date()
      }
    })
  }

  if (isOpenBox || isNew) {
    let orQuery = { "$or": [] };
    if (isOpenBox) {
      const regex = new RegExp("open box", 'i');
      orQuery["$or"].push({
        additionalInfo: regex
      })
    }
    if (isNew) {
      const regex = new RegExp("appears new", 'i');
      orQuery["$or"].push({
        additionalInfo: regex
      })
    }
    console.log("orQuery", orQuery);
    query["$and"].push(orQuery);
    console.log("query", query);

  }

  if (locationsArray && locationsArray.length) {
    query["$and"].push({
      "auction.location": {
          "$in": locationsArray
      }
    })
  }

  const projection = { limit: 10, sort: { 'auction.end': 1 } };

  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    const orQuery = {
      '$or': [
        { description: regex },
        { brand: regex },
        { model: regex },
        { specs: regex },
      ]
    };
    query["$and"].push(orQuery);
    projection.limit = 100;
  }
  console.log(JSON.stringify(query, projection));
  return Movies.find(query, projection);
});
