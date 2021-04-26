const YouTube = require('simple-youtube-api');
const fetch = require('node-fetch');
const Actuality = require('../models/Actuality');
const StudentsGroups = require('../models/StudentsGroups');
const replace = require('../utility/replace');
const { CacheService } = require('../cache/CacheService');
const { getMpeiScheduleUrl, youtubeApi, cacheTime } = require('../../config');
const filterArray = require('../utility/filterArray');

const youtube = new YouTube(youtubeApi);
const cache = new CacheService(cacheTime);

const GetPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { maxResults } = req.query;
  const playlistCacheKey = `getPlaylist__${playlistId}`;
  const videosCacheKey = `getVideos__${maxResults}__${playlistId}`;

  return cache.get(playlistCacheKey, () => youtube.getPlaylistByID(playlistId))
    .then((playlist) => cache.get(videosCacheKey, () => playlist.getVideos(maxResults)))
    .then((videos) => {
      const data = {};
      videos.forEach((video) => {
        const { snippet } = video.raw;
        data[snippet.resourceId.videoId] = snippet.title;
      });
      return res.status(200).json({
        videos: {
          count: videos.length,
          data,
        },
      });
    })
    .catch((err) => res.status(400).json({ message: err }));
};

// getActuality
const getActuality = async (req, res) => {
  try {
    return cache.get('actuality', async () => Actuality.findOne({ actuality: Object })
      .select({
        actuality: 1,
      })
      .lean())
      .then((data) => {
        if (data) return res.status(200).json({ actuality: data.actuality });
        return res.status(404).json({ error: 'Actuality not found in database' });
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

// setActuality
const setActuality = async (req, res) => {
  const { content, lazyContent } = req.body.actuality || {};
  const existsActuality = await Actuality.findOne({ actuality: Object });
  const { actuality: currAct } = existsActuality || {};

  if (!existsActuality) {
    const newAct = new Actuality({
      actuality: {
        content: content ? replace.all(content) : null,
        lazyContent: lazyContent ? replace.all(lazyContent) : null,
      },
    });
    await newAct.save();
    return res.status(201).json({ newAct });
  }

  try {
    await existsActuality.updateOne(
      {
        actuality: {
          content: content ? replace.all(content) : currAct.content,
          lazyContent: lazyContent ? replace.all(lazyContent) : currAct.lazyContent,
          date: Date.now(),
        },
      },
    );

    return res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

// getSchedule
const getSchedule = async (req, res) => {
  const { start, finish, group } = req.query;
  const url = getMpeiScheduleUrl(start, finish, group);

  return fetch(url)
    .then(async (r) => {
      let schedule = await r.json() || [];
      const scheduleLength = schedule ? schedule.length : 0;
      const scheduleIndexesToDelete = [];

      // if request error
      if (!r.ok) throw new Error(r.statusText);

      // compare two nearest array elements
      for (let i = 0; i <= scheduleLength - 2; i += 2) {
        const c = schedule[i]; // current elements
        const n = schedule[i + 1]; // next element
        if (!n) break; // stop loop, if next element not exists

        if (
          (c.date === n.date)
          && (c.discipline === n.discipline)
          && (c.kindOfWork === n.kindOfWork)
          && (c.lecturer === n.lecturer)
        ) {
          // combine two array elements
          schedule[i].endLesson = n.endLesson;
          scheduleIndexesToDelete.push(i + 1);
        }
      }

      // filter array
      schedule = filterArray(schedule, scheduleIndexesToDelete);

      return res.status(200).json({ schedule });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: 'some error was occurred' });
    });
};

// addStudentsGroup
const addStudentsGroup = async (req, res) => {
  const { studentsGroup } = req.body || {};
  const isGroupExists = await StudentsGroups.findOne({ id: studentsGroup.id });

  try {
    if (!isGroupExists) {
      const newGroup = new StudentsGroups({
        id: studentsGroup.id,
        title: studentsGroup.title,
      });
      await newGroup.save();
      return res.status(201).json({ newGroup });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'some error was occurred' });
  }

  return res.status(400).json({ error: 'students group with this id already exists' });
};

// getStudentsGroups
const getStudentsGroups = async (req, res) => {
  try {
    return cache.get('studentsGroups', async () => StudentsGroups.find()
      .select({
        id: 1,
        title: 1,
      })
      .lean())
      .then((data) => {
        if (data) return res.status(200).json({ studentsGroups: data });
        return res.status(404).json({ error: 'students group not found in database' });
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

// NotSupported
const NotSupported = async (req, res) => res.status(400).json({ message: 'method is not supported' });

module.exports = {
  addStudentsGroup,
  getStudentsGroups,
  getSchedule,
  getActuality,
  setActuality,
  GetPlaylist,
  NotSupported,
};
