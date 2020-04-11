import React from "react";
import { render, cleanup } from "@testing-library/react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App from "./App";
import { HackerNewsList } from "./HackerNewsList";
import { useAjax } from "./customHooks";

jest.mock("./customHooks");

configure({ adapter: new Adapter() });

describe("while loading", () => {
  it("renders the loader element", () => {
    useAjax.mockReturnValue([null, true, null]);

    const { getByTestId } = render(<App />);
    const loaderElement = getByTestId("main-loader");

    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveTextContent("Fetching stories...");
  });
});

describe("when an error is returned", () => {
  it("renders the error element", () => {
    useAjax.mockReturnValue([null, null, true]);

    const { getByTestId } = render(<App />);
    const errorElement = getByTestId("main-error");

    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("Error fetching stories.");
  });
});

describe("when the fetch is successful", () => {
  it("passes the array of IDs to the HackerNewsList component", () => {
    const storyIDs = [1, 2, 3];
    const hackerNewsListComponent = mount(
      <HackerNewsList storyIDs={storyIDs} />
    );

    useAjax.mockReturnValue([storyIDs, false, false]);
    expect(hackerNewsListComponent.props().storyIDs).toBe(storyIDs);
  });
});

afterEach(cleanup);
