import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from './MainCoroselData';

const MainCorosel = () => {
    const handleDragStart = (e) => e.preventDefault();

    return(
        <AliceCarousel
            mouseTracking
            autoPlay
            autoPlayInterval={3000}
            infinite
            disableButtonsControls={false}
            renderPrevButton={() => {
                return (
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-4 rounded-full shadow-lg z-10 text-3xl font-bold transition-all">
                        ‹
                    </button>
                )
            }}
            renderNextButton={() => {
                return (
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-4 rounded-full shadow-lg z-10 text-3xl font-bold transition-all">
                        ›
                    </button>
                )
            }}
        >
            {mainCarouselData.map((item, index) => (
                <img 
                    key={index}
                    src={item.image} 
                    alt=""
                    className='w-full h-[500px] object-cover'
                    onDragStart={handleDragStart}
                    style={{ display: 'block' }}
                />
            ))}
        </AliceCarousel>
    );
}

export default MainCorosel;