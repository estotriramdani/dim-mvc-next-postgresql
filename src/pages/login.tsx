import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { COOKIE_NAME } from '@/constants';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export default function LoginPage() {
  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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
        .post('/api/auth/login', input)
        .then((res) => {
          Cookies.set(COOKIE_NAME, JSON.stringify(res.data.data));
          toast.success('Login success. Please wait...');
          router.push('/');
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
            />
          </div>
          <div className="form-control w-full mb-4">
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
          {isLoading ? (
            <progress className="progress w-24"></progress>
          ) : (
            <button type="submit" className="btn">
              Login
            </button>
          )}

          <div className="mt-4">
            <Link href="/register" className="link link-hover">
              Register Here
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