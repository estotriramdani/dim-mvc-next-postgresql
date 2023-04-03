import { COOKIE_NAME } from '@/constants';
import { UserAttributes } from '@/models/User.model';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const useUserData = () => {
  const [userData, setUserData] = useState<UserAttributes & { token: string }>();

  useEffect(() => {
    const data = Cookies.get(COOKIE_NAME);
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  return userData;
};

export default useUserData;
