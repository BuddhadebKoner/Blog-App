import { WifiOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const OfflineDetector = ({ children }) => {
   const [isOffline, setIsOffline] = useState(!navigator.onLine);

   useEffect(() => {
      // Function to update online status
      const handleOnlineStatusChange = () => {
         setIsOffline(!navigator.onLine);
      };

      // Add event listeners
      window.addEventListener('online', handleOnlineStatusChange);
      window.addEventListener('offline', handleOnlineStatusChange);

      // Check initial status
      setIsOffline(!navigator.onLine);

      // Cleanup event listeners
      return () => {
         window.removeEventListener('online', handleOnlineStatusChange);
         window.removeEventListener('offline', handleOnlineStatusChange);
      };
   }, []);

   return (
      <div className="relative w-full h-full z-50">
         {children}

         {/* Overlay when offline - Fixed condition */}
         {isOffline && (
            <div
               className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center"
               onClick={(e) => e.preventDefault()}
               onMouseDown={(e) => e.preventDefault()}
               onMouseUp={(e) => e.preventDefault()}
               onMouseMove={(e) => e.preventDefault()}
               style={{
                  cursor: 'not-allowed',
                  userSelect: 'none',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
               }}
            >
               <div
                  className="p-6 rounded-lg shadow-lg max-w-md text-center"
                  style={{
                     backgroundColor: 'var(--color-background-light)',
                     color: 'var(--color-text-primary-light)'
                  }}
               >
                  <WifiOff
                     style={{
                        color: 'var(--color-button-primary-light)',
                     }}
                     className='w-10 h-10 mx-auto mb-4 dark:text-[var(--color-button-primary-dark)]'
                  />
                  <h2 className="text-xl font-bold mb-2">You're offline</h2>
                  <p
                     className="mb-4"
                     style={{ color: 'var(--color-text-secondary-light)' }}
                  >
                     Please check your internet connection and try again.
                  </p>
               </div>
            </div>
         )}
      </div>
   );
};

export default OfflineDetector;