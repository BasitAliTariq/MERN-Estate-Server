export const errorHandler = (statusCode, message) => {
  //Now we create our error using js error object
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  //Now we return this error
  return error;
};
