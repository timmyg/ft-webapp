import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { composeWithTracker } from 'react-komposer';
import { Movies } from '../../api/movies/movies.js';
import MoviesList from '../components/Movies.js';
import { Loading } from '../components/Loading.js';

const searchQuery = new ReactiveVar(null);
const completed = new ReactiveVar(null);
const optionsChecked2 = new ReactiveVar([]);

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('movies.search', searchQuery.get(), optionsChecked2.get(), completed.get());

  if (subscription.ready()) {
    const movies = Movies.find().fetch();
    onData(null, { movies, searchQuery, optionsChecked2, completed });
  }
};

export default composeWithTracker(composer, Loading)(MoviesList);
