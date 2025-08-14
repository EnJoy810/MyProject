import React from 'react';
import { Skeleton } from 'react-vant';

const CardSkeleton = ({ rows = 3, className = '', style = {} }) => {
  return (
    <div
      className={className}
      style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 16,
        ...style
      }}
    >
      <Skeleton title row={rows} round avatar={false} />
    </div>
  );
};

export default CardSkeleton;

