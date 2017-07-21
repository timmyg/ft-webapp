import React from 'react';
import { Alert, Row, Col, Panel, FormControl, Image } from 'react-bootstrap';

class Movies extends React.Component {
  constructor(props) {
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
        { movies.length > 0 ? movies.map(({ id, msrp, link, auctionUrl, description, endDate }) => (
          <Col key={ id } xs={ 12 } sm={ 6 }>
            <Panel header={`${description}`}>
                <Row>
                  <Col xs={ 12 } sm={ 3 }>
                    <Image src={ `http://d2c3kiufvhjdfg.cloudfront.net/Pics/${id}a.JPG` } alt={ id } responsive />
                  </Col>
                  <Col xs={ 12 } sm={ 9 }>
                    <p><strong>id:</strong> { id }</p>
                    <p><strong>msrp:</strong> { msrp }</p>
                    <p><strong>description:</strong> { description }</p>
                    <p><a href={ link } target="_blank">view</a></p>
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
