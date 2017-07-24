import { Meteor } from 'meteor/meteor';
import { Auctions } from '../../api/movies/movies.js';

Meteor.methods({
  getLocations() {
    return _.uniq(_.pluck(Auctions.find().fetch(),"location"));
  }
});
