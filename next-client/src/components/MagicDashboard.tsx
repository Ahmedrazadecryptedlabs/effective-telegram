import React from 'react';
import { LoginProps } from '../types';
import MagicUserInfoCard from './MagicUserInfoCard';




export type { Magic } from '../context/MagicProvider'
export default function MagicDashboard({ magicToken, setMagicToken }: LoginProps) {
  return (
    <div className="home-page">
      <div className="cards-container">
        <MagicUserInfoCard magicToken={magicToken} setMagicToken={setMagicToken} />

     </div>
    </div>
  );
}
