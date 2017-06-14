import React, {Component} from 'react';

function PageItem({label, active}){
  return(
    <li className="page-item">
      <a className={active ? "page-link active" : "page-link"} href="#">{label}</a>
    </li>
  )
}


export default class Pagination extends Component {
  constructor(props) {
    super(props);
  };


  render() {
    const { currentPage } = this.props;

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
          <PageItem label={1} active={false}/>
          <PageItem label={2} active={true}/>
          <PageItem label={3} active={false}/>
          <li className="page-item">
            <a className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}
