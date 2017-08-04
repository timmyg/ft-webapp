import { Meteor } from 'meteor/meteor';
import { Auctions } from '../../api/movies/movies.js';

Meteor.methods({
  getLocations() {
    let locations = _.uniq(_.pluck(Auctions.find().fetch(),"location"));
    return _.reject(locations, (l) => { return l == "offsite" })
  }
});
