import React, { useState, useEffect } from 'react';
import Row1 from './Row1';
import Row2 from './Row2';
import Row3 from './Row3';
import DashboardLayout from '../../Dashboard/DashboardLayout';
import ErrorBoundary from '../../ErrorBoundary'; // We'll create this next

const gridTemplateLargeScreens = `
  "a b c"
  "a b c"
  "a b c"
  "a b f"
  "d e f"
  "d e f"
  "d h i"
  "g h i"
  "g h j"
  "g h j"
`;

const gridTemplateSmallScreens = `
  "a" "a" "a" "a"
  "b" "b" "b" "b"
  "c" "c" "c"
  "d" "d" "d"
  "e" "e"
  "f" "f" "f"
  "g" "g" "g"
  "h" "h" "h" "h"
  "i" "i"
  "j" "j"
`;

const Dashboard = () => {
  const [isAboveMediumScreens, setIsAboveMediumScreens] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsAboveMediumScreens(window.innerWidth >= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full h-full p-6 md:p-8 bg-white/90 backdrop-blur-lg min-h-[calc(100vh-64px)]">
        <div 
          className="w-full h-full grid gap-6"
          style={{
            gridTemplateColumns: isAboveMediumScreens ? 'repeat(3, minmax(370px, 1fr))' : '1fr',
            gridTemplateAreas: isAboveMediumScreens ? gridTemplateLargeScreens : gridTemplateSmallScreens,
          }}
        >
          <ErrorBoundary>
            <Row1 />
          </ErrorBoundary>
          <ErrorBoundary>
            <Row2 />
          </ErrorBoundary>
          <ErrorBoundary>
            <Row3 />
          </ErrorBoundary>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
