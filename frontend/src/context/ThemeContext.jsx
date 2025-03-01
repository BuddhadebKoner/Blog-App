import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
   const context = useContext(ThemeContext);
   if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
   }
   return context;
};

// Function to get the current system theme
const getSystemTheme = () =>
   window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

// Theme provider component
export const ThemeProvider = ({ children }) => {
   // Initialize theme state
   const [theme, setTheme] = useState(() => {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme || "system";
   });

   useEffect(() => {
      // Get the theme from localStorage
      const storedTheme = localStorage.getItem("theme");

      if (storedTheme === "system" || !storedTheme) {
         const systemTheme = getSystemTheme();
         setTheme("system");

         if (systemTheme === "dark") {
            document.documentElement.classList.add("dark");
         } else {
            document.documentElement.classList.remove("dark");
         }
      } else {
         setTheme(storedTheme);

         if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
         } else {
            document.documentElement.classList.remove("dark");
         }
      }

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
         if (localStorage.getItem("theme") === "system") {
            const newSystemTheme = getSystemTheme();
            if (newSystemTheme === "dark") {
               document.documentElement.classList.add("dark");
            } else {
               document.documentElement.classList.remove("dark");
            }
         }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
   }, []);

   // Toggle theme function
   const toggleTheme = (selectedTheme) => {
      if (selectedTheme === "system") {
         localStorage.setItem("theme", "system");
         const systemTheme = getSystemTheme();

         if (systemTheme === "dark") {
            document.documentElement.classList.add("dark");
         } else {
            document.documentElement.classList.remove("dark");
         }

         setTheme("system");
      } else {
         localStorage.setItem("theme", selectedTheme);

         if (selectedTheme === "dark") {
            document.documentElement.classList.add("dark");
         } else {
            document.documentElement.classList.remove("dark");
         }

         setTheme(selectedTheme);
      }
   };

   const getCurrentTheme = () => {
      if (theme === "system") {
         return getSystemTheme();
      }
      return theme;
   };

   const value = {
      theme,
      toggleTheme,
      isDark: getCurrentTheme() === "dark"
   };

   return (
      <ThemeContext.Provider value={value}>
         {children}
      </ThemeContext.Provider>
   );
};