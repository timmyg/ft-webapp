import React from 'react';
import { Alert, Row, Checkbox, Col, Panel, FormControl, Image, Button } from 'react-bootstrap';
import Moment from 'react-moment';
var typingTimeout = null;

class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: null,
      locations: null,
      optionsChecked: []
    };
    const cxt = this;
    this.context = cxt;
    this.handleSearch = this.handleSearch.bind(this);

    Meteor.call('getLocations', function(err, locationsArray) {
      cxt.setState({locations: locationsArray});
    });
  }

  changeEvent(e) {
    console.log("changeEvent", e.target.value, e.target.checked);
    let checkedArray = this.state.optionsChecked;
    let selectedValue = event.target.value;
    debugger
    if (e.target.checked === true) {
    	checkedArray.push(selectedValue);
      this.setState({ optionsChecked: checkedArray });
    } else {
    	let valueIndex = checkedArray.indexOf(selectedValue);
	    checkedArray.splice(valueIndex, 1);
      this.setState({ optionsChecked: checkedArray });
    }
    console.log(this.state.optionsChecked);
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
    let outputCheckboxes = this.state.locations && this.state.locations.length > 0 ? this.state.locations.map(function(name, i){
      return (
        <span key={ name }><Checkbox value={name} id={'string_' + i} onChange={this.changeEvent.bind(this)} /><label htmlFor={'string_' + i}>{name}</label></span>
      )}, this): null

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
        {this.state.setComp}
      </Col>
      <Col xs={ 12 }>
          { outputCheckboxes }
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
  // setComp: React.PropTypes.object,
  optionsChecked: React.PropTypes.array,
};
//

export default Movies;
