import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { fetchJson } from './Backend'
import Filters from './Filters';


import Chip from 'material-ui/Chip'
import styles from '../common/Styles.jsx';



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





  transformObj(dataObject)  {
    var filteredDataObject = {};
    for(let attr of this.props.columns ) {

        filteredDataObject[attr] = dataObject[attr];

    }
    filteredDataObject["_id"] = dataObject["_id"];

    return filteredDataObject;
  }



  componentWillMount() {
    var self = this;
    fetchJson(this.props.fetchURL).then(function(datas) {

var datas = [
      {
        "_id" : "abcd",
        "title": "Contextual music information retrieval and recommendation: State of the art and challenges",
        "url": ["http://example.org"],
        "authors":[
          {"name": "Marius Kaminskas",
           "email": "mkaminskas@unibz.it"
          },
          {"name": "Francesco Ricci",
           "email": "fricci@unibz.it"
          }
        ],
        "status": "IN_REVIEW",
        "description": "Increasing amount of online music content has opened new opportunities for implementing new effective information access services – commonly known as music recommender systems – that support music navigation, discovery, sharing, and formation of user communities. In the recent years a new research area of contextual (or situational) music recommendation and retrieval has emerged. The basic idea is to retrieve and suggest music depending on the user’s actual situation, for instance emotional state, or any other contextual conditions that might influence the user’s perception of music. Despite the high potential of such idea, the development of real-world applications that retrieve or recommend music depending on the user’s context is still in its early stages. This survey illustrates various tools and techniques that can be used for addressing the research challenges posed by context-aware music retrieval and recommendation. This survey covers a broad range of topics, starting from classical music information retrieval (MIR)and recommender system (RS) techniques, and then focusing on context-aware music applications as well as the newer trends of affective and social computing applied to the music domain.",
        "date_creation": "2017-07-09",
        "tags": [
          "Music information retrieval",
          "Music recommender systems",
          "Context-aware services",
          "Affective computing",
          "Social computing"
        ]
      },
      {"_id" : "999",
        "title": "Semantic Analysis of Song Lyrics",
        "authors": [
          {"name": "Beth Logan",
           "email": "Beth.Logan@hp.com"
          },
          {"name": "Pedro Moreno",
           "email": "Pedro.Moreno@hp.com"
          }
        ],
        "url": ["http://example1.org"],
        "status": "IN_PROGRESS",
        "description": "We explore the use of song lyrics for automatic indexing of music. Using lyrics mined from the Web we apply a standard text processing technique to characterize their semantic content. We then determine artist similarity in this space. We found lyrics can be used to discover natural genre clusters. Experiments on a publicly available set of 399 artists showed that determining artist similarity using lyrics is better than random but inferior to a state-of-the-art acoustic similarity technique. However, the approaches made different errors, suggesting they could be profitably combined.",
        "date_creation": "2014-04-14",
        "tags": [
          "multimedia indexing",
          "rich media",
          "music information retrieval"
        ]
      }];



      var filteredDataArray = [];
      var dataArray = [];

      for(let dataObject of datas) {
        var transformedObject= dataObject;//this.transformObj(dataObject);

        transformedObject["tagString"] = transformedObject.tags.join();

        var temp = [];
        for (var i in  dataObject.authors) {
          temp = temp.concat([dataObject.authors[i].name]);
        }
        transformedObject["authorString"] = temp.join();



        filteredDataArray.push(transformedObject);
        dataArray.push(transformedObject);

      }

      this.setState({
        data: dataArray,
        filteredTable : filteredDataArray
      });
    }.bind(this));

  }






  handleFilterChange(key, value){
    var state = this.state.filters;
    if(value == ""){
      delete state[key];
    }
    else  {
      state[key] = value;
    }
    this.setState({filters : state});
    this.filter(state);
  }


  filter(filters){
    var array = [];

    for(let dataObject of this.state.data) {
    var discard = false;


      for(let key of Object.keys(filters)){
        var value = filters[key];
        switch (key){
          case "title":
                        discard = dataObject.title.toLowerCase().indexOf(value.toLowerCase()) === -1;
                        break;
          case "description":
                        discard = dataObject.description.toLowerCase().indexOf(value.toLowerCase()) === -1;
                        break;
          case "status":
                        discard = dataObject.status.toLowerCase().indexOf(value.toLowerCase()) === -1;
                        break;
          case "filter_date_to":
                        discard = dataObject.date_creation  > value;
                        break;
          case "filter_date_from":
                        discard = dataObject.date_creation  < value;
                        break;
          case "tags":  var temp = dataObject.tags.join().toLowerCase();
                        for(let i in value){
                          var tag = value[i];
                          discard = temp.indexOf(tag.toLowerCase()) === -1;
                          if(discard)
                            break;
                        }
          case "authors":
                        var temp = [];
                        for (var i in  dataObject.authors) {
                          temp = temp.concat([dataObject.authors[i].name + " ("+dataObject.authors[i].email+ ")"]);
                        }
                        temp = temp.join().toLowerCase();
                        for(let i in value){
                          var author = value[i];
                          discard = temp.indexOf(author.toLowerCase()) === -1;
                          if(discard)
                            break;
                        }
          default:
        }
        if(discard){
          break;
        }
    }
    if(!discard){
      array.push(dataObject);
    }
    this.setState({filteredTable : array});
  }
}


  render() {
    const columns = [];
    if(this.props.columns.indexOf("title") !== -1){
      columns.push(
        {
          Header: 'Project Name',
          id: 'title',
          accessor: d => d,
          Cell: props => <Link to={`project/${props.value._id}`}><a className="table-link-text">{props.value.title}</a></Link>,
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
                    color: row.value === 'IN_REVIEW' ? '#ff2e00'
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
        accessor: "tagString",
        Cell: props =>{
          return(<div style = {{heigth : 100, wordWrap: "break-word"}}>
            {props.value}<br></br>
            {props.value
            }<br></br>

          <Chip style= {styles["chip"]}>   {props.value
            }</Chip>
          </div>
            /*{ props.value.tags.map(item =>
              <Chip style= {styles["chip"]}>
                <Link to={item} style= {styles["chipText"]} >{item}</Link></Chip>) }
                </div>*/
);},


          width: 200,
      });
    }



    if(this.props.columns.indexOf("authors") !== -1){
        columns.push({
        Header: 'Authors',
        accessor: "authorString",
        Cell: props =>{
          return(<div style = {{heigth : 100, wordWrap: "break-word"}}>
            {props.value}<br></br>
            {props.value
            }<br></br>

          <Chip style= {styles["chip"]}>   {props.value
            }</Chip>
          </div>
            /*{ props.value.tags.map(item =>
              <Chip style= {styles["chip"]}>
                <Link to={item} style= {styles["chipText"]} >{item}</Link></Chip>) }
                </div>*/
);},


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
                id: ':id',
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
        data={this.state.filteredTable}
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
