const messageStatus = (code: number, message: string = "") => {
  switch (code) {
    case 200:
      return {
        Response: "Successfuly",
        Message: message,
      };
    case 400:
      return {
        Response: "Bad Request",
        Message: message,
      };
    case 401:
      return {
        Response: "Unauthorized",
        Message: message,
      };
    case 403:
      return {
        Response: "Forbidden",
        Message: message,
      };

    case 404:
      return {
        Response: "Not Found",
        message: message,
      };
    case 500:
      return {
        Response: "Internal Server Error",
        Message: message,
      };
    default:
      break;
  }
};
export default messageStatus;
