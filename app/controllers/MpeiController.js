const YouTube = require('simple-youtube-api');
const { CacheService } = require('../cache/CacheService');

const youtube = new YouTube(process.env.YOUTUBE_API);
const ttl = 3600; // 1 hour
const cache = new CacheService(ttl);

const GetPlaylist = async (req, res) => {
  const { playlistId, maxResults } = req.body;
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
      return res.status(200).json({ videos: { count: videos.length, data } });
    })
    .catch((err) => res.status(400).json({ message: err }));
};

const NotSupported = async (req, res) => res.status(400)
  .json({ message: 'method is not supported' });

module.exports = {
  GetPlaylist,
  NotSupported,
};
