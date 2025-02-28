// ...existing code...

export const formatDateString = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// ...existing code...
