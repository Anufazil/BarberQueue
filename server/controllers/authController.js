const User = require('../models/User');
const Barber = require('../models/Barber');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const fail = require('../utils/httpError');
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });
exports.registerAdmin = asyncHandler(async (req, res) => {
 const { name, email, password } = req.body;
 const admin = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: 'ADMIN' });
 res.status(201).json({ success: true, message: 'Admin account created successfully', user: publicUser(admin) });
});
exports.login = asyncHandler(async (req, res) => {
 const { email, password } = req.body;
 const user = await User.findOne({ email }).select('+password');
 if (!user || !await bcrypt.compare(password, user.password)) throw fail(401, 'Invalid email or password');
 if (user.role === 'BARBER' && !await Barber.exists({ user: user._id, isActive: true })) throw fail(401, 'Invalid email or password');
 const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' });
 res.json({ success: true, message: 'Login successful', token, user: publicUser(user) });
});
exports.getMe = asyncHandler(async (req, res) => res.json({ success: true, user: publicUser(req.user) }));
