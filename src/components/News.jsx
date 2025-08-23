import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
    // Function to capitalize the first letter of a string
    capitalizeFirst = (str) => {
        if (!str) return str; // Return empty string if input is empty
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    constructor(props) {
        super(props);
        console.log("Hello, I am a constructor from the news component");

        // Initializing the component state
        this.state = {
            articles: [], // Stores fetched articles
            loading: false, // Loading state for API calls
            page: 1, // Current page number for pagination
            totalResults: 0, // Total number of articles available
        };

        // Setting document title dynamically based on category
        document.title = `NewsMonkey - ${this.capitalizeFirst(this.props.category)}`;
    }

    // API key for fetching news (Replace with your own if needed)
    apiKey = "47da09cba65c4f8ca1bc0176e6a3a56a";

    // Function to fetch news articles from the API
    async fetchNews(page = this.state.page) {
        this.setState({ loading: true }); // Set loading state to true before fetching data

        // Construct the API URL
        let url = `https://newsapi.org/v2/top-headlines?country=us&category=${this.props.category}&apiKey=${this.apiKey}&page=${page}&pageSize=6`;

        // Fetching data from the API
        let data = await fetch(url);
        let parsedData = await data.json();

        // Updating the state with the fetched articles
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false // Turn off loading after data is fetched
        });
    }

    // Fetch news when the component mounts
    async componentDidMount() {
        this.fetchNews();
    }

    // Function to load more articles for infinite scrolling
    fetchMore = async () => {
        if (this.state.articles.length >= this.state.totalResults) return; // Stop fetching if all articles are loaded
    
        let nextPage = this.state.page + 1;
        this.setState({ page: nextPage });
    
        let url = `https://newsapi.org/v2/top-headlines?country=us&category=${this.props.category}&apiKey=${this.apiKey}&page=${nextPage}&pageSize=6`;
        let data = await fetch(url);
        let parsedData = await data.json();
    
        // If no new articles are returned, prevent updating state
        if (!parsedData.articles || parsedData.articles.length === 0) {
            this.setState({ hasMore: false });
            return;
        }
    
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults
        });
    };
    

    render() {
        return (
            <div className="container">
                {/* Heading for the news category */}
                <h2 className="text-center my-3">
                    NewsMonkey - Top {this.capitalizeFirst(this.props.category)} Headlines
                </h2>

                {/* Infinite Scroll Component for lazy loading */}
                <InfiniteScroll
                    dataLength={this.state.articles.length} // Current number of articles loaded
                    next={this.fetchMore} // Function to load more data
                    hasMore={this.state.articles.length < this.state.totalResults} // Condition to check if more data is available
                    loader={<Spinner />} // Show spinner while loading more data
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {/* Rendering news items */}
                    <div className="row">
                        {this.state.articles.map((element) => (
                            // React expects key to be on the top-level element inside a list.
                            <div className="col-md-4" key={element.url}>  
                                <NewsItem
                                    title={element.title || "No Title"}
                                    description={element.description || "No description"}
                                    imageUrl={element.urlToImage || ""}
                                    newsUrl={element.url}
                                    author={element.author || "Unknown"}
                                    date={element.publishedAt}
                                />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }
}
