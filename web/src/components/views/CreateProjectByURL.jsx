import React from 'react';

import CreateProject from './CreateProject.jsx';

const JSON5 = require('json5');

export default class CreateProjectByURL extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          done : false,
          status : "2",
        }
      }

      componentWillMount(){
        //Load form data from JSON file
        if(this.props.match.params.getURL !== undefined){
          var URL = encodeURI(decodeURIComponent(this.props.match.params.getURL));
          var request = new Request(URL,{
            method:'GET',
            mode: 'cors',
            header:{
            'Access-Control-Allow-Origin':'*'
            },
          });
          var that = this;
          fetch(request)
          .then(
            function(response){
              if(response.ok) {
                response.text().then(
                  function(text){
                    try {
                      var data = JSON5.parse(text);
                      if(data!=null){
                        var project = {
                          title :"",
                          description: "",
                          date_creation: "2012-12-12",
                          status : "",
                          tags: [],
                          url: []
                        };
                        if(data.title!=null){
                          project["title"] = data.title;
                        };
                        if(data.authors!=null){
                          var projectAuthors = [];
                          for(var i = 0;i<data.authors.length;i++){
                              projectAuthors.push(data.authors[i].name + " ("+data.authors[i].email + ")");
                          }
                          that.setState({ authors : projectAuthors });
                        };
                        if(data.date_creation!=null){
                          var projectDate = new Date(data.date_creation);
                          that.setState({date : projectDate});
                          project["date_creation"] = data.date_creation;
                        };
                        if(data.description!=null){
                          project["description"] = data.description;
                        };
                        if(data.status!=null){
                          switch(data.status.toLowerCase()){
                            case "done" :         that.setState({ status : "0" });
                                                  break;
                            case "in review" :    that.setState({ status : "1" });
                                                  break;
                            case "in progress" :  that.setState({ status : "2" });
                                                  break;
                            default:
                                                  break;
                          }
                          project["status"] = that.state.status;
                        };
                        if(data.tags!=null){
                          project["tags"] = data.tags;
                        };
                        if(data.url!=null){
                          project["url"] = data.url;
                        };
                        that.setState({ projectInf : project });
                        that.setState({done : true});
                      }
                    } catch (error) {
                      alert(error);
                    }
                  }
                );
              } else {
                alert("Connection Error.\n Unable to find anything at the given URL");
              }
            },
            function(exception){
              alert("Connection Error:\n"+exception);
            }
          );
        }
      }

      render() {
        if(this.state.done){
          return(
            <CreateProject
            authors={this.state.authors}
            projectInf={this.state.projectInf}
            status={this.state.status}
            fromURL={true}
            />
          );
        } else {
          return(<div/>)
        }
      }
}
