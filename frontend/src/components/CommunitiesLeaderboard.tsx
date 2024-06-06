import React from 'react';
import './CommunitiesLeaderboard.css';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

interface Leaderboard {
  community: Community;
  totalExperiencePoints: number;
  numberOfUsers: number;
  _id: string;
}

interface Community {
  name: string;
  logo: string;
}

const Leaderboard: React.FC = () => {
  const {data, isLoading: leaderboardLoading} = useQuery<{
    leaderboard: Leaderboard[];
  }>({
    queryKey: ['leaderboard'],
    queryFn: () =>
      axios.get('http://localhost:8080/leaderboard').then((res) => res.data),
  });

  if (leaderboardLoading) return <div>Loading...</div>;

  return (
    <div className="leaderboard">
      <h2>Community Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th
              style={{
                width: '50px',
              }}
            >
              Rank
            </th>
            <th>Community</th>
            <th>Users</th>
            <th>Total XP</th>
          </tr>
        </thead>
        <tbody>
          {data?.leaderboard.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={'https://via.placeholder.com/40'}
                  className="community-logo"
                />
                {'  '}
                {item.community.name}
              </td>
              <td>{item.numberOfUsers}</td>
              <td>{item.totalExperiencePoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
