const express = require('express');
const routes = express.Router();

// AdminSideModule
const createAdmin = require('../AdminSideModule/createAdmin');
const adminLogin = require('../AdminSideModule/loginAdmin');

const getFolders = require('../AdminSideModule/getFolders');
const addFolder = require('../AdminSideModule/addFolder');
const updateFolder = require('../AdminSideModule/updateFolder');
const deleteFolder = require('../AdminSideModule/deleteFolder');

const addPortfolio = require('../AdminSideModule/addPortfolio');
const deletePortfolio = require('../AdminSideModule/deletePortfolio');

const getBookings = require('../AdminSideModule/getBookings');
const deleteBooking = require('../AdminSideModule/deleteBooking');
const updateBookingStatus = require('../AdminSideModule/updateBookingStatus');

// ClientSideModule
const getPortfolio = require('../ClientSideModule/getPortfolio');
const createBooking = require('../ClientSideModule/createBooking');

// Middleware
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');


/* ===== AUTH ===== */

routes.post('/admin/create', createAdmin);
routes.post('/admin/login', adminLogin);


/* ===== FOLDERS ===== */

routes.get('/folders', getFolders); // public
routes.post('/booking', createBooking);
routes.post('/admin/folder', auth, upload.single("image"), addFolder);
routes.put('/admin/folder/:id', auth, upload.single("image"), updateFolder);
routes.delete('/admin/folder/:id', auth, deleteFolder);


/* ===== PORTFOLIO ===== */

routes.get('/portfolio', getPortfolio);
routes.post('/admin/portfolio', auth, upload.single("image"), addPortfolio);
routes.delete('/admin/portfolio/:id', auth, deletePortfolio);

routes.get('/admin/bookings', auth, getBookings); // admin
routes.delete('/admin/booking/:id', auth, deleteBooking);
routes.put('/admin/booking/:id/status', auth, updateBookingStatus);

module.exports = routes;
