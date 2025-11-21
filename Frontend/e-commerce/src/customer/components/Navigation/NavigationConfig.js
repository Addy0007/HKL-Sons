// src/components/Navigation/navigationConfig.js

export const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Sarees', id: 'sarees' },
            { name: 'Sweaters', id: 'sweaters' },
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
            { name: 'Kurtas', id: 'kurtas' },
            { name: 'Shirts', id: 'shirts' },
            { name: 'Jeans', id: 'jeans' },
          ],
        },
        {
          id: 'footwear',
          name: 'Footwear',
          items: [
            { name: 'Shoes', id: 'shoes' },
          ],
        },
      ],
    },

    // ⭐ NEW CATEGORY – Lifestyle
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
          ],
        },
      ],
    },
  ],

  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
};
