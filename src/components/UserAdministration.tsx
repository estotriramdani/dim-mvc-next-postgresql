import useUserData from '@/hooks/useUserData';
import { UserAttributes } from '@/models/User.model';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const dataRoles = [
  {
    id: 2,
    name: 'Manager',
    note: 'Manage department',
    createdAt: '2023-04-03T12:59:34.179Z',
    updatedAt: '2023-04-03T12:59:34.179Z',
  },
  {
    id: 4,
    name: 'Staff',
    note: 'Staff',
    createdAt: '2023-04-03T12:59:34.179Z',
    updatedAt: '2023-04-03T12:59:34.179Z',
  },
  {
    id: 3,
    name: 'Supervisor',
    note: 'Lead team in department',
    createdAt: '2023-04-03T12:59:34.179Z',
    updatedAt: '2023-04-03T12:59:34.179Z',
  },
  {
    id: 1,
    name: 'Admin',
    note: 'Manage everything',
    createdAt: '2023-04-03T12:59:34.179Z',
    updatedAt: '2023-04-03T12:59:34.179Z',
  },
];

export default function UserAdministration({ users }: { users: UserAttributes[] }) {
  const userData = useUserData();
  const [selectedData, setSelectedData] = useState<Record<string, string | number>>();
  const [dataUsers, setDataUsers] = useState<{ data: UserAttributes[] }>({ data: users });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!dataUsers || !selectedData) return;
    const url = '/api/users';
    setIsLoading(true);
    axios
      .put(url, selectedData)
      .then((res) => {
        toast.success('Update success success');
        const findIndexUser = dataUsers?.data.findIndex((user) => user.id === selectedData?.id);
        const newDataUsers = [...dataUsers?.data];
        const findRole = dataRoles.find((role) => role.id === +selectedData?.RoleId);
        newDataUsers[findIndexUser] = {
          ...selectedData,
          Role: findRole,
        } as unknown as UserAttributes;
        setDataUsers({ data: newDataUsers });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setSelectedData(undefined);
        setIsLoading(false);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSelectedData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const isOpenChangeRole = userData?.RoleId === 1;
  const isOpenPersonal = userData?.RoleId === 2 || userData?.RoleId === 3;

  return (
    <div>
      <table className="table w-full table-zebra">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {dataUsers?.data?.map((user) => (
            <tr key={user.id}>
              {selectedData?.id === user.id ? (
                <>
                  <td>
                    <input
                      value={selectedData?.name}
                      name="name"
                      onChange={handleChange}
                      type="text"
                      placeholder="Name"
                      className="w-full max-w-xs input input-bordered input-sm"
                    />
                  </td>
                  <td>
                    <input
                      value={selectedData?.email}
                      name="email"
                      onChange={handleChange}
                      type="text"
                      placeholder="Email"
                      className="w-full max-w-xs input input-bordered input-sm"
                    />
                  </td>
                  <td>
                    <input
                      value={selectedData?.address}
                      name="address"
                      onChange={handleChange}
                      type="text"
                      placeholder="Address"
                      className="w-full max-w-xs input input-bordered input-sm"
                    />
                  </td>
                  <td>
                    <select
                      disabled={isLoading}
                      name="RoleId"
                      id="RoleId"
                      value={selectedData?.RoleId}
                      onChange={(e) =>
                        setSelectedData((prev) => ({
                          ...prev,
                          RoleId: e.target.value,
                        }))
                      }
                    >
                      {dataRoles?.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button disabled={isLoading} className="btn btn-sm" onClick={handleSubmit}>
                      {isLoading ? <progress className="progress" /> : '✅ Save'}
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.Role?.name}</td>
                  <td>
                    <button onClick={() => setSelectedData(user as any)} className="btn btn-sm">
                      ✏️ Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {(!dataUsers || !dataRoles) && <progress className="progress" />}
    </div>
  );
}
