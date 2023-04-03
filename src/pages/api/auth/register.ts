// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RAPI } from '@/interfaces';
import User from '@/models/User.model';
import bcrypt from 'bcrypt';
import authentication from '@/models/authentication';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    if (req.method !== 'POST') {
      return res.status(400).json({ status: 'error', message: 'Method not allowed' });
    }
    await authentication();
    const { name, email, password, RoleId, roleId } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      RoleId: RoleId || roleId,
    });
    res.status(200).json({
      status: 'success',
      message: 'Success register user',
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Unable to connect to the database:', error });
  }
}
