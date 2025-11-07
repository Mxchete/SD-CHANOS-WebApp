import React from 'react';
import Notifications from './Notifications';
import PotOverview from './PotOverview';
import UserProfileIcon from "./ProfileIcon";

const OverviewPage = () => (
  <div>
    <UserProfileIcon />
    <Notifications />
    <PotOverview />
  </div>
);

export default OverviewPage;
