import { isHttpError } from 'http-errors';

export const errorHandler = (error, req, res) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (isHttpError(error) === true) {
    return res
      .status(error.statusCode)
      .json({ status: error.statusCode, message: error.message });
  }

  console.error(error);

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
