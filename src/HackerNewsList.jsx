import React, { useEffect, useState } from "react";
import { HackerNewsListItem } from "./HackerNewsListItem";
import { debounce } from "./helpers";

import "./HackerNewsList.css";

const DEBOUNCE_TIME = 100;

function HackerNewsList(props) {
  const initialStories = props.storyIDs
    ? props.storyIDs.slice(0, 10)
    : JSON.parse(localStorage.getItem("currentStoryIDs"));

  const [storyIDs, setStoryIDs] = useState(initialStories);

  const saveStoriesToLoadStorage = (storyIDs) => {
    localStorage.setItem("currentStoryIDs", JSON.stringify(storyIDs));
  };

  const scrollListener = () => {
    const debouncedPositionCheck = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setNext10Stories();
      }
    }, DEBOUNCE_TIME);

    debouncedPositionCheck();
  };

  const setNext10Stories = () => {
    const lastStoryID = storyIDs.pop();
    const indexOfLastStoryID = props.storyIDs.indexOf(lastStoryID);
    const next10StoryIDs = props.storyIDs.slice(
      indexOfLastStoryID,
      indexOfLastStoryID + 11
    );

    const newStoryIDList = [...storyIDs, ...next10StoryIDs];
    setStoryIDs(newStoryIDList);
    saveStoriesToLoadStorage(newStoryIDList);
  };

  const renderEndOfList = () => {
    return (
      <div className="end-of-list-message">
        No more Hacker News stories available.
      </div>
    );
  };

  useEffect(() => {
    // Save the story IDs to local storage for offline use.
    saveStoriesToLoadStorage(initialStories);

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  });

  return (
    <>
      <ol>
        {storyIDs.map((storyID, index) => (
          <HackerNewsListItem key={index} storyID={storyID} />
        ))}
      </ol>

      {storyIDs.length === 500 ? renderEndOfList() : null}
    </>
  );
}

export { HackerNewsList };
