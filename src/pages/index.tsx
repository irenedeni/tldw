/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import ytdl from 'ytdl-core';
import Head from 'next/head'
import { Roboto, Raleway } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const raleway = Raleway({
  weight: ['400', '700'],
  subsets: ['latin'],
})

type Props = {
  whisperEndpoint: string;
  authToken: string;
  data?: any;
}

export default function Home({ whisperEndpoint, authToken } : Props) {
  const [file, setFile] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [result, setResult] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  

  const uploadFile = async (file: any) => {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    const data = await fetch(whisperEndpoint, {
      headers:{
        "Authorization": `Bearer ${authToken}`,
      },
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    return data;
  };

  const handleChange = (e:any) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      const body = new FormData();
      body.append("image", e.target.files[0]);
    }
  }

  const handleVideoChange = (e:any) => {
    if (e.target.value) {
      setVideoUrl(e.target.value)
    }
  }

  const handleSubmit = async (e:any, youtube: boolean) => {
    e.preventDefault()
    let audioFile
    setLoading(true)
    if(youtube) {
      const URL = e.target.elements[0].value
      const res = await fetch(`/api/download?URL=${URL}`)
      const dataBlob = await res.blob()
      audioFile = new File([dataBlob], 'audio.mp3', { type: 'audio/mp3' })
    } else {
      audioFile = file
    }
    const responseFile = await uploadFile(audioFile)
    setResult(responseFile.text)
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textPrompt: responseFile.text }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setLoading(false)
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setLoading(false)
      setSummary(data.result);
    } catch(error) {
      setLoading(false)
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>TL;DW - Too long, didn`t watch</title>
        <meta name="description" content="tldw" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={roboto.className}>
      <div className={styles.container}>
        <h1 className={raleway.className} style={{ color: '#117bbe', marginBottom: '10px' }}>TL;DW</h1>
        <h2 className={raleway.className}>Too Long, Didn`t Watch</h2>
        <p className={raleway.className} style={{ margin: '20px auto' }}>Paste any Youtube URL or upload an MP3 file to read a quick summary of the transcription.</p>
        <div className={styles.videoContainer}>
          <form onSubmit={(e) => handleSubmit(e, true)} className={styles.form}>
            <input className={styles.urlInput} type="text" name="URL" placeholder="YouTube URL" onChange={handleVideoChange} />
            <button className={styles.videoBtn} disabled={videoUrl ? false : true} type="submit">Summarize Youtube Video</button>
          </form>
        </div>
        <p className={raleway.className} style={{margin: '40px auto 10px auto', color:'#117bbe'}}><b>Already have an mp3?</b></p>
          <form onSubmit={(e) => handleSubmit(e, false)} className={styles.form}>
            <input
              type="file"
              id="file-upload"
              accept="video/*, audio/*"
              name="file"
              onChange={handleChange}
              className={styles.fileInput}
            />
            <button
              type="submit"
              disabled={file ? false : true}
              className={styles.submitBtn}
            >
              Summarize Audio File
            </button>
          </form>
          <div className="results">
            {loading &&
              <div className={styles.loadingSpinner}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                  <circle fill="none" stroke="#333" strokeWidth="1" cx="12" cy="12" r="10" strokeDasharray="30 60">
                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
            }
            {summary && !loading && (
              <div className={styles.resultContainer}>
                <p>{summary}</p>
                {!showTranscript && 
                  <button onClick={() => setShowTranscript(true)}>Original Transcript</button>
                }
              </div>
            )}
            {showTranscript && !loading &&
              <div className={styles.resultContainer}>
                <h3 className={styles.resultTitle}>Original Transcription</h3>
                <p className={styles.resultText}>{result}</p>
              </div>
            }
          </div>
        </div>
      </main>
    </>
  )
}

export const getStaticProps = () => {
  const whisperEndpoint = process.env.WHISPER_ENDPOINT
  const authToken = process.env.AUTHORIZATION_TOKEN
  return {
    props: { 
      whisperEndpoint,
      authToken,
    },
  }
}