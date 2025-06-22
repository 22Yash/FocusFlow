import React from 'react';
import TaskCard from './TaskCard';

const Quadrant = ({ title, subtitle, color, tasks }) => {
  return (
    <div className={`quadrant ${color}`}>
      <h2 className="title">
        {title} <br />
        <span style={{ fontWeight: 'normal', fontSize: '14px' }}>{subtitle}</span>
      </h2>
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} />
      ))}
    </div>
  );
};

export default Quadrant;
