import { navigation } from "./NavigationConfig";

// Function to map search text to your category URL
export function findRouteFromSearch(query) {
  if (!query) return null;

  const q = query.toLowerCase();

  for (const category of navigation.categories) {
    for (const section of category.sections) {
      for (const item of section.items) {
        // Match user search with item name
        if (item.name.toLowerCase().includes(q)) {
          return `/${category.id}/${section.id}/${item.id}`;
        }
      }
    }
  }

  return null; // No match found
}
