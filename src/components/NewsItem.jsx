import React, { Component } from "react";

export default class NewsItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl, author, date } = this.props;

    return (
      <div className="container my-3">
        <div className="card my-3" style={{ width: "25rem", height: "28rem" }}>
          <img src={imageUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text description">{description}</p>
            <p className="card-text"><small className="text-muted">By {author} on {date}</small></p>
            <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-sm btn-dark d-flex justify-content-center">Read More</a>
          </div>
        </div>
      </div>
    );
  }
}
