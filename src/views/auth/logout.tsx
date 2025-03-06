import React, { useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';

const Logout = () => {
  useEffect(() => {
    localStorage.clear();
    window.location.href = '/';
    signOut();
  });
  return <></>;
};

export default Logout;
