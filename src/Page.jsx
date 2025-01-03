import React, { useEffect, useState, useCallback, useMemo } from 'react';

const Page = () => {
    const rows = 15;
    const cols = 20;
    const [activeColumns, setActiveColumns] = useState(new Set());
    const [fallingPositions, setFallingPositions] = useState({});
    const [columnColors, setColumnColors] = useState({});

    // Array of possible colors for variety
    const colors = useMemo(
        () => [
            'bg-red',
            'bg-blue',
            'bg-green',
            'bg-yellow',
            'bg-purple',
            'bg-pink',
            'bg-cyan',
            'bg-orange',
        ],
        []
    );

    // Memoized function to get a random color
    const getRandomColor = useCallback(() => {
        return colors[Math.floor(Math.random() * colors.length)];
    }, [colors]);

    useEffect(() => {
        const triggerNewFall = () => {
            const numNewColumns = Math.floor(Math.random() * 3) + 3; // Select 3-5 columns
            const newColumns = new Set();
            const newColors = {};

            while (newColumns.size < numNewColumns) {
                const col = Math.floor(Math.random() * cols);
                if (!newColumns.has(col)) {
                    newColumns.add(col);
                    newColors[col] = getRandomColor();
                }
            }

            setActiveColumns(newColumns);
            setColumnColors((prev) => ({ ...prev, ...newColors }));

            const newFallingPositions = {};
            newColumns.forEach((col) => {
                newFallingPositions[col] = 0;
            });
            setFallingPositions(newFallingPositions);
        };

        // Start initial fall
        triggerNewFall();

        // Set up interval for the falling effect
        const fallInterval = setInterval(() => {
            setFallingPositions((prev) => {
                const updated = { ...prev };
                let allComplete = true;

                Object.keys(updated).forEach((col) => {
                    if (updated[col] < rows) {
                        updated[col] += 1;
                        allComplete = false;
                    }
                });

                if (allComplete) {
                    setColumnColors({});
                    triggerNewFall();
                }

                return updated;
            });
        }, 50); // Increased speed

        return () => clearInterval(fallInterval);
    }, [cols, rows, getRandomColor]);

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
            const opacity = 1 - rowIndex / rows; // Lower opacity for higher rows
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
                    aspectRatio: `${cols}/${rows}`,
                }}
            >
                {Array.from({ length: rows }).map((_, rowIndex) =>
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
                )}
            </div>
        </div>
    );
};

export default Page;
