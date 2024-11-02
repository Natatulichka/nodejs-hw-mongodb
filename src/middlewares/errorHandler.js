import { isHttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (isHttpError(error) === true) {
    res
      .status(error.statusCode)
      .json({ status: error.statusCode, message: error.name, data: error });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
