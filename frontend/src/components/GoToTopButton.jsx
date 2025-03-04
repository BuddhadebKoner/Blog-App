import React, { useState, useEffect, useRef } from "react";

const GoToTopButton = () => {
   const [isVisible, setIsVisible] = useState(false);
   const scrollContainerRef = useRef(null);

   useEffect(() => {
      // Find the scrollable container (parent of the Outlet content)
      const scrollContainer = document.querySelector('main > div.overflow-y-auto');
      if (scrollContainer) {
         scrollContainerRef.current = scrollContainer;

         // Check scroll position
         const checkScrollPosition = () => {
            if (scrollContainer.scrollTop > 100) {
               setIsVisible(true);
            } else {
               setIsVisible(false);
            }
         };

         // Add scroll event listener
         scrollContainer.addEventListener("scroll", checkScrollPosition);

         return () => {
            // Clean up scroll event listener on unmount
            scrollContainer.removeEventListener("scroll", checkScrollPosition);
         };
      }
   }, []);

   // Scroll to top functionality
   const scrollToTop = () => {
      if (scrollContainerRef.current) {
         scrollContainerRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
         });
      }
   };

   return (
      isVisible && (
         <button
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-50 cursor-pointer"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               className="w-6 h-6"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
               />
            </svg>
         </button>
      )
   );
};

export default GoToTopButton;