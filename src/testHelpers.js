export const range = (start, end, length = end - start + 1) => {
  return Array.from({ length }, (_, i) => start + i);
};
