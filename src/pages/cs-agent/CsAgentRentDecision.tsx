import AgentCheckouts from '@components/cs-agent/dashboard/AgentCheckouts';
import React from 'react';
import { useAppSelector } from "@store/hook";
 const CsAgentRentDecision: React.FC = () => {
  const {  user } = useAppSelector((state) => state.Authslice);

    
  return (
      <AgentCheckouts  userId={user!.id}/>
  );
};

export default CsAgentRentDecision;
