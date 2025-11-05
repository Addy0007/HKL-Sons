import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../State/Auth/Action'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', id: 'tops' },
            { name: 'Dresses', id: 'dresses' },
            { name: 'Pants', id: 'pants' },
            { name: 'Denim', id: 'denim' },
            { name: 'Sweaters', id: 'sweaters' },
            { name: 'T-Shirts', id: 't-shirts' },
            { name: 'Jackets', id: 'jackets' },
            { name: 'Activewear', id: 'activewear' },
            { name: 'Browse All', id: 'browse-all' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', id: 'watches' },
            { name: 'Wallets', id: 'wallets' },
            { name: 'Bags', id: 'bags' },
            { name: 'Sunglasses', id: 'sunglasses' },
            { name: 'Hats', id: 'hats' },
            { name: 'Belts', id: 'belts' },
          ],
        },
        {
          id: 'brands',
          name: 'Brands',
          items: [
            { name: 'Full Nelson', id: 'full-nelson' },
            { name: 'My Way', id: 'my-way' },
            { name: 'Re-Arranged', id: 're-arranged' },
            { name: 'Counterfeit', id: 'counterfeit' },
            { name: 'Significant Other', id: 'significant-other' },
          ],
        },
      ],
    },
    {
      id: 'men',
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          imageAlt: 'Drawstring top with elastic loop closure and textured interior padding.',
        },
        {
          name: 'Artwork Tees',
          href: '#',
          imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg',
          imageAlt: 'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', id: 'tops' },
            { name: 'Pants', id: 'pants' },
            { name: 'Sweaters', id: 'sweaters' },
            { name: 'T-Shirts', id: 't-shirts' },
            { name: 'Jackets', id: 'jackets' },
            { name: 'Activewear', id: 'activewear' },
            { name: 'Browse All', id: 'browse-all' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', id: 'watches' },
            { name: 'Wallets', id: 'wallets' },
            { name: 'Bags', id: 'bags' },
            { name: 'Sunglasses', id: 'sunglasses' },
            { name: 'Hats', id: 'hats' },
          ],
        },
        {
          id: 'brands',
          name: 'Brands',
          items: [
            { name: 'Re-Arranged', id: 're-arranged' },
            { name: 'Counterfeit', id: 'counterfeit' },
            { name: 'Full Nelson', id: 'full-nelson' },
            { name: 'My Way', id: 'my-way' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Get user from Redux store
  const { user, jwt } = useSelector((state) => state.auth)

  // Function to handle navigation to product listing page
  const handleCategoryClick = (categoryId, sectionId, itemId) => {
    const url = `/${categoryId}/${sectionId}/${itemId}`
    navigate(url)
    setOpen(false)
  }

  const handleSignOut = () => {
    dispatch(logout())
    navigate('/')
  }

  const getInitial = (user) => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) {
      return user.firstName
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  return (
    <div style={{ backgroundColor: '#FFFEC2' }}>
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      style={{ borderBottomColor: 'transparent' }}
                      className="flex-1 border-b-2 px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:text-gray-900"
                    >
                      <span
                        className="data-[selected]:border-b-2"
                        style={{
                          borderColor: category.name === 'Women' || category.name === 'Men' ? '#3D8D7A' : 'transparent',
                        }}
                      >
                        {category.name}
                      </span>
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg object-cover group-hover:opacity-75"
                            style={{ backgroundColor: '#A3D1C6' }}
                          />
                          <a href={item.href} className="mt-6 block font-medium text-gray-900">
                            <span aria-hidden="true" className="absolute inset-0 z-10" />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1" style={{ color: '#3D8D7A' }}>
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <button
                                onClick={() => handleCategoryClick(category.id, section.id, item.id)}
                                className="-m-2 block p-2 text-gray-600 transition-colors w-full text-left"
                                onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                                onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                              >
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a 
                    href={page.href} 
                    className="-m-2 block p-2 font-medium text-gray-900 transition-colors"
                    onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                    onMouseLeave={(e) => e.target.style.color = '#111827'}
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {jwt || user ? (
                <>
                  <div className="flow-root px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="flow-root">
                    <button 
                      onClick={() => {
                        navigate('/profile')
                        setOpen(false)
                      }}
                      className="-m-2 block p-2 font-medium text-gray-900 transition-colors w-full text-left"
                      onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                      onMouseLeave={(e) => e.target.style.color = '#111827'}
                    >
                      Profile
                    </button>
                  </div>
                  <div className="flow-root">
                    <button 
                      onClick={() => {
                        navigate('/account/order')
                        setOpen(false)
                      }}
                      className="-m-2 block p-2 font-medium text-gray-900 transition-colors w-full text-left"
                      onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                      onMouseLeave={(e) => e.target.style.color = '#111827'}
                    >
                      My Orders
                    </button>
                  </div>
                  <div className="flow-root">
                    <button 
                      onClick={handleSignOut}
                      className="-m-2 block p-2 font-medium text-red-600 transition-colors w-full text-left hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flow-root">
                    <button 
                      onClick={() => {
                        navigate('/login')
                        setOpen(false)
                      }}
                      className="-m-2 block p-2 font-medium text-gray-900 transition-colors w-full text-left"
                      onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                      onMouseLeave={(e) => e.target.style.color = '#111827'}
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="flow-root">
                    <button 
                      onClick={() => {
                        navigate('/signup')
                        setOpen(false)
                      }}
                      className="-m-2 block p-2 font-medium text-gray-900 transition-colors w-full text-left"
                      onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                      onMouseLeave={(e) => e.target.style.color = '#111827'}
                    >
                      Create account
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <p 
          className="flex h-10 items-center justify-center px-4 text-sm font-medium text-white sm:px-6 lg:px-8"
          style={{ backgroundColor: '#3D8D7A' }}
        >
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = '#3D8D7A'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <button onClick={() => navigate('/')}>
                  <span className="sr-only">HKL Sons</span>
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=700"
                    className="h-8 w-auto"
                  />
                </button>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton 
                          className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out data-open:text-gray-900"
                          onMouseEnter={(e) => e.currentTarget.style.color = '#3D8D7A'}
                          onMouseLeave={(e) => {
                            if (!e.currentTarget.matches('[data-open]')) {
                              e.currentTarget.style.color = '#374151';
                            }
                          }}
                        >
                          {category.name}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out"
                            style={{ backgroundColor: 'transparent' }}
                          />
                        </PopoverButton>
                      </div>
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        style={{ backgroundColor: '#FFFEC2' }}
                      >
                        <div aria-hidden="true" className="absolute inset-0 top-1/2 shadow-sm" style={{ backgroundColor: '#FFFEC2' }} />
                        <div className="relative" style={{ backgroundColor: '#FFFEC2' }}>
                          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div key={item.name} className="group relative text-base sm:text-sm">
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg object-cover group-hover:opacity-75"
                                      style={{ backgroundColor: '#A3D1C6' }}
                                    />
                                    <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1" style={{ color: '#3D8D7A' }}>
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <button
                                            onClick={() => handleCategoryClick(category.id, section.id, item.id)}
                                            className="text-gray-600 transition-colors"
                                            onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                                            onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                                          >
                                            {item.name}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}
                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 transition-colors"
                      onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                      onMouseLeave={(e) => e.target.style.color = '#374151'}
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {jwt || user ? (
                    <Menu as="div" className="relative">
                      <MenuButton className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md transition-transform hover:scale-105"
                          style={{ backgroundColor: '#3D8D7A' }}
                        >
                          {getInitial(user)}
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden xl:block">
                          {getUserName()}
                        </span>
                      </MenuButton>
                      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none divide-y divide-gray-100">
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <MenuItem>
                            {({ focus }) => (
                              <button
                                onClick={() => navigate('/profile')}
                                className={`${
                                  focus ? 'bg-gray-50' : ''
                                } block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors`}
                              >
                                My Profile
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ focus }) => (
                              <button
                                onClick={() => navigate('/account/order')}
                                className={`${
                                  focus ? 'bg-gray-50' : ''
                                } block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors`}
                              >
                                My Orders
                              </button>
                            )}
                          </MenuItem>
                        </div>
                        <div className="py-1">
                          <MenuItem>
                            {({ focus }) => (
                              <button
                                onClick={handleSignOut}
                                className={`${
                                  focus ? 'bg-red-50' : ''
                                } block w-full px-4 py-2 text-left text-sm text-red-600 font-medium transition-colors`}
                              >
                                Sign Out
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  ) : (
                    <>
                      <button 
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium text-gray-700 transition-colors"
                        onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                        onMouseLeave={(e) => e.target.style.color = '#374151'}
                      >
                        Sign in
                      </button>
                      <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                      <button 
                        onClick={() => navigate('/signup')}
                        className="text-sm font-medium text-gray-700 transition-colors"
                        onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                        onMouseLeave={(e) => e.target.style.color = '#374151'}
                      >
                        Create account
                      </button>
                    </>
                  )}
                </div>

                <div className="hidden lg:ml-8 lg:flex">
                  <a 
                    href="#" 
                    className="flex items-center text-gray-700 transition-colors"
                    onMouseEnter={(e) => e.target.style.color = '#3D8D7A'}
                    onMouseLeave={(e) => e.target.style.color = '#374151'}
                  >
                    <img
                      alt=""
                      src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                      className="block h-auto w-5 shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <a 
                    href="#" 
                    className="p-2 text-gray-400 transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3D8D7A'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button onClick={() => navigate('/cart')} className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}