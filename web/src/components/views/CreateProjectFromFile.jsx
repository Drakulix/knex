import React from 'react'

import CreateProject from './CreateProject.jsx'

const JSON5 = require('json5')

export default class CreateProjectByURL extends React.Component {

      constructor(props) {
        super(props)
        var data = this.props.json;
        this.state = {
          status : "2",
          json : data
        }
      }

      componentWillMount(){
        if(this.props.match.path ==="/createFromFile/:data"){
          var data = JSON5.parse(decodeURIComponent(this.props.match.params.data));
          if(data!=null){
            var project = {
              title :"",
              description: "",
              date_creation: "2012-12-12",
              status : "",
              tags: [],
              url: []
            }
            if(data.title!=null){
              project["title"] = data.title
            }
            if(data.authors!=null){
              var projectAuthors = []
              for(var i = 0;i<data.authors.length;i++){
                  projectAuthors.push(data.authors[i].name + " ("+data.authors[i].email + ")")
              }
              this.setState({ authors : projectAuthors })
            }
            if(data.date_creation!=null){
              var projectDate = new Date(data.date_creation)
              this.setState({date : projectDate})
              project["date_creation"] = data.date_creation
            }
            if(data.description!=null){
              project["description"] = data.description
            }
            if(data.status!=null){
              switch(data.status.toLowerCase()){
                case "done" :         this.setState({ status : "0" })
                                      break
                case "in review" :    this.setState({ status : "1" })
                                      break
                case "in progress" :  this.setState({ status : "2" })
                                      break
                default:
                                      break
              }
              project["status"] = data.status;
            }
            if(data.tags!=null){
              project["tags"] = data.tags
            }
            if(data.url!=null){
              project["url"] = data.url
            }
            this.setState({ projectInf : project });
          }
        }
      }

      render() {
          return(
            <CreateProject
            authors={this.state.authors}
            projectInf={this.state.projectInf}
            status={this.state.status}
            date={this.state.date}
            fromURL={true}
            />
          )
      }
}
