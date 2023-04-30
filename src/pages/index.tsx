import { COOKIE_NAME } from '@/constants';
import useUserData from '@/hooks/useUserData';
import User, { UserAttributes } from '@/models/User.model';
import { fetcher } from '@/utils/fetcher';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Role from '@/models/Role.model';
import UserAdministration from '@/components/UserAdministration';
import authentication from '@/models/authentication';

export type ITabActive = 'profile' | 'change-role';

export default function Home({ users }: { users: UserAttributes[] }) {
  const userData = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [tabActive, setTabActive] = useState<ITabActive>('profile');
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
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="w-full max-w-6xl p-5 lg:rounded-2xl lg:shadow-2xl">
        {!data ? (
          <progress className="progress"></progress>
        ) : (
          <div className="mb-3 overflow-x-auto">
            <div className="mb-3 tabs">
              <button
                className={`tab tab-bordered ${tabActive === 'profile' ? 'tab-active' : ''}`}
                onClick={() => setTabActive('profile')}
              >
                Profile
              </button>
              {data?.data.RoleId !== 4 && (
                <button
                  className={`tab tab-bordered ${tabActive === 'change-role' ? 'tab-active' : ''}`}
                  onClick={() => setTabActive('change-role')}
                >
                  User Administration
                </button>
              )}
            </div>
            {tabActive === 'profile' && (
              <div className="mb-3">
                <table className="table w-full table-zebra">
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
            )}

            <div>{tabActive === 'change-role' && <UserAdministration users={users} />}</div>
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
  await authentication();
  const users = await User.findAll({
    include: [Role],
  });
  return {
    props: {
      users: users.map((user) => JSON.parse(JSON.stringify(user.toJSON()))),
    },
  };
};
