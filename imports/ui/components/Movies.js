import React from 'react';
import { Alert, Row, Checkbox, Col, Panel, FormControl, Image, Button } from 'react-bootstrap';
import Moment from 'react-moment';
var typingTimeout = null;

class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: null,
      searchTerm: null,
      locations: null,
      optionsChecked1: []
    };
    const cxt = this;
    this.context = cxt;
    this.handleSearch = this.handleSearch.bind(this);
    this.clearBox = this.clearBox.bind(this);

    Meteor.call('getLocations', function(err, locationsArray) {
      cxt.setState({locations: locationsArray});
    });
  }

  clearBox(e) {
    this.setState({ searchTerm: "" });
    this.props.searchQuery.set("");
    document.getElementById("search").value = "";
  }

  changeEvent(e) {
    console.log("changeEvent", e.target.value, e.target.checked);
    let checkedArray = this.props.optionsChecked2.get();
    let selectedValue = e.target.value;
    if (e.target.checked) {
    	checkedArray.push(selectedValue);
      this.setState({ optionsChecked1: checkedArray });
      this.props.optionsChecked2.set(checkedArray);
    } else {
    	let valueIndex = checkedArray.indexOf(selectedValue);
	    checkedArray.splice(valueIndex, 1);
      this.setState({ optionsChecked1: checkedArray });
      this.props.optionsChecked2.set(checkedArray);
    }
    console.log(this);
    // TODO update subscription

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

  handleInputChangeDynamic(event) {
    console.log(event);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    var context = this;
    const { locations, movies } = this.props;
    let outputCheckboxes = this.state.locations && this.state.locations.length > 0 ? this.state.locations.map(function(name, i){
      return (
        <span key={ name }>
          <Checkbox value={name} id={'string_' + i} onChange={this.changeEvent.bind(this)}>
            <span className={`${name} label`}>{ name }</span>
          </Checkbox>
        </span>
      )}, this): null

    let otherCheckboxes = (
        <span key="pics">
          <Checkbox name="pics" value="pics" id="pics" onChange={this.handleInputChangeDynamic.bind(this)}>
            <span className="pics label">Pictures Only</span>
          </Checkbox>
        </span>
      );

    return (<div className="Movies">
      <Col xs={ 12 }>
        <div className="MovieSearch">
          <i className="fa fa-search left" />
          <FormControl
            id="search"
            type="search"
            onKeyUp={ this.handleSearch }
            placeholder="What do you want to buy?"
            className="Search"
          />
          <i className="fa fa-close right hand" onClick={this.clearBox.bind(this)}/>
        </div>
      </Col>
      <Col xs={ 12 } md={ 8 } className="locations">
          Filter by Locations:&nbsp;&nbsp;{ outputCheckboxes }
      </Col>
      <Col xs={ 12 } md={ 8 } className="locations">
          Other Filters:&nbsp;&nbsp;{ otherCheckboxes }
      </Col>
      <Col xs={ 12 } className="results-length">
        <div className="text-center">
          <span>
            Results: {movies.length}
          </span>
        </div>
      </Col>
      <div className="Movies-list">
        <br/>
        { movies.length > 0 ? movies.map(({ id, msrp, link, description, additionalInfo, brand, model, specs, auction }) => (
          <Col key={ id } xs={ 12 } sm={ 6 }>
            { this.state.pics ?
              <a href={ link } target="_blank">
                <Image src={ `http://d2c3kiufvhjdfg.cloudfront.net/Pics/${id}a.JPG` } alt={ id } responsive />
              </a>
            : null }
            { !this.state.pics ?
              <Panel header={`${description}`}>
                  <Row>
                      <Col xs={ 12 } sm={ 5 }>
                          <Image src={ `http://d2c3kiufvhjdfg.cloudfront.net/Pics/${id}a.JPG` } alt={ id } responsive />
                      </Col>
                      <Col xs={ 12 } sm={ 7 }>
                          <p><strong>location:</strong> <span className={`${ auction.location }`}>{ auction.location }</span></p>
                          {msrp ? <p><strong>msrp:</strong> { msrp }</p> : null}
                          <p><strong>description:</strong> { description }</p>
                          {msrp ? <p><strong>brand:</strong> { brand }</p> : null}
                          {msrp ? <p><strong>model:</strong> { model }</p> : null}
                          {msrp ? <p><strong>specs:</strong> { specs }</p> : null}
                          {description ? <p><strong>amazon:</strong> <a href={ `https://www.amazon.com/s?url=search-alias%3Daps&field-keywords=${description}` } target="_blank">amazon</a></p> : null}
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
            : null }
          </Col>
        )) : <Col xs={ 10 } xsOffset={1} sm={ 6 } xsOffset={3}><Alert>Sorry. No items found for '{ this.state.searchTerm }.'</Alert></Col> }
      </div>
    </div>);
  }
}

Movies.propTypes = {
  movies: React.PropTypes.array,
  searchQuery: React.PropTypes.object,
  locations: React.PropTypes.array,
  optionsChecked2: React.PropTypes.object,
};
//

export default Movies;
