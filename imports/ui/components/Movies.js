import React from 'react';
import { Alert, Row, Checkbox, Col, Panel, FormControl, Image, Button } from 'react-bootstrap';
import Moment from 'react-moment';
var typingTimeout = null;

class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: null,
      locations: [3,4,5]
    };
    const cxt = this;
    this.handleSearch = this.handleSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    Meteor.call('getLocations', function(err, locationsArray) {
      cxt.setState({locations: locationsArray});
    });
  }

  handleInputChange(event) {
    console.log("handleInputChange", event);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    debugger

    this.setState({
     [name]: value
    });
  }

  handleSearch(event) {
    clearTimeout(typingTimeout);
    let context = this;
    const searchTerm = event.target.value;
    typingTimeout = setTimeout(function () {
      context.setState({ searchTerm: searchTerm });
      context.props.searchQuery.set(searchTerm);
    }, 500);
  }

  render() {
    var context = this;
    const { locations, movies } = this.props;
    return (<div className="Movies">
      <Col xs={ 12 }>
        <div className="MovieSearch">
          <i className="fa fa-search" />
          <FormControl
            type="search"
            onKeyUp={ this.handleSearch }
            placeholder="What do you want to buy?"
            className="Search"
          />
        </div>
      </Col>
      <Col xs={ 12 }>
        <ul className="list-inline">
          { this.state.locations && this.state.locations.length > 0 ? this.state.locations.map(function(name, index){
            return <li key={ index }><Checkbox onChange={ this.handleInputChange }>{ name }</Checkbox></li>
          }): null }
        </ul>
      </Col>
      <div className="Movies-list">
        <Row className="text-center">
          <span>
            Results: {movies.length}
          </span>
        </Row>
        <br/>
        { movies.length > 0 ? movies.map(({ id, msrp, link, description, additionalInfo, brand, model, specs, auction }) => (
          <Col key={ id } xs={ 12 } sm={ 6 }>
            <Panel header={`${description}`}>
                <Row>
                  <Col xs={ 12 } sm={ 5 }>
                    <Image src={ `http://d2c3kiufvhjdfg.cloudfront.net/Pics/${id}a.JPG` } alt={ id } responsive />
                  </Col>
                  <Col xs={ 12 } sm={ 7 }>
                    <p><strong>location:</strong> { auction.location }</p>
                    {msrp ? <p><strong>msrp:</strong> { msrp }</p> : null}
                    <p><strong>description:</strong> { description }</p>
                    {msrp ? <p><strong>brand:</strong> { brand }</p> : null}
                    {msrp ? <p><strong>model:</strong> { model }</p> : null}
                    {msrp ? <p><strong>specs:</strong> { specs }</p> : null}
                    <p><strong>state:</strong> { additionalInfo }</p>
                    <p><strong>ending:</strong>
                      &nbsp;<Moment fromNow>{ auction.end }</Moment>
                      <em>&nbsp;(<Moment format="M/DD h:mm">{ auction.end }</Moment>)</em>
                    </p>
                    <br/>
                    <br/>
                    <p>
                      <a href={ link } target="_blank" className="pull-right btn btn-default">View</a>
                    </p>
                  </Col>
                </Row>
            </Panel>
          </Col>
        )) : <Alert>Sorry. No items found for '{ this.state.searchTerm }.'</Alert> }
      </div>
    </div>);
  }
}

Movies.propTypes = {
  movies: React.PropTypes.array,
  searchQuery: React.PropTypes.object,
  locations: React.PropTypes.array,
};

export default Movies;
