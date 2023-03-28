import { NextApiRequest, NextApiResponse } from "next";

const handler = (_request: NextApiRequest, response: NextApiResponse) => {
  let timeout;
  try {
    timeout = setTimeout(() => {
      return response.status(200).json({ name: "John Doe" });
    }, 1000);
  } catch (error) {
    clearTimeout(timeout);
    return response.status(500).end();
  }
};

export default handler;
