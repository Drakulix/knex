import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchJson } from '../common/Backend'

const FILTER_ATTRIBUTES = ['title', 'status', 'description', '_id'];

export default class BookmarksTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
      }],
    };
  }

  componentWillMount() {

  }

  transformObj(dataObject)  {
    var filteredDataObject = {};
    for(let attr of FILTER_ATTRIBUTES ) {
      if(attr == 'title') {
        filteredDataObject['name'] = dataObject[attr];
      } else {
        filteredDataObject[attr] = dataObject[attr];
      }
    }
    return filteredDataObject;
  }

  transformArray(dataArray) {
    var filteredDataArray = [];
    for(let dataObject of dataArray) {
      filteredDataArray.push(this.transformObj(dataObject));
    }
    return filteredDataArray;
  };

  componentDidMount() {
    var self = this;
    fetchJson('/api/projects').then(function(datas) {
      var filteredData = this.transformArray(datas);
      this.setState({
        data: filteredData
      });
    }.bind(this));
  }

  render() {

    const columns = [{
      Header: 'Project Name',
      id: 'name',
      accessor: d => d,
      filterMethod: (filter, row) => (row[filter.id].name.includes(filter.value)),
      Cell: props => <Link to={`projects/${props.value._id}`}>{props.value.name}</Link>
    }, {
      Header: 'Status',
      accessor: 'status',
      width: 100
    }, {
      Header: 'Description',
      accessor: 'description',
      pivot: true
    }]

    return (
      <div className="container">
        <div className="header">Your Bookmarks</div>
          <ReactTable
            getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: e => {
                console.log('it produced this event:', e)
                console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo)
                console.log('It was in this table instance:', instance)
                }
              }
            }}
            data={this.state.data}
            columns={columns}
            filterable={true}
            defaultPageSize={5}
          />
        <div className="footer" />
    </div>
    );
  }
}
