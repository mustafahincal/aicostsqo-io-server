const express = require('express');
const {
  getBySiteId,
  create,
  createGprProfile,
  deleteGprs,
  deleteGprProfiles,
  exportBySiteId,
  getExcelTemplate,
  importFromXlsx,
} = require('../controllers/gprs.controller');
const errorCatcher = require('../scripts/utils/errorCatcher');

const router = express.Router();

router.route('/').post(errorCatcher(create));
router.route('/profiles').post(errorCatcher(createGprProfile));
router.route('/bulk-delete').post(errorCatcher(deleteGprs));
router.route('/profiles/bulk-delete').post(errorCatcher(deleteGprProfiles));
router.route('/by-site/:siteId').get(errorCatcher(getBySiteId));
router.route('/export/by-site/:siteId').get(errorCatcher(exportBySiteId));
router.route('/import/xlsx-template').get(errorCatcher(getExcelTemplate));
router.route('/import/from-xlsx').post(errorCatcher(importFromXlsx));

module.exports = router;
