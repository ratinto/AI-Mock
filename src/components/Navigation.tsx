import React from 'react';
import Navbar from './Navbar';

type NavigationProps = React.ComponentProps<typeof Navbar>;

const Navigation: React.FC<NavigationProps> = (props) => {
  return <Navbar {...props} />;
};

export default Navigation;

