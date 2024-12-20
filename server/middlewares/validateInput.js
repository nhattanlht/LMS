import { body, validationResult } from 'express-validator';

// Validation đăng ký
export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Tên chỉ chứa chữ cái'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 }).withMessage('Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt')
];

// Middleware xác thực
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};