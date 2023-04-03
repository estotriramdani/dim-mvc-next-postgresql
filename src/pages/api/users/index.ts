import { NextApiRequest, NextApiResponse } from 'next';
import { RAPI } from '@/interfaces';
import Role from '@/models/Role.model';
import User from '@/models/User.model';
import authentication from '@/models/authentication';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    if (req.method === 'GET') {
      await authentication();
      if (req.query?.email) {
        const users = await User.findOne({
          include: [Role],
          where: {
            email: req.query?.email,
          },
        });
        res.status(200).json({
          status: 'success',
          message: 'Success get users',
          data: users,
        });
      }
      const users = await User.findAll({
        include: [Role],
      });
      res.status(200).json({
        status: 'success',
        message: 'Success get users',
        data: users,
      });
    } else {
      return res.status(400).json({ status: 'error', message: 'Method not allowed' });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ status: 'error', message: error?.message || 'Something went wrong', error });
  }
}
