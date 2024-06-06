import './App.css';
import Leaderboard from './components/CommunitiesLeaderboard';

import {Toaster} from 'react-hot-toast';
import UserCommunityRelationshipManager from './components/UserCommunityRelationshipManager';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

const sampleCommunities = [
  {
    id: 1,
    logo: 'https://via.placeholder.com/40',
    name: 'Community A',
    totalExperiencePoints: 1200,
    numberOfUsers: 100,
  },
  {
    id: 2,
    logo: 'https://via.placeholder.com/40',
    name: 'Community B',
    totalExperiencePoints: 800,
    numberOfUsers: 80,
  },
  {
    id: 3,
    logo: 'https://via.placeholder.com/40',
    name: 'Community C',
    totalExperiencePoints: 1500,
    numberOfUsers: 150,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    loader: () => ({message: 'Hello Data Router!'}),
    Component() {
      return <UserCommunityRelationshipManager />;
    },
  },
  {
    path: '/leaderboard',
    Component() {
      return <Leaderboard communities={sampleCommunities} />;
    },
  },
]);

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <div>
        <a href="https://frameonesoftware.com" target="_blank">
          <img src="/logo.png" className="logo" alt="Frame One Software Logo" />
        </a>
      </div>
      <div>
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
      </div>
    </>
  );
}

export default App;
