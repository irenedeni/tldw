/* eslint-disable import/no-anonymous-default-export */
import { NextApiResponse, NextApiRequest } from 'next';
import ytdl from 'ytdl-core';

export default async function (req, res) {
  const URL = req.query.URL
  const audioReadableStream = ytdl(URL, { format: 'mp3', filter: 'audioonly' })
  const chunks = []
  audioReadableStream.on('data', (chunk) => {
    chunks.push(chunk)
  })
  audioReadableStream.on('end', () => {
    const audioBuffer = Buffer.concat(chunks)
    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(200).send(audioBuffer);
  })
}

// export default async function (req, res) {
//   const URL = req.query.URL
//   const videoReadableStream = ytdl(URL, { format: 'mp3', filter: 'audioonly' })
//   const chunks = []
//   videoReadableStream.on('data', (chunk) => {
//     chunks.push(chunk)
//   })
//   res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
//   res.setHeader('Content-Type', 'audio/mp3');
//   res.status(200).json({ videoReadableStream });
//   res.end();
// }
