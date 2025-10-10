'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  menKurtas,
  menShoes,
  menShirts,
  menJeans,
  womenSarees,
  womenSweaters,
} from '../Data/Corouselproducts';
import ProductCard from './ProductCard';

export default function Product() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const getArrayParam = (key) =>
    params.get(key) ? params.get(key).split(',') : [];

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState(params.get('sort') || 'default');
  const [filters, setFilters] = useState({
    availability: params.get('availability') || '',
    discount: params.get('discount') || '',
    color: getArrayParam('color'),
    size: params.get('size') || '',
    priceRange: params.get('priceRange') || '',
  });
  const [currentPage, setCurrentPage] = useState(
    Number(params.get('page')) || 1
  );
  const productsPerPage = 8;

  // All Products
  const allProducts = useMemo(() => {
    return [
      ...menKurtas,
      ...menShoes,
      ...menShirts,
      ...menJeans,
      ...womenSarees,
      ...womenSweaters,
    ].map((p) => ({
      ...p,
      inStock: Math.random() > 0.2,
      color: ['white', 'blue', 'black', 'green', 'red'][
        Math.floor(Math.random() * 5)
      ],
    }));
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (filters.availability) newParams.set('availability', filters.availability);
    if (filters.discount) newParams.set('discount', filters.discount);
    if (filters.color.length > 0) newParams.set('color', filters.color.join(','));
    if (filters.size) newParams.set('size', filters.size);
    if (filters.priceRange) newParams.set('priceRange', filters.priceRange);
    if (sortOrder !== 'default') newParams.set('sort', sortOrder);
    if (currentPage > 1) newParams.set('page', currentPage);

    navigate({ search: newParams.toString() }, { replace: true });
  }, [filters, sortOrder, currentPage, navigate]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...allProducts];
    if (sortOrder === 'lowToHigh') list.sort((a, b) => a.discountedPrice - b.discountedPrice);
    if (sortOrder === 'highToLow') list.sort((a, b) => b.discountedPrice - a.discountedPrice);
    return list;
  }, [allProducts, sortOrder]);

  // Filtering
  const filteredProducts = sortedProducts.filter((item) => {
    let pass = true;

    if (filters.availability === 'inStock') pass = item.inStock;
    if (filters.availability === 'outOfStock') pass = !item.inStock;

    if (filters.discount) {
      const d = item.discountPercent;
      const [min, max] = filters.discount.split('-').map(Number);
      pass = pass && d >= min && d <= max;
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      pass = pass && item.discountedPrice >= min && item.discountedPrice <= max;
    }

    if (filters.color.length > 0) {
      pass = pass && filters.color.includes(item.color);
    }

    return pass;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Color Multi-select
  const toggleColor = (value) => {
    setFilters((prev) => {
      const newColors = prev.color.includes(value)
        ? prev.color.filter((c) => c !== value)
        : [...prev.color, value];
      return { ...prev, color: newColors };
    });
  };

  const filterSections = [
    {
      id: 'availability',
      name: 'Availability',
      options: [
        { label: 'In Stock', value: 'inStock' },
        { label: 'Out of Stock', value: 'outOfStock' },
      ],
    },
    {
      id: 'discount',
      name: 'Discount Range',
      options: [
        { label: '0-20% Off', value: '0-20' },
        { label: '20-40% Off', value: '20-40' },
        { label: '40-60% Off', value: '40-60' },
        { label: '60-80% Off', value: '60-80' },
        { label: '80-99% Off', value: '80-99' },
      ],
    },
    {
      id: 'color',
      name: 'Color',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Blue', value: 'blue' },
        { label: 'Black', value: 'black' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
      ],
    },
    {
      id: 'priceRange',
      name: 'Price Range',
      options: [
        { label: '₹0 - ₹1000', value: '0-1000' },
        { label: '₹1000 - ₹2500', value: '1000-2500' },
        { label: '₹2500 - ₹5000', value: '2500-5000' },
        { label: '₹5000 - ₹10000', value: '5000-10000' },
      ],
    },
  ];

  const FilterPanel = () => (
    <>
      {filterSections.map((section) => (
        <Disclosure
          key={section.id}
          as="div"
          className="border-b border-gray-200 py-6"
        >
          <DisclosureButton className="group flex w-full items-center justify-between bg-white py-2 pl-1 text-base text-gray-700 hover:text-gray-900 transition-colors">
            <span className="font-bold text-gray-900">{section.name}</span>
            <span className="ml-2 flex items-center">
              <PlusIcon className="h-5 w-5 text-gray-400 group-data-[open]:hidden" />
              <MinusIcon className="h-5 w-5 text-gray-400 hidden group-data-[open]:block" />
            </span>
          </DisclosureButton>
          <DisclosurePanel className="pt-4 space-y-2">
            {section.id === 'color'
              ? section.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={filters.color.includes(option.value)}
                      onChange={() => toggleColor(option.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    {option.label}
                  </label>
                ))
              : section.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <input
                      type="radio"
                      name={section.id}
                      value={option.value}
                      checked={filters[section.id] === option.value}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [section.id]: e.target.value,
                        }))
                      }
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    {option.label}
                  </label>
                ))}
          </DisclosurePanel>
        </Disclosure>
      ))}
    </>
  );

  return (
    <div className="bg-white w-full min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 pt-24 pb-8 px-4 sm:px-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          Products
        </h1>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <FunnelIcon className="w-4 h-4" />
            <span className="text-sm">Filters</span>
          </button>

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-1 text-gray-700 hover:text-gray-900 border px-3 py-2 rounded-md shadow-sm text-sm">
              Sort by
              <ChevronDownIcon className="w-4 h-4" />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 z-10">
              {['lowToHigh', 'highToLow', 'default'].map((sort) => (
                <MenuItem key={sort}>
                  {({ active }) => (
                    <button
                      onClick={() => setSortOrder(sort)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        active ? 'bg-gray-100' : ''
                      }`}
                    >
                      {sort === 'lowToHigh'
                        ? 'Price: Low to High'
                        : sort === 'highToLow'
                        ? 'Price: High to Low'
                        : 'Default'}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>

      {/* Filters + Products */}
      <section className="pt-10 pb-24 px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-4">
          <div className="hidden lg:block pr-6">
            <FilterPanel />
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((item, index) => (
                  <ProductCard
                    key={index}
                    imageUrl={item.imageUrl}
                    brand={item.brand}
                    title={item.title}
                    price={item.price}
                    discountedPrice={item.discountedPrice}
                    discountPercent={item.discountPercent}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-lg w-full text-center py-12 col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4">
                  No products found.
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-4 flex-wrap">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-40 text-sm"
                >
                  ← Prev
                </button>
                <span className="text-gray-700 font-semibold text-sm self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-40 text-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
