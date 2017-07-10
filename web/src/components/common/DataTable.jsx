import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { fetchJson } from './Backend'
import Filters from './Filters';
import IconButton from 'material-ui/IconButton'


import Chip from 'material-ui/Chip'
import styles from '../common/Styles.jsx';



export default class BookmarksTable extends React.Component {
  constructor(props) {
    super(props);

    var filters = {};
    if(props.predefinedFilter !== undefined){
      filters = props.predefinedFilter;





    }



    this.state = {
      data: [{
      }],
      filters : filters,
      filteredTable : [{}],
      isProfile : "false",
      url : "/ap/projects",
      bookmarksSite : "false"
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddBookmark = this.handleAddBookmark.bind(this);
    this.handleRemoveBookmark = this.handleRemoveBookmark.bind(this);

  }



  handleDelete(projectID){
    //event.preventDefault();
    var url = "/api/projects/"
    var status = fetch(url+projectID, {
      credentials: 'include',
      method: "DELETE",
      body: "",
      headers: {

      }
    }).then(response => response.status)
    // .then(json => console.dir(json))
      .catch(ex => {
      console.error('parsing failed', ex)
    });

  }

  handleAddBookmark(projectID){
    var url = "/api/users/bookmarks/"
    var status = fetch(url+projectID, {
      credentials: 'include',
      method: "POST",
      body: "",
      headers: {

      }
    }).then(response => response.status)
      .catch(ex => {
      console.error('parsing failed', ex)
    }

  );


  }

  handleRemoveBookmark(projectID){
    var url = "/api/users/bookmarks/"
    var status = fetch(url+projectID, {
      credentials: 'include',
      method: "DELETE",
      body: "",
      headers: {

      }
    }).then(response => response.status)
      .catch(ex => {
      console.error('parsing failed', ex)
    }
    );
    this.setState({ url : "/api/projects" });
  }



  componentWillMount() {

    if(this.props.isProfile !== undefined){
      this.state.isProfile = true;
    }
    else if(this.props.bookmarksSite !== undefined){
      this.state.bookmarksSite = true;
    }
    this.fetchData(this.props.fetchURL);
    this.state.url = this.props.fetchURL;
  }

  fetchData(url){

    fetchJson(url).then(function(data) {

      var datas =[]

      datas = data

      
       var tmp = []
       if(this.state.isProfile === true){
         for (let projects of   datas){
           var project = projects

         if(project["is_bookmark"] === "true" || project["is_owner"] === "true"){
           tmp.push(project)

         }

      }
      datas = tmp
       }
       else if(this.state.bookmarksSite === true){
         for (let projects of   datas){
           var project = projects

         if(project["is_bookmark"] === "true"){
           tmp.push(project)

         }

       }
       datas = tmp
       }

        var filteredDataArray = [];
        var dataArray = [];
        for(let dataObject of datas) {
          var transformedObject = dataObject;
          var t = new String(dataObject.tags);
          t = t.substring(0,t.length);
          var array = t.split(",");
          array.sort();
          transformedObject["tagString"] =array.join();
          var temp = [];
          for (var i in  dataObject.authors) {
            temp = temp.concat([dataObject.authors[i].name + " ##"+dataObject.authors[i].email] );
          }
          temp.sort();
          transformedObject["authorString"] = temp.join();
          filteredDataArray.push(transformedObject);
          dataArray.push(transformedObject);

        }

        this.setState({
          data: dataArray,
          filteredTable : filteredDataArray
        });

        //this.filter(this.state.filters)
      }.bind(this));
    }

    handleFilterChange(key, value){
      var state = this.state.filters;
      if(value === ""){
        delete state[key];
      }
      else  {
        state[key] = value;
      }
      this.setState({filters : state});
      this.filter(state);
      if(this.props.handleFilter !== undefined)
        this.props.handleFilter(key,value);
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
            case "tags":
              var temp = dataObject.tags.join().toLowerCase();
              for(let i in value){
                var tag = value[i];
                discard = temp.indexOf(tag.toLowerCase()) === -1;
                if(discard)
                break;
              }
              break;
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
              break;
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
        columns.push({
          Header: 'Project title',
          id: 'title',
          width: 230,
          accessor: d => d,
          Cell: props =>{
            var text = new String(props.value.title).split(" ");
            var line = "";
            var result = [];
            var linebreak  = 32;
            for(let word in text ){
              if (line.length + text[word].length < linebreak){
                line += text[word]+ " ";
              }else{
                result.push(line);
                line =text[word] + " ";
              }
            }
            result.push(line.trim());
            return(
              <div style={{width : 50}}>
                <Link to={`project/${props.value._id}`}
                  className="table-link-text">
                  {result.map(item =><span>{item}<br></br></span>) }
                </Link>
              </div>
            )}
          }
        );
      }
      if(this.props.columns.indexOf("status") !== -1){
        columns.push({
          Header: 'Status',
          accessor: 'status',
          style: {textAlign:"center"},

          width: 80,
          Cell: props =>
          {
            var status_badge = props.value;
            switch(props.value){
              case "DONE":  status_badge = <span className="badge badge-success">DONE</span>
              break;
              case 'IN_PROGRESS':
              status_badge = <span className="badge badge-success">DONE</span>
              break;
              case 'IN_REVIEW':
              status_badge = <span className="badge badge-info">IN_REVIEW</span>
              break;
              default:
            }
            return(
              <div>{status_badge}</div>
            );
          }
        })}
      if(this.props.columns.indexOf("date_creation") !== -1){
        columns.push({
          Header: 'Date',
          accessor: 'date_creation',
          pivot: true,
          width:95,
          style: {textAlign:"center"},

        });
      }
      if(this.props.columns.indexOf("tags") !== -1){
        columns.push({
          Header: 'Tags',
          accessor: "tagString",
          width: 220,
          style: {textAlign:"center"},
          Cell: props =>{
            var t = new String(props.value);
            var array = t.split(",");
            return(

                array.map(item =>
                  <Chip style= {styles["chip"]}>
                    <Link to={item} style= {styles["chipText"]} >{item}</Link></Chip>)

            );},
        });
      }
      if(this.props.columns.indexOf("authors") !== -1){
        columns.push({
          Header: 'Authors',
          accessor: "authorString",
          width: 150,
          Cell: props =>{
            var t = new String(props.value);
            var array = t.split(",");
            return(<div>
              {array.map(item =>
                <Chip style= {styles["chip"]}>
                  <Link to={"/profile/"+item.substring(
                      item.indexOf(" ##")+3
                    )} style= {styles["chipText"]} >{item.substring(0,item.indexOf(" ##"))}</Link><br></br></Chip>) }
                  </div>
                );},
              });
            }
            if(this.props.columns.indexOf("description") !== -1){  columns.push({
              Header: 'Description',
              id: 'description',
              style: {width: "100%"},
              accessor: d => d,
              Cell: props =>{
                var text = new String(props.value.description).split(" ");
                var line = "";
                var result = [];
                var linebreak  =36;
                for(let word in text ){
                  if(result.length > 5){
                    line = "";
                    result.push("...");
                    break;
                  }
                  if (line.length + text[word].length < linebreak){
                    line += text[word]+ " ";
                  }else{
                    result.push(line);
                    line =text[word] + " ";
                  }
                }
                result.push(line.trim());
                return(
                  <div>
                    {result.map(item =><span>{item}<br></br></span>) }

                  </div>
                )}
              });
            }
            if(this.props.columns.indexOf("bookmarked") !== -1){
              columns.push({
                Header: 'Bookmark',
                id: 'is_bookmark',
                accessor: d=>d,
                pivot: true,
                width: 85,
                style: {textAlign:"center"},
                Cell: props =>{
                  return(
                    (new String(props.value.is_bookmark) == "true") ?
                      <IconButton onClick={()=>this.handleRemoveBookmark(props.value._id)}
                                  touch={true}
                                  style = {styles.largeIcon}
                                  iconStyle={{fontSize: '24px'}}>
                        <i className="material-icons">star_rate</i>
                      </IconButton>
                        :
                      <IconButton onClick={()=>this.handleAddBookmark(props.value._id)}


                                  touch={true}
                                  style = {styles.largeIcon}
                                  iconStyle={{fontSize: '24px'}}
                            >
                            <i className="material-icons">star_border</i>
                          </IconButton>
                        )}
                      });
                    }
                    if(this.props.columns.indexOf("delete") !== -1){
                      columns.push(
                        {
                          Header: 'Delete',
                          accessor: d => d,
                          id: 'delete',
                          sortable:false,
                          width: 60,
                          style: {textAlign:"center"},
                          Cell: props => <IconButton
                          onClick={()=>this.handleDelete(props.value._id)}
                          touch={true}
                          style = {styles.largeIcon}
                          iconStyle={{fontSize: '24px'}}
                          value={props.value._id}
                          >
                          <i className="material-icons">delete</i>
                        </IconButton>
                      }
                    );
                  }
                  return (
                    <div>
                      <Filters value={this.state.filters}
                        onChange={this.handleFilterChange}></Filters>
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
