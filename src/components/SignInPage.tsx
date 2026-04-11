import React from 'react';
import Login from './Login';

type SignInPageProps = React.ComponentProps<typeof Login>;

const SignInPage: React.FC<SignInPageProps> = (props) => {
  return <Login {...props} />;
};

export default SignInPage;

