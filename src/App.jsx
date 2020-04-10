import React from "react";
import { HackerNewsList } from "./HackerNewsList";
import { useAjax } from "./CustomHooks";

import "./App.css";

const NEWEST_500_ENDPOINT =
  "https://hacker-news.firebaseio.com/v0/newstories.json";

function App() {
  const [storyIDs, loading, error] = useAjax(
    NEWEST_500_ENDPOINT,
    null,
    "allStoryIDs"
  );

  const renderLoader = () => {
    return (
      <div className="main-loader" data-testid="main-loader">
        Fetching stories...
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="main-error" data-testid="main-error">
        Error fetching stories.
      </div>
    );
  };

  return (
    <div className="App">
      {loading ? renderLoader() : null}
      {error ? renderError() : null}
      {!loading && !error ? <HackerNewsList storyIDs={storyIDs} /> : null}
    </div>
  );
}

export default App;
