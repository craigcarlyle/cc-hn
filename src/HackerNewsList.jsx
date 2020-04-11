import React, { useEffect, useState } from "react";
import { HackerNewsListItem } from "./HackerNewsListItem";
import { debounce } from "./helpers";

const DEBOUNCE_TIME = 100;

function HackerNewsList(props) {
  const initialStories = props.storyIDs
    ? props.storyIDs.slice(0, 10)
    : JSON.parse(localStorage.getItem("currentStoryIDs"));

  const [storyIDs, setStoryIDs] = useState(initialStories);

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

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  });

  const setNext10Stories = () => {
    const lastStoryID = storyIDs.pop();
    const indexOfLastStoryID = props.storyIDs.indexOf(lastStoryID);
    const next10StoryIDs = props.storyIDs.slice(
      indexOfLastStoryID,
      indexOfLastStoryID + 11
    );

    const newStoryIDList = [...storyIDs, ...next10StoryIDs];
    setStoryIDs(newStoryIDList);
    localStorage.setItem("currentStoryIDs", JSON.stringify(newStoryIDList));
  };

  const renderEndOfList = () => {
    return (
      <div className="message">No more Hacker News stories available.</div>
    );
  };

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
