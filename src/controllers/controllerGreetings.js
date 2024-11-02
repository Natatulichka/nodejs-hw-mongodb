export const getGreetingsController =
  ('/',
  (req, res) => {
    res.json({
      message: 'Welcome to MongoDB!',
    });
  });
