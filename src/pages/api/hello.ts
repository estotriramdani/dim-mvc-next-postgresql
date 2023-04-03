// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RAPI } from '@/interfaces';
import sequelize from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    await sequelize.authenticate();
    res
      .status(200)
      .json({ status: 'success', message: 'Connection has been established successfully.' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error?.message || 'Something went wrong', error });
  }
}
