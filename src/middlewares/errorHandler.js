import { isHttpError } from 'http-errors';
export function errorHandler(error, req, res, next) {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (isHttpError(error) === true) {
    res.status(error.status).json({
      status: error.status,
      message: error.name,
      data: error,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
}
