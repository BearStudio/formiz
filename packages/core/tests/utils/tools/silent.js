/* eslint-disable no-console */
export const silent = (callback) => {
  const originalError = console.error;
  const originalLog = console.log;

  console.error = jest.fn();
  console.log = jest.fn();

  callback();

  console.error = originalError;
  console.log = originalLog;
};
