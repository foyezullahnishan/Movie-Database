// middleware/validateMovie.js
const { body, validationResult } = require('express-validator');

const validateMovie = [
  body('title').notEmpty().withMessage('Title is required'),
  body('releaseYear').isInt({ min: 1900 }).withMessage('Release year must be a valid integer from 1900 onwards'),
  body('plot').notEmpty().withMessage('Plot is required'),
  body('runtime').isInt({ min: 1 }).withMessage('Runtime must be a valid integer in minutes'),
  body('director').notEmpty().withMessage('Director is required'),
  body('actors').optional().isArray().withMessage('Actors must be an array'),
  body('genres').optional().isArray().withMessage('Genres must be an array'),
  body('poster').optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateMovie;
