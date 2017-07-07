import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchJson } from '../common/Backend'

const FILTER_ATTRIBUTES = ['title', 'status', 'description', '_id'];

export default class UserProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
      }],
    };
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



  componentWillMount() {
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
      Cell: props => <Link to={`project/${props.value._id}`}>{props.value.name}</Link>
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
        <div className="header">Your own Projects</div>
          <ReactTable
            data={this.state.data}
            columns={columns}
            filterable={true}
            defaultPageSize={10}
          />
        <div className="footer" />
    </div>
    );
  }
}
