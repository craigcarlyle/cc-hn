import React from "react";
import { render, cleanup, act } from "@testing-library/react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { HackerNewsList } from "./HackerNewsList";
import { range } from "./helpers";

configure({ adapter: new Adapter() });

describe("when the storyIDs are passed to the component", () => {
  let initialIDs;

  beforeAll(() => {
    initialIDs = range(0, 499);
  });

  it("populates the list with the first 10 IDs", () => {
    const { getAllByTestId } = render(<HackerNewsList storyIDs={initialIDs} />);
    const storyListItemElements = getAllByTestId("list-item-loader");

    expect(storyListItemElements.length).toBe(10);
  });

  it("saves the initial storyIDs to localStorage", () => {
    let localStorageSpy = jest.spyOn(Storage.prototype, "setItem");

    mount(<HackerNewsList storyIDs={initialIDs} />);

    expect(localStorageSpy).toHaveBeenCalledWith(
      "currentStoryIDs",
      JSON.stringify(range(0, 9))
    );
  });
});

describe("when the storyIDs are NOT passed to the component", () => {
  it("fetches the entire list from local storage", () => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(range(0, 499)));

    const { getAllByTestId } = render(<HackerNewsList />);
    const storyListItemElements = getAllByTestId("list-item-loader");

    expect(storyListItemElements.length).toBe(500);
  });
});

describe("when a scroll event is triggered", () => {
  describe("at the end of the content", () => {
    let hackerNewsListComponent;
    let localStorageSpy;

    beforeAll(() => {
      // Use fake timers for debounced function
      jest.useFakeTimers();

      const initialIDs = range(0, 499);

      global.innerHeight = 1000;
      jest.spyOn(global.document, "documentElement", "get").mockReturnValue({
        scrollTop: 1000,
        offsetHeight: 2000,
      });

      hackerNewsListComponent = mount(<HackerNewsList storyIDs={initialIDs} />);
      localStorageSpy = jest.spyOn(Storage.prototype, "setItem");

      act(() => {
        global.dispatchEvent(new Event("scroll"));
        // Run timers to account for debounced function
        jest.runAllTimers();
      });
    });

    it("should load 10 more stories", () => {
      expect(hackerNewsListComponent.getDOMNode().childElementCount).toBe(20);
    });

    it("should update localStorage with the newly added IDs", () => {
      expect(localStorageSpy).toHaveBeenCalledWith(
        "currentStoryIDs",
        JSON.stringify(range(0, 19))
      );
    });
  });

  describe("NOT at the end of the content", () => {
    it("should NOT load more stories", () => {
      global.innerHeight = 1000;
      jest.spyOn(global.document, "documentElement", "get").mockReturnValue({
        scrollTop: 0,
        offsetHeight: 2000,
      });

      const initialIDs = range(0, 499);
      const hackerNewsListComponent = mount(
        <HackerNewsList storyIDs={initialIDs} />
      );

      act(() => {
        global.dispatchEvent(new Event("scroll"));
      });

      expect(hackerNewsListComponent.getDOMNode().childElementCount).toBe(10);
    });
  });
});

afterEach(cleanup);
