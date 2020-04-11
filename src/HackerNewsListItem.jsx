import React from "react";
import { useAjax } from "./customHooks";
import { convertUnixTimeToString } from "./Helpers";

const BASE_URL = "https://news.ycombinator.com/item?id=";

function HackerNewsListItem(props) {
  const [postData, loading, error] = useAjax(
    `https://hacker-news.firebaseio.com/v0/item/${props.storyID}.json`,
    null,
    `${props.storyID}`
  );

  const renderLoader = () => {
    return (
      <li className="unresolved" data-testid="list-item-loader">
        Loading story...
      </li>
    );
  };

  const renderError = () => {
    return (
      <li className="error" data-testid="list-item-error">
        Error loading story.
      </li>
    );
  };

  const renderListItemElement = (postData) => {
    return (
      <li>
        <div className="list-item-container">
          <a
            data-testid="list-item-anchor"
            href={`${BASE_URL}` + postData.id}
            target="blank"
          >
            {postData.title}
          </a>
          <span data-testid="list-item-connector">by {postData.by} on</span>
          <span data-testid="list-item-time">
            {convertUnixTimeToString(postData.time)}
          </span>
        </div>
      </li>
    );
  };

  return (
    <>
      {loading ? renderLoader() : null}
      {error ? renderError() : null}
      {!loading && !error && postData ? renderListItemElement(postData) : null}
    </>
  );
}

export { HackerNewsListItem };
