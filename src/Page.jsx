import React, { useEffect, useState } from 'react';

const Page = () => {
    const rows = 15;
    const cols = 20;
    const [activeColumns, setActiveColumns] = useState(new Set());
    const [fallingPositions, setFallingPositions] = useState({});
    const [columnColors, setColumnColors] = useState({});

    // Array of possible colors for variety
    const colors = [
      'bg-red',
      'bg-blue',
      'bg-green',
      'bg-yellow',
      'bg-purple',
      'bg-pink',
      'bg-cyan',
      'bg-orange'
    ];

    // Function to get a random color
    const getRandomColor = () => {
      return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
      // Function to trigger new falling animations
      const triggerNewFall = () => {
        // Randomly select 3-5 columns to make it more frequent
        const numNewColumns = Math.floor(Math.random() * 3) + 3; // Changed to 3-5 columns
        const newColumns = new Set();
        const newColors = {};
        
        while (newColumns.size < numNewColumns) {
          const col = Math.floor(Math.random() * cols);
          if (!newColumns.has(col)) {
            newColumns.add(col);
            newColors[col] = getRandomColor(); // Assign random color to new column
          }
        }
        
        setActiveColumns(newColumns);
        setColumnColors(prev => ({...prev, ...newColors}));
        
        // Initialize falling positions for new columns
        const newFallingPositions = {};
        newColumns.forEach(col => {
          newFallingPositions[col] = 0;
        });
        setFallingPositions(newFallingPositions);
      };

      // Start initial fall
      triggerNewFall();

      // Set up interval for the falling effect, speed increased
      const fallInterval = setInterval(() => {
        setFallingPositions(prev => {
          const updated = { ...prev };
          let allComplete = true;
          
          Object.keys(updated).forEach(col => {
            if (updated[col] < rows) {
              updated[col] += 1;
              allComplete = false;
            }
          });
          
          // If all columns completed falling, start new fall
          if (allComplete) {
            // Clear colors of completed columns
            setColumnColors({});
            triggerNewFall();
          }
          
          return updated;
        });
      }, 50); // Reduced from 100ms to 50ms for faster speed

      return () => clearInterval(fallInterval);
    }, [ ]);

    const isCellActive = (rowIndex, colIndex) => {
      if (activeColumns.has(colIndex)) {
        const fallingPosition = fallingPositions[colIndex];
        return rowIndex <= fallingPosition;
      }
      return false;
    };

    const getCellColor = (rowIndex, colIndex) => {
      if (isCellActive(rowIndex, colIndex)) {
        const color = columnColors[colIndex] || 'bg-black';
        
        // Reverse opacity based on row index: top = low opacity, bottom = high opacity
        const opacity = 1 - (rowIndex / rows); // Lower opacity for higher rows
        
        return `${color} opacity-${Math.floor(opacity * 100)}`; // Set the opacity class
      }
      return 'bg-black';
    };

    return (
      <div className="min-h-screen bg-black p-4">
        <div 
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            aspectRatio: `${cols}/${rows}`
          }}
        >
          {Array.from({ length: rows }).map((_, rowIndex) => (
            Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`
                  border border-gray aspect-square
                  transition-colors duration-300 ease-in
                  ${getCellColor(rowIndex, colIndex)}
                `}
              />
            ))
          ))}
        </div>
      </div>
    );
};

export default Page;
