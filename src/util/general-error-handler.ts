export function generalErrorHandler(err: any) {
  const { status, statusCode, message, msg } = err;
  const response = { status: 400, message: `Bad request` };
  if (status || statusCode) {
    response.status = status ?? statusCode;
  }
  if (message || msg) {
    response.message = message ?? msg;
  }
  return response;
}
