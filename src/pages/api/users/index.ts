import { NextApiRequest, NextApiResponse } from 'next';
import { RAPI } from '@/interfaces';
import Role from '@/models/Role.model';
import User from '@/models/User.model';
import authentication from '@/models/authentication';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    await authentication();
    if (req.method === 'GET') {
      if (req.query?.email) {
        const users = await User.findOne({
          include: [Role],
          where: {
            email: req.query?.email,
          },
        });
        return res.status(200).json({
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
    } else if (req.method === 'PUT') {
      const { name, email, address, RoleId, roleId, id } = req.body;
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(400).json({ status: 'error', message: 'User not found' });
      }
      await user.update({
        name,
        email,
        address,
        RoleId: RoleId || roleId,
      });
      res.status(200).json({
        status: 'success',
        message: 'Success update user',
        data: user,
      });
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(400).json({ status: 'error', message: 'User not found' });
      }
      await user.destroy();
      res.status(200).json({
        status: 'success',
        message: 'Success delete user',
        data: user,
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
