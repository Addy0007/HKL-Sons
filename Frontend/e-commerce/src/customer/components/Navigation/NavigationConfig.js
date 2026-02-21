// src/components/Navigation/NavigationConfig.js
// ⚠️  This file is used ONLY by CreateProductForm for admin dropdowns.
// The actual navbar reads from /api/categories/tree (backend DB).
// Keep this in sync with your DB categories manually.

export const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [],
      sections: [
        {
          id: 'coming-soon',
          name: 'Coming Soon',
          items: [
            { name: 'Coming Soon', id: 'coming-soon' },
          ],
        },
      ],
    },

    {
      id: 'men',
      name: 'Men',
      featured: [],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Jacket', id: 'jacket' },
            { name: 'Hoodie', id: 'hoodie' },
            { name: 'Jeans', id: 'jeans' },
            { name: 'Joggers', id: 'joggers' },
          ],
        },
      ],
    },

    {
      id: 'lifestyle',
      name: 'Lifestyle',
      featured: [],
      sections: [
        {
          id: 'decor',
          name: 'Decor',
          items: [
            { name: 'Artifacts', id: 'artifacts' },
            { name: 'Candles', id: 'candles' },
            { name: 'Bags', id: 'bags' },
            { name: 'Home Decor', id: 'home-decor' },
            { name: 'Wall Decor', id: 'wall-decor' },
          ],
        },
      ],
    },

    {
      id: 'hemp',
      name: 'Hemp',
      featured: [],
      sections: [
        {
          id: 'bags',
          name: 'Bags',
          items: [
            { name: 'Hand Bags', id: 'hand-bags' },
            { name: 'Pouches', id: 'pouches' },
            { name: 'Sling', id: 'sling' },
            { name: 'Backpack', id: 'backpack' },
            { name: 'Laptop Bag', id: 'laptop-bag' },
          ],
        },
      ],
    },
  ],
};