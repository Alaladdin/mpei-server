const express = require('express');
const { apiPrefix } = require('../../config');
const { getStore: getDiscordBotStore, setStore: setDiscordBotStore } = require('../controllers/DiscordBotController');
const { getStore: getVKBotStore, setStore: setVKBotStore } = require('../controllers/VKBotController');
const { getFAQ, setFAQ, deleteFAQ } = require('../controllers/FAQController');
const {
  getStudentsGroups,
  addStudentsGroup,
  getSchedule,
  getActuality,
  setActuality,
  getPlaylist,
  notFounded,
  getHealth,
  getVersion,
  ping,
} = require('../controllers/MpeiController');

const router = express.Router();

// MAIN
router.route(`${apiPrefix}/addStudentsGroup/`).post(addStudentsGroup);
router.route(`${apiPrefix}/getStudentsGroups/`).get(getStudentsGroups);
router.route(`${apiPrefix}/getSchedule/`).get(getSchedule);
router.route(`${apiPrefix}/getPlaylist/:playlistId`).get(getPlaylist);
router.route(`${apiPrefix}/setActuality`).post(setActuality);
router.route(`${apiPrefix}/getActuality`).get(getActuality);
router.route(`${apiPrefix}/ping`).get(ping);
router.route(`${apiPrefix}/health`).get(getHealth);
router.route(`${apiPrefix}/version`).get(getVersion);

// BOTS
router.route(`${apiPrefix}/getDiscordBotStore/`).get(getDiscordBotStore);
router.route(`${apiPrefix}/setDiscordBotStore/`).post(setDiscordBotStore);
router.route(`${apiPrefix}/getVKBotStore/`).get(getVKBotStore);
router.route(`${apiPrefix}/setVKBotStore/`).post(setVKBotStore);

// FAQ
router.route(`${apiPrefix}/getFAQ/`).get(getFAQ);
router.route(`${apiPrefix}/setFAQ/`).post(setFAQ);
router.route(`${apiPrefix}/deleteFAQ/`).delete(deleteFAQ);

router.route(`${apiPrefix}/:method`).get(notFounded);

module.exports = router;
