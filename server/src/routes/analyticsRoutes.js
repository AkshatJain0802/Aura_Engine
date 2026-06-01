const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/', asyncHandler(getAnalytics));

module.exports = { analyticsRoutes: router };
