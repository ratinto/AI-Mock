import React from 'react';
import Signup from './Signup';

type SignUpPageProps = React.ComponentProps<typeof Signup>;

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  return <Signup {...props} />;
};

export default SignUpPage;

