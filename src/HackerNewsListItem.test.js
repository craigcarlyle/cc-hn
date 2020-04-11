import React from "react";
import { render, cleanup } from "@testing-library/react";

import { HackerNewsListItem } from "./HackerNewsListItem";
import { useAjax } from "./customHooks";
import { convertUnixTimeToString } from "./helpers";

jest.mock("./customHooks");
jest.mock("./helpers");

describe("while loading", () => {
  it("renders the loader element", () => {
    useAjax.mockReturnValue([null, null, true]);

    const { getByTestId } = render(<HackerNewsListItem />);
    const loaderElement = getByTestId("list-item-loader");

    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveTextContent("Loading story...");
    expect(loaderElement).toHaveClass("unresolved");
  });
});

describe("when an error is returned", () => {
  it("renders the error element", () => {
    useAjax.mockReturnValue([null, true, null]);

    const { getByTestId } = render(<HackerNewsListItem />);
    const errorElement = getByTestId("list-item-error");

    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("Error loading story.");
    expect(errorElement).toHaveClass("error");
  });
});

describe("when the fetch is successful", () => {
  it("renders the list item element", () => {
    const postData = {
      id: 1,
      title: "Fake title",
      by: "Fake author",
      time: 1586316694,
    };

    useAjax.mockReturnValue([postData, false, false]);
    convertUnixTimeToString.mockReturnValue("Fake time");

    const { getByTestId } = render(<HackerNewsListItem />);
    const anchorElement = getByTestId("list-item-anchor");
    const connectorElement = getByTestId("list-item-connector");
    const timeElement = getByTestId("list-item-time");

    expect(anchorElement.getAttribute("href")).toBe(
      "https://news.ycombinator.com/item?id=1"
    );
    expect(anchorElement.textContent).toBe("Fake title");
    expect(connectorElement.textContent).toBe("by Fake author on");
    expect(timeElement.textContent).toBe("Fake time");
  });
});

afterEach(cleanup);
