# TL;DW: ChatGPT and Whisper APIs

#### TL;DW ▶️ (**Too Long, Didn't Watch**) is an app that uses ChatGPT and Whisper APIs to convert any youtube video URL or any uploaded MP3 into a written summary. For the lazy ones ✋.

## This app was built for personal learning purposes and is still a work in progress ⚠️

All works, but the app still needs some love 💟.

*[To be totally honest, I lost interest once I figured that GPT-4 would be released in a matter of days and will include, among others, also the feature I am building. Regardless, I gained priceless learnings!]*

#### What's missing:
- Code needs to be more robust --> the Whisper call now happens on the frontend, which means that in production the API Key would not be secured. No good. For this reason the uploadFile function should be moved serverside, in a custom /api/upload.js file.
- The UI is veeeery basic, and could use some attention.  

## Setup
1. If you don’t have Node.js installed, install it first (Node.js version >= 14.6.0 required)

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

6. Add your OPEN AI API key to the newly created .env file

7. Run the app

`$ npm run dev`

8. You should now be able to access the app at http://localhost:3000.
