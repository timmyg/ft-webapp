import React from 'react';
import { Alert, Row, Col, Panel, FormControl, Image, Button } from 'react-bootstrap';
import Moment  from 'react-moment';

class Movies extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = { searchTerm: null };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(event) {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    this.props.searchQuery.set(searchTerm);
  }

  render() {
    const { movies } = this.props;
    console.log(movies);
    console.log(this.props.movies.children);
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
      <div className="Movies-list">
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
};

export default Movies;
