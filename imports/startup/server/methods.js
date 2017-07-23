import { Meteor } from 'meteor/meteor';
import { Auctions } from '../../api/movies/movies.js';

Meteor.methods({
  getLocations() {
    console.log(_.uniq(_.pluck(Auctions.find().fetch(),"location")));
    return _.uniq(_.pluck(Auctions.find().fetch(),"location"));
  }
});
