import React from 'react';
import { Button } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const HomeSectionCart = ({ product }) => {
  return (
    <div className='cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[15rem] mx-3'>
      <div className='h-[13rem] w-[10rem]'>
        <img 
          className='object-cover object-top w-full h-full'
          src={product.imageUrl} 
          alt={product.title}
        />
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-medium text-gray-900'>{product.brand}</h3>
        <p className='mt-2 text-sm text-gray-500'>{product.title}</p>
      </div>
    </div>
  );
};

const HomeSectionCorosel = ({ data, sectionTitle = "Featured Products" }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [itemsPerSlide, setItemsPerSlide] = React.useState(5);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const containerRef = React.useRef(null);

    // Use data from props instead of hardcoded products
    const products = data || [];

    // Create infinite loop by duplicating items
    const extendedProducts = [
        ...products.slice(-itemsPerSlide), // Last items at the beginning
        ...products,                        // Original items
        ...products.slice(0, itemsPerSlide) // First items at the end
    ];

    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 568) setItemsPerSlide(1);
            else if (width < 768) setItemsPerSlide(2);
            else if (width < 1024) setItemsPerSlide(3);
            else if (width < 1280) setItemsPerSlide(4);
            else setItemsPerSlide(5);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Start at the first "real" item (after the duplicated end items)
    React.useEffect(() => {
        setActiveIndex(itemsPerSlide);
    }, [itemsPerSlide]);

    const slidePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => prev - 1);
    };

    const slideNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => prev + 1);
    };

    // Handle infinite loop reset
    React.useEffect(() => {
        if (!isTransitioning) return;

        const timeout = setTimeout(() => {
            // If we're at the start clone, jump to the real end (no animation)
            if (activeIndex === 0) {
                setIsTransitioning(false);
                setActiveIndex(products.length);
            }
            // If we're at the end clone, jump to the real start (no animation)
            else if (activeIndex === products.length + itemsPerSlide) {
                setIsTransitioning(false);
                setActiveIndex(itemsPerSlide);
            }
            else {
                setIsTransitioning(false);
            }
        }, 500); // Match this with transition duration

        return () => clearTimeout(timeout);
    }, [activeIndex, isTransitioning, itemsPerSlide, products.length]);

    // Don't render if no products
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="relative px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-5">
                {sectionTitle}
            </h2>
            
            <div className="relative border border-gray-200 rounded-lg p-5 bg-white shadow-sm overflow-hidden">
                <div 
                    ref={containerRef}
                    className="flex"
                    style={{ 
                        transform: `translateX(-${activeIndex * (100 / itemsPerSlide)}%)`,
                        transition: isTransitioning ? 'transform 500ms ease-out' : 'none'
                    }}
                >
                    {extendedProducts.map((product, index) => (
                        <div 
                            key={`${product.brand}-${index}`}
                            style={{ 
                                minWidth: `${100 / itemsPerSlide}%`,
                                padding: '0 10px'
                            }}
                        >
                            <HomeSectionCart product={product} />
                        </div>
                    ))}
                </div>

                {/* Left Button */}
                <Button
                    variant="contained"
                    className="z-50"
                    onClick={slidePrev}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '-20px',
                        transform: 'translateY(-50%)',
                        bgcolor: 'white',
                        minWidth: '48px',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                            bgcolor: 'white',
                            transform: 'translateY(-50%) scale(1.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        },
                        '&:active': {
                            transform: 'translateY(-50%) scale(0.95)',
                        },
                        '@media (max-width: 640px)': {
                            left: '5px',
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                        }
                    }}
                    aria-label="previous"
                >
                    <KeyboardArrowLeftIcon sx={{ 
                        color: '#374151',
                        fontSize: '28px',
                    }} />
                </Button>

                {/* Right Button */}
                <Button
                    variant="contained"
                    className="z-50"
                    onClick={slideNext}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '-20px',
                        transform: 'translateY(-50%)',
                        bgcolor: 'white',
                        minWidth: '48px',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                            bgcolor: 'white',
                            transform: 'translateY(-50%) scale(1.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        },
                        '&:active': {
                            transform: 'translateY(-50%) scale(0.95)',
                        },
                        '@media (max-width: 640px)': {
                            right: '5px',
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                        }
                    }}
                    aria-label="next"
                >
                    <KeyboardArrowRightIcon sx={{ 
                        color: '#374151',
                        fontSize: '28px',
                    }} />
                </Button>
            </div>
        </div>
    );
};

export default HomeSectionCorosel;