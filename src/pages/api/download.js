/* eslint-disable import/no-anonymous-default-export */
import { NextApiResponse } from 'next';
const ytdl = require('ytdl-core')

export default function handler(req, res) {
  const URL = req.query.URL;
  res.setHeader('Content-Disposition', 'attachment; filename="video-to-audio.mp3"');
  ytdl(URL, { format: 'mp3', filter: 'audioonly' }).pipe(res);
  res.on('finish', () => {
    res.end();
  });
}
