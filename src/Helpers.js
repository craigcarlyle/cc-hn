export const debounce = (func, wait = 0) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
};
