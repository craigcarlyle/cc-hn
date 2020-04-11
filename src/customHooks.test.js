import React from "react";
import { render, waitForElement, cleanup } from "@testing-library/react";
import { useAjax } from "./customHooks";

describe("customHooks", () => {
  describe("useAjax", () => {
    let localDataName = "testName";

    function TestComponent() {
      const [response, error] = useAjax("url", localDataName);

      if (error) {
        return <p data-testid="error">{error.message}</p>;
      }

      if (response) {
        return <p data-testid="result">{response.text}</p>;
      }

      return <></>;
    }

    afterEach(cleanup);

    describe("when a fetch call is successful", () => {
      let resultString = "success";
      let fetchResult = { text: resultString };
      let localStorageSpy;

      beforeAll(() => {
        global.fetch = jest.fn();
        fetch.mockResolvedValue({
          ok: true,
          json: () => {
            return Promise.resolve(fetchResult);
          },
        });
      });

      it("returns the fetched data to the test component", async () => {
        const { getByTestId } = render(<TestComponent />);

        await waitForElement(() => getByTestId("result"));
        expect(getByTestId("result")).toBeTruthy();
        expect(getByTestId("result").textContent).toBe(resultString);
      });

      it("saves the fetched data to localStorage", async () => {
        localStorageSpy = jest.spyOn(Storage.prototype, "setItem");
        const { getByTestId } = render(<TestComponent />);

        await waitForElement(() => getByTestId("result"));
        expect(localStorageSpy).toHaveBeenCalledWith(
          localDataName,
          JSON.stringify(fetchResult)
        );
      });
    });

    describe("when a fetch call is NOT successful", () => {
      describe("and cached data is in localStorage", () => {
        let resultString = "cached";
        let cachedResult = JSON.stringify({ text: resultString });

        beforeAll(() => {
          global.fetch = jest.fn();
          jest
            .spyOn(Storage.prototype, "getItem")
            .mockReturnValue(cachedResult);
          fetch.mockResolvedValue();
        });

        it("returns the cached data to the test component", async () => {
          const { getByTestId } = render(<TestComponent />);

          await waitForElement(() => getByTestId("result"));
          expect(getByTestId("result")).toBeTruthy();
          expect(getByTestId("result").textContent).toBe(resultString);
        });
      });

      describe("and no data is in localStorage", () => {
        beforeAll(() => {
          global.fetch = jest.fn();
          jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
          fetch.mockResolvedValue();
        });

        it("returns an error", async () => {
          const { getByTestId } = render(<TestComponent />);

          await waitForElement(() => getByTestId("error"));
          expect(getByTestId("error")).toBeTruthy();
        });
      });
    });
  });
});
