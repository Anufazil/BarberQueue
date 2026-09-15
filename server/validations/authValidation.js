const { body } = require('express-validator');
const email = () => body('email').isString().bail().trim().isEmail().bail().toLowerCase();
const password = () => body('password').isString().bail().isLength({ min: 8 }).custom(v => Buffer.byteLength(v, 'utf8') <= 72).withMessage('Password must be at least 8 characters and at most 72 bytes.');
exports.loginValidation = [email(), body('password').isString().bail().notEmpty().isLength({ max: 200 })];
exports.adminValidation = [email(), password(), body('name').isString().bail().trim().isLength({ min: 2, max: 50 })];
