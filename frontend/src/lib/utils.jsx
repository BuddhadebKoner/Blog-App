// blog details show link properly

export function convertUrlsToLinks(text, className) {
  if (!text) return '';

  // URL regex pattern - more specific to avoid double matching
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Check if the text already contains link duplications
  const duplicatedLinkCheck = text.match(/(https?:\/\/[^\s]+)\1+/g);

  // If duplicated links are found, clean them first
  let cleanedText = text;
  if (duplicatedLinkCheck) {
    // For each duplicated URL pattern found
    duplicatedLinkCheck.forEach(duplicate => {
      // Extract the original URL (the first occurrence)
      const originalUrl = duplicate.match(/(https?:\/\/[^\s]+)/)[0];
      // Replace all instances of the duplicate with just the original URL
      cleanedText = cleanedText.replace(duplicate, originalUrl);
    });
  }

  // If no URLs found in the cleaned text, return it
  if (!cleanedText.match(urlRegex)) {
    return cleanedText;
  }

  // Create an array to hold the result elements
  const resultElements = [];

  // Use a regular expression with capture groups to split the text
  // This keeps the URLs in the result
  const parts = cleanedText.split(urlRegex);

  // Process each part of the split text
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Skip empty parts
    if (!part) continue;

    // If the part matches a URL pattern, render it as a link
    if (part.match(urlRegex)) {
      resultElements.push(
        <a
          key={`link-${i}`}
          href={part}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    } else {
      // Otherwise, render it as text
      resultElements.push(part);
    }
  }

  return resultElements;
}