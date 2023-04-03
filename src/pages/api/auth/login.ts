// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RAPI } from '@/interfaces';
import User from '@/models/User.model';
import bcrypt from 'bcrypt';
import authentication from '@/models/authentication';
import type { NextApiRequest, NextApiResponse } from 'next';
import Token from '@/models/Token.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    if (req.method !== 'POST') {
      return res.status(400).json({ status: 'error', message: 'Method not allowed' });
    }

    await authentication();
    const { password, email } = req.body;

    if (!password || !email) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    await Token.create({
      token,
      UserId: user.id,
    });

    res.status(200).json({ status: 'success', message: 'Login success', data: { token } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Unable to connect to the database:', error });
  }
}
