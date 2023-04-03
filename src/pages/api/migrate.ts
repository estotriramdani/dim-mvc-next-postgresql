// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RAPI } from '@/interfaces';
import sequelize from '@/models';
import authentication from '@/models/authentication';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    await sequelize.authenticate();
    await authentication();
    res.status(200).json({ status: 'success', message: 'Migrate is success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Unable to connect to the database:', error });
  }
}
