import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchJson } from './Backend'
import Filters from './Filters';


export default class BookmarksTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
      }],
      filters : {},
      filteredTable : [{}]
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentWillMount() {

  }





  transformObj(dataObject)  {
    var filteredDataObject = {};
    for(let attr of this.props.columns ) {
      if(attr == 'title') {
        filteredDataObject['name'] = dataObject[attr];
      } else {
        filteredDataObject[attr] = dataObject[attr];
      }
    }
    filteredDataObject["_id"] = dataObject["_id"];

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
    fetchJson(this.props.fetchURL).then(function(datas) {
      var filteredData = this.transformArray(datas);
      this.setState({
        data: filteredData
      });
    }.bind(this));

    this.setState({
filteredTable : JSON.parse(JSON.stringify(this.state.data))

    });
  }






  handleFilterChange(key, value){
    var state = this.state["filters"];
    if(value == ""){
      delete state[key];
    }
    else        {state[key] = value;}
    this.setState({"filters" : state});
  }



  render() {
    const columns = [];
    if(this.props.columns.indexOf("title") !== -1){
      columns.push(
        {
          Header: 'Project Name',
          id: 'name',
          accessor: d => d,
          filterMethod: (filter, row) => (row[filter.id].name.includes(filter.value)),
          Cell: props => <Link to={`project/${props.value._id}`}><a className="table-link-text">{props.value.name}</a></Link>,
        }
      );
    }

    if(this.props.columns.indexOf("status") !== -1){
      columns.push(

          {
            Header: 'Status',
            accessor: 'status',
            width: 100,
            Cell: row => (
              <span>
                <span style={{
                    color: row.value === 'PENDING' ? '#ff2e00'
                    : row.value === 'IN_PROGRESS' ? '#ffbf00'
                    : row.value === 'DONE' ? '#57d500'
                    : '#57d500',
                    transition: 'all .3s ease',
                    textAlign: 'center'
                  }}>
                  &#x25cf;
                </span> {
                  row.value === 'IN_PROGRESS' ? 'In Progress'
                  : row.value === 'PENDING' ? `Pending`
                  : row.value === 'DONE' ? `Done`
                  : 'No Status'
                }
              </span>
            )
          }

      );
    }

    if(this.props.columns.indexOf("tags") !== -1){
        columns.push({
        Header: 'Tags',
        accessor: 'tags',
        pivot: true,
          width: 200,
      });
    }

        if(this.props.columns.indexOf("description") !== -1){  columns.push({
          Header: 'Description',
          accessor: 'description',
          pivot: true
        });
        }

            if(this.props.columns.indexOf("bookmarked") !== -1){
  columns.push(
              {
                Header: 'Bookmarked',
                accessor: 'bookmarked',
                pivot: true,
                width: 100
              });
            }

            if(this.props.columns.indexOf("delete") !== -1){
            columns.push(
              {
                Header: 'Delete',
                accessor: d => d,
                id: 'delete',
                pivot: true,
                sortable:false,
                width: 50,
                Cell: props => <Link to={`project/${props.value._id}`}>Delete</Link>,
              }
              );
}







  return (
    <div>
      <Filters value={this.state.filters} onChange={this.handleFilterChange}></Filters>
      <ReactTable
        data={this.state.data}
        columns={columns}
        defaultExpanded={{1: true}}
        filterable={false}
        showPageSizeOptions={false}
        defaultPageSize={10}
        />

    </div>
  );
}
}
