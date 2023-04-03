import { COOKIE_NAME } from '@/constants';
import useUserData from '@/hooks/useUserData';
import { UserAttributes } from '@/models/User.model';
import { fetcher } from '@/utils/fetcher';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function Home() {
  const userData = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data } = useSWR<{ data: UserAttributes }>(
    `/api/users?email=${userData?.email}`,
    userData?.email ? fetcher : null,
    { revalidateOnFocus: false }
  );

  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .post('/api/auth/logout', { token: userData?.token, UserId: userData?.id })
      .then((res) => {
        Cookies.remove(COOKIE_NAME);
        toast.success('Logout success');
        router.replace('/login');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-3xl p-5 lg:rounded-2xl lg:shadow-2xl">
        {!data ? (
          <progress className="progress"></progress>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-3">Detail Profile</h2>
            <div className="overflow-x-auto mb-3">
              <table className="table table-zebra w-full">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{data?.data?.name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{data?.data?.email}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{data?.data?.address}</td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>
                      {data?.data?.Role?.name} - {data.data?.Role?.note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {isLoading ? (
              <progress className="progress"></progress>
            ) : (
              <button className="btn" onClick={handleSubmit}>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.cookies[COOKIE_NAME];
  if (!cookies) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
