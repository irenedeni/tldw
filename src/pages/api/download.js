/* eslint-disable import/no-anonymous-default-export */
import { NextApiResponse } from 'next';
const ytdl = require('ytdl-core')

export default function handler(req, res) {
  const URL = req.query.URL;
  console.log('URL in api', req)
  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
  ytdl(URL, { format: 'mp4' }).pipe(res);
}
