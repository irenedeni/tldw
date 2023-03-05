# TL;DW: ChatGPT and Whisper APIs

TL;DW (**Too Long, Didn't Watch**) is an app that uses ChatGPT and Whisper APIs to convert any youtube video URL or any uploaded MP3 into a written summary. For the lazy ones ✋.

## Setup
1. If you don’t have Node.js installed, install it from here (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

`$ cd tldw`

4. Install the requirements

`$ npm install`

5. Make a copy of the example environment variables file

- On Linux systems:

`$ cp .env.example .env`

- On Windows:

`$ copy .env.example .env`

6. Add your API key to the newly created .env file

7. Run the app

`$ npm run dev`

8. You should now be able to access the app at http://localhost:3000.
