import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { listUsers } from '../utils/firebase';

const UsersContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  padding: 10px;
  margin: 10px 0;
  background-color: #fff2f2;
  border-radius: 4px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await listUsers();
        setUsers(fetchedUsers as User[]);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading users...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <UsersContainer>
      <Title>Registered Users</Title>
      <UserTable>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Created At</Th>
            <Th>Last Updated</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.displayName || 'N/A'}</Td>
              <Td>{user.email}</Td>
              <Td>{new Date(user.createdAt).toLocaleString()}</Td>
              <Td>{new Date(user.updatedAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </tbody>
      </UserTable>
    </UsersContainer>
  );
};

export default Users; 