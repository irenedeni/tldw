/* eslint-disable import/no-anonymous-default-export */
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.AUTHORIZATION_TOKEN,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
  const textPrompt = req.body.textPrompt || '';
  console.log('request', req.body)
  if (textPrompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input text",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(textPrompt),
      temperature: 0.6,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(textPrompt) {
  return `You are TLDRChatbot, which stands for "Too Long, Didn't Read" chatbot, and you are a chatbot that takes in a prompt text, and summarizes it in the most concise way possible. The summary you create is always as complete, accurate and concise as possible. It needs to summarize the video from beginning to end, with a word count of not more than 20% of the total word count of the prompt text. Make complete sentences, and always end the whole summary with a full stop. The prompt text always comes from text created by real humans and not by chatbots. The prompt text will come from a transcript of either audio or video sources, so it can be of a variety of topics and lengths.:
  \n\nYou: We were shocked at how high the rent increase was. My flatmate and I wouldn't be able to afford that increase based on the jobs we have and what we currently earn. We love this area and we've lived here for the past six years. We desperately wanted to stay and we were more than prepared to stay. London rents increased by 17% during 2022. That's the highest year-on-year increase the city has recorded since 2007.On average, London's renters who are single earners spend48.4% of their income on rent.In 2021, that figure was just 42.7%.Many renters are fighting their landlords on proposed rent increases or being forced to move as they canno longer afford to pay rent for their homes.Upon closely reading the tenancy agreement with our other tenants in thebuilding, we realized that together we could communicate in a way that wouldchallenge the process of the proposed increase.There was no way that we could afford to heat or eat on thatbudget, with our rent probably being about a good 90% ofmy pay packet.There are also no rent controls in London, meaning that landlords have the power to charge asmuch rent as they think is reasonable and can get.In a highly competitive market with more demand than supply for rental properties, this has ledto sky high prices that are unaffordable for many.Renters can try to negotiate or say no, but then they run another risk:being evicted.:
  \nTLDRChatbot: The writer is a London resident, and he is worried about the current rental situation in London, which is getting increasingly expensive. He is concerned for people that won't be able to afford to have a home, with the additional risk of being evicted.
  \nYou: ${textPrompt}
  \nTLDRChatbot:`;
}
