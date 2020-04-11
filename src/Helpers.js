export const debounce = (func, wait = 0) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
};

export const convertUnixTimeToString = (unixTime) => {
  const jsDate = new Date(unixTime * 1000);
  return jsDate.toLocaleString();
};
