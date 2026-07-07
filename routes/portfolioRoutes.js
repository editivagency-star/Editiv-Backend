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

// Admin Client Portal Modules
const createClient = require('../AdminSideModule/createClient');
const getClients = require('../AdminSideModule/getClients');
const updateClient = require('../AdminSideModule/updateClient');
const deleteClient = require('../AdminSideModule/deleteClient');

// Admin Project Modules
const createProject = require('../AdminSideModule/createProject');
const getProjects = require('../AdminSideModule/getProjects');
const getProjectById = require('../AdminSideModule/getProjectById');
const updateProject = require('../AdminSideModule/updateProject');
const deleteProject = require('../AdminSideModule/deleteProject');
const addDeliverable = require('../AdminSideModule/addDeliverable');

// Admin Invoice Modules
const createInvoice = require('../AdminSideModule/createInvoice');
const getInvoices = require('../AdminSideModule/getInvoices');
const getInvoiceById = require('../AdminSideModule/getInvoiceById');
const updateInvoice = require('../AdminSideModule/updateInvoice');
const deleteInvoice = require('../AdminSideModule/deleteInvoice');

// ClientSideModule (public)
const getPortfolio = require('../ClientSideModule/getPortfolio');
const createBooking = require('../ClientSideModule/createBooking');

// Client Portal Modules
const clientLogin = require('../ClientSideModule/clientLogin');
const getClientMe = require('../ClientSideModule/getClientMe');
const getClientProjects = require('../ClientSideModule/getClientProjects');
const getClientProjectById = require('../ClientSideModule/getClientProjectById');

// Middleware
const auth = require('../middleware/auth');
const clientAuth = require('../middleware/clientAuth');
const upload = require('../middleware/upload');

// Separate upload instance that accepts any file type (for deliverables)
const multer = require('multer');
const uploadAny = multer({ storage: multer.memoryStorage() });


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


/* ===== ADMIN — CLIENT MANAGEMENT ===== */

routes.post('/admin/clients', auth, createClient);
routes.get('/admin/clients', auth, getClients);
routes.put('/admin/clients/:id', auth, updateClient);
routes.delete('/admin/clients/:id', auth, deleteClient);


/* ===== ADMIN — PROJECT MANAGEMENT ===== */

routes.post('/admin/projects', auth, createProject);
routes.get('/admin/projects', auth, getProjects);
routes.get('/admin/projects/:id', auth, getProjectById);
routes.put('/admin/projects/:id', auth, updateProject);
routes.delete('/admin/projects/:id', auth, deleteProject);
routes.post('/admin/projects/:id/deliverable', auth, uploadAny.single('file'), addDeliverable);

/* ===== ADMIN — INVOICES ===== */
routes.post('/admin/invoices', auth, createInvoice);
routes.get('/admin/invoices', auth, getInvoices);
routes.get('/admin/invoices/:id', auth, getInvoiceById);
routes.put('/admin/invoices/:id', auth, updateInvoice);
routes.delete('/admin/invoices/:id', auth, deleteInvoice);


/* ===== CLIENT PORTAL ===== */

routes.post('/client/login', clientLogin);                          // public
routes.get('/client/me', clientAuth, getClientMe);
routes.get('/client/projects', clientAuth, getClientProjects);
routes.get('/client/projects/:id', clientAuth, getClientProjectById);

module.exports = routes;
