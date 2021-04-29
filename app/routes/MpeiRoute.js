const express = require('express');
const { apiPrefix } = require('../../config');
const {
  addStudentsGroup,
  getStudentsGroups,
  getSchedule,
  getActuality,
  setActuality,
  getPlaylist,
  notSupported,
  getHealth,
  getVersion,
  ping,
} = require('../controllers/MpeiController');

const router = express.Router();

router.route(`${apiPrefix}/addStudentsGroup/`).post(addStudentsGroup);
router.route(`${apiPrefix}/getStudentsGroups/`).get(getStudentsGroups);
router.route(`${apiPrefix}/getSchedule/`).get(getSchedule);
router.route(`${apiPrefix}/getPlaylist/:playlistId`).get(getPlaylist);
router.route(`${apiPrefix}/setActuality`).post(setActuality);
router.route(`${apiPrefix}/getActuality`).get(getActuality);
router.route(`${apiPrefix}/ping`).get(ping);
router.route(`${apiPrefix}/health`).get(getHealth);
router.route(`${apiPrefix}/version`).get(getVersion);
router.route(`${apiPrefix}/:method`).get(notSupported);

module.exports = router;
