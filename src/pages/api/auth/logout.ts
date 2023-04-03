import { RAPI } from '@/interfaces';
import authentication from '@/models/authentication';
import type { NextApiRequest, NextApiResponse } from 'next';
import Token from '@/models/Token.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    if (req.method !== 'POST') {
      return res.status(400).json({ status: 'error', message: 'Method not allowed' });
    }

    await authentication();
    const { token, UserId } = req.body;

    if (!UserId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }

    if (!token) {
      await Token.destroy({ where: { UserId } });
    } else {
      await Token.destroy({ where: { token, UserId } });
    }

    res.status(200).json({ status: 'success', message: 'Login success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error?.message || 'Something went wrong', error });
  }
}
