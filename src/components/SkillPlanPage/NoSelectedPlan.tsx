import React from 'react';
import { CirclePlus } from 'lucide-react';
import type { Plan } from '../../types/plan';

interface NoSelectedPlanProps {
  planOptions: Array<{
    id: string;
    label: string;
    plan: Plan;
    isTemplate: boolean;
  }>;
  handlePlanChange: (option: unknown) => void;
}

export const NoSelectedPlan: React.FC<NoSelectedPlanProps> = ({ planOptions, handlePlanChange }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: '#222',
      borderRadius: '4px',
      marginTop: '20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        No plan selected
      </div>
      
      <p style={{ maxWidth: '600px', color: '#aaa' }}>
        Select a template plan below to get started.
      </p>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        justifyContent: 'center',
        maxWidth: '800px'
      }}>
        {planOptions.map(option => (
          <button
            key={option.id}
            onClick={() => handlePlanChange(option)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 15px',
              background: option.isTemplate ? '#2c3e50' : '#2e7d32',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {option.isTemplate ? '📋' : <CirclePlus size={16} />}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};