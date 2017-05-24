import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TopBar from './components/common/TopBar';
import SideBar from './components/common/SideBar';
import InnerContent from './components/common/Content';
import ProjectContainer from './components/ProjectContainer'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: null
    };
  }

  render() {
    return (
      <div>
        <TopBar />
        <SideBar />
        <ProjectContainer title= {"This wonderful title"}
        authors={"John Do"}
        status={"In progress"}
        date_created={"2017-01-16"}
        date_last_updated={"2017-03-27"}
        team= {"The best team ever"}
        tags={"tag1,tag2,tag3"}
        git_url={ "https://github.com/Drakulix/knex"}
        description={"Let's write an wonderful descriptiom. There was one time Derp, he wanted to eat a lot. He was hungry all the time, he ate all the time but he didn't get fat. Derpina, on the other hand, drank a lot but never got drunk."}
        future_work={"This is future work. I don't know what to write here, but it would be cool to see how Derp\'s and Derpina\'s kids would be like... can you imagine?"}
        related_projects={"If you want to see more related_projects, go check 9gag... I am pretty sure that you will find what you are looking for. Good luck!!!"}>

        </ProjectContainer>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('.content'));
