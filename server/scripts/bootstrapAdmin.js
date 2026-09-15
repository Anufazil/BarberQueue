require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/User');
(async () => {
 const { BOOTSTRAP_ADMIN_NAME: name, BOOTSTRAP_ADMIN_EMAIL: email, BOOTSTRAP_ADMIN_PASSWORD: password } = process.env;
 if (!name || name.trim().length < 2 || !email || !validator.isEmail(email) || !password || password.length < 8 || Buffer.byteLength(password) > 72) throw new Error('Provide valid BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD in this process environment.');
 await require('../config/db')(); await User.init();
 if (await User.exists({role:'ADMIN'})) throw new Error('An administrator already exists. Use the authenticated admin endpoint.');
 await User.create({name:name.trim(),email:email.toLowerCase().trim(),password:await bcrypt.hash(password,12),role:'ADMIN'});
 console.info('Administrator created. Remove bootstrap variables from the environment.');
})().catch(error=>{console.error(error.code === 11000 ? 'Account already exists.' : error.message);process.exitCode=1;}).finally(()=>mongoose.disconnect());
