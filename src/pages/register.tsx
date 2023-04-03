import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { COOKIE_NAME } from '@/constants';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { RoleAttributes } from '@/models/Role.model';
import { GetServerSideProps } from 'next';

export default function LoginPage() {
  const [input, setInput] = useState({
    email: '',
    password: '',
    name: '',
    RoleId: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: roles } = useSWR<{ data: RoleAttributes[] }>('/api/roles', fetcher, {
    revalidateOnFocus: false,
  });

  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.email && input.password) {
      setIsLoading(true);
      axios
        .post('/api/auth/register', input)
        .then((res) => {
          Cookies.set(COOKIE_NAME, JSON.stringify(res.data.data));
          toast.success('Register success. Please login');
          router.replace('/login');
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-sm p-5 lg:rounded-2xl lg:shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="yourname@yourcompany.com"
              className="input input-bordered w-full"
              autoComplete="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              onChange={handleChange}
              name="name"
              type="text"
              className="input input-bordered w-full"
              autoComplete="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              onChange={handleChange}
              name="address"
              type="text"
              className="input input-bordered w-full"
              autoComplete="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              onChange={handleChange}
              name="password"
              type="password"
              className="input input-bordered w-full"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              className="select select-bordered"
              required
              onChange={(e) => setInput((prev) => ({ ...prev, RoleId: e.target.value }))}
            >
              <option disabled selected>
                Pick one
              </option>
              {roles?.data?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <progress className="progress w-24"></progress>
          ) : (
            <button type="submit" className="btn">
              Register
            </button>
          )}

          <div className="mt-4">
            <Link href="/login" className="link link-hover">
              Login Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.cookies[COOKIE_NAME];
  if (cookies) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
