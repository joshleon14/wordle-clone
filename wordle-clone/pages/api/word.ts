import type { NextApiRequest, NextApiResponse } from 'next';
const randomWords = require('random-words');

type Data = {
  word: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const { method } = req;
    console.log(method)

    if (method === "GET") {

        let word = randomWords({exactly: 1, maxLength: 5});
        while (word[0].length != 5) {
            word = randomWords({exactly: 1, maxLength: 5})
        }
   
        res.status(200).json({ word: word[0] })
    }
  res.status(200).json({ word: 'NA' })
}
