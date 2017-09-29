/* eslint-disable new-cap */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Movies } from '../movies.js';
import _ from 'underscore';

Meteor.publish('movies.search', (searchTerm, locationsArray, filters, pageOffset) => {
  console.log("pageOffset", pageOffset);

  check(filters, Match.ObjectIncluding({}));
  check(filters.completed, Match.OneOf(Boolean, null, undefined));
  check(filters.new, Match.OneOf(Boolean, null, undefined));
  check(filters.openbox, Match.OneOf(Boolean, null, undefined));
  check(searchTerm, Match.OneOf(String, null, undefined));
  check(locationsArray, Match.OneOf([String], null, undefined));
  check(pageOffset, Match.OneOf(Number));

  let isCompleted = filters.completed;
  let isOpenBox = filters.openbox;
  let isNew = filters.new;
  let projection = {
    limit: 10,
    sort: {
      'auction.end': 1
    }
  };
  let query = { "$and": [] }

  /* -_-_- Completed Listings -_-_- */
  if (isCompleted) {
    query["$and"].push({
      "auction.end" : {
        $lt: new Date()
      }
    })
    projection.sort['auction.end'] = -1
  } else {
    query["$and"].push({
      "auction.end" : {
        $gte: new Date()
      }
    })
  }

  /* -_-_- Condition -_-_- */
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
    query["$and"].push(orQuery);
  }

  /* -_-_- Locations -_-_- */
  if (locationsArray && locationsArray.length) {
    query["$and"].push({
      "auction.location": {
          "$in": locationsArray
      }
    })
  }

  /* -_-_- Search Query -_-_- */
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

  /* -_-_- Paging -_-_- */
  if (pageOffset) {
    projection.skip = pageOffset * projection.limit;
  }

  console.log(query, projection);

  return Movies.find(query, projection);
});
