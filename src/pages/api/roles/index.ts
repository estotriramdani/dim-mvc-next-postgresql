// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RAPI } from '@/interfaces';
import Role from '@/models/Role.model';
import authentication from '@/models/authentication';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<RAPI>) {
  try {
    await authentication();
    const roles = await Role.findAll();
    res.status(200).json({ status: 'success', message: 'Get all roles', data: roles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: 'Unable to connect to the database:', error });
  }
}
