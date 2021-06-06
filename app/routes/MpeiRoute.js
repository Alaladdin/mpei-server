const express = require('express');
const { apiPrefix } = require('../../config');
const {
  addStudentsGroup,
  getStudentsGroups,
  getSchedule,
  getActuality,
  setActuality,
  getPlaylist,
  notFounded,
  getHealth,
  getVersion,
  ping,
} = require('../controllers/MpeiController');

const { getConfig: getDiscordBotConfig, setConfig: setDiscordBotConfig } = require('../controllers/DiscordBotController');
const { getConfig: getVKBotConfig, setConfig: setVKBotConfig } = require('../controllers/VKBotController');

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

router.route(`${apiPrefix}/getDiscordBotConfig/`).get(getDiscordBotConfig);
router.route(`${apiPrefix}/setDiscordBotConfig/`).post(setDiscordBotConfig);
router.route(`${apiPrefix}/getVKBotConfig/`).get(getVKBotConfig);
router.route(`${apiPrefix}/setVKBotConfig/`).post(setVKBotConfig);

router.route(`${apiPrefix}/:method`).get(notFounded);

module.exports = router;
