import React from 'react';
import { Alert, Row, Checkbox, Col, Panel, FormControl, Image, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import TextTruncate from 'react-text-truncate';
var typingTimeout = null;

class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: null,
      locations: null,
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
    let checkedArray = this.props.locationsChecked.get();
    let selectedValue = e.target.value;
    if (e.target.checked) {
    	checkedArray.push(selectedValue);
      this.props.locationsChecked.set(checkedArray);
    } else {
    	let valueIndex = checkedArray.indexOf(selectedValue);
	    checkedArray.splice(valueIndex, 1);
      this.props.locationsChecked.set(checkedArray);
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

  togglePropsDynamic(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let o = this.props.filters.get();
    o[event.target.dataset.prop] = value;
    this.props.filters.set(o);
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
        <span>

          <span key="pics">
            <Checkbox name="pics" value="pics" id="pics" onChange={this.handleInputChangeDynamic.bind(this)}>
              <span className="pics label">Pictures Only</span>
            </Checkbox>
          </span>
          <span key="completed">
            <Checkbox name="completed" value="completed" id="completed" data-prop="completed" onChange={this.togglePropsDynamic.bind(this)}>
              <span className="completed label">Completed</span>
            </Checkbox>
          </span>
          <span key="new">
            <Checkbox name="new" value="new" id="new" data-prop="new" onChange={this.togglePropsDynamic.bind(this)}>
              <span className="new label">Appears New</span>
            </Checkbox>
          </span>
          <span key="openbox">
            <Checkbox name="openbox" value="openbox" id="openbox" data-prop="openbox" onChange={this.togglePropsDynamic.bind(this)}>
              <span className="openbox label">Open Box</span>
            </Checkbox>
          </span>

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
            placeholder="Search"
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
      <div className="Movies-list pinteresty">
        <br/>
        { movies.length > 0 ? movies.map(({ id, msrp, link, description, additionalInfo, brand, model, specs, auction, bidding }) => (
          <Col key={ id } xs={ 12 } md={ 6 } className="item">
            { this.state.pics ?
              <Panel className="img-only">
                <a href={ link } target="_blank">
                  <Image src={ `http://d2c3kiufvhjdfg.cloudfront.net/Pics/${id}a.JPG` } alt={ id } responsive />
                </a>
              </Panel>
            : null }
            { !this.state.pics ?
              <Panel header={`${description}`} className="normal">
                <Col>
                    <Image src={ `http://d2c3kiufvhjdfg.cloudfront.net/Pics/${id}a.JPG` } alt={ id } />
                    <p><strong>location:</strong> <span className={`${ auction.location }`}>{ auction.location }</span></p>
                    {msrp ? <p><strong>msrp:</strong> { msrp }</p> : null}
                    {description ? <p><strong>description:</strong> {
                      <TextTruncate
                          line={4}
                          truncateText="..."
                          text={description}
                      />
                    }</p> : null}
                    {brand ? <p><strong>brand:</strong> {
                      <TextTruncate
                          line={4}
                          truncateText="..."
                          text={brand}
                      />
                    }</p> : null}
                    {model ? <p><strong>model:</strong> {
                      <TextTruncate
                          line={4}
                          truncateText="..."
                          text={model}
                      />
                    }</p> : null}
                    {additionalInfo ? <p><strong>condition:</strong> {
                      <TextTruncate
                          line={4}
                          truncateText="..."
                          text={additionalInfo}
                      />
                    }</p> : null}
                    {bidding.bids ? <p><strong>bids:</strong> {
                      <span>{ bidding.bids }</span>
                    }</p> : null}
                    {bidding.amount ? <p><strong>current bid:</strong> {
                      <span>${ bidding.amount }</span>
                    }</p> : null}
                    {bidding.lastUpdated ? <p><strong>bids updated:</strong> {
                      <span><Moment fromNow>{ bidding.lastUpdated }</Moment></span>
                    }</p> : null}
                    {description ? <p><strong>compare:</strong> <a href={ `https://www.amazon.com/s?url=search-alias%3Daps&field-keywords=${description}` } target="_blank">amazon</a></p> : null}
                    <p><strong>ending:</strong>
                      &nbsp;<Moment fromNow>{ auction.end }</Moment>
                      <em>&nbsp;(<Moment format="M/DD h:mm a">{ auction.end }</Moment>)</em>
                    </p>
                    <br/>
                    <br/>
                    <p>
                      <a href={ link } target="_blank" className="pull-right btn btn-default">View</a>
                    </p>
                </Col>
              </Panel>
            : null }
          </Col>
        )) : <Col xs={ 10 } xsOffset={1} sm={ 6 } smOffset={3}><Alert>Sorry. No items found for '{ this.state.searchTerm }.'</Alert></Col> }
      </div>
    </div>);
  }
}

Movies.propTypes = {
  movies: React.PropTypes.array,
  searchQuery: React.PropTypes.object,
  filters: React.PropTypes.object,
  locationsChecked: React.PropTypes.object,
};
//

export default Movies;
