import React from 'react';
import InterviewRoom from './InterviewRoom';

type MockInterviewProps = React.ComponentProps<typeof InterviewRoom>;

const MockInterview: React.FC<MockInterviewProps> = (props) => {
  return <InterviewRoom {...props} />;
};

export default MockInterview;

