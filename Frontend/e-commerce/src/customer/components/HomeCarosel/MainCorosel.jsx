import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { mainCarouselData } from "./MainCoroselData";
import { useNavigate } from "react-router-dom";

const MainCorosel = () => {
  const navigate = useNavigate();

  const items = mainCarouselData.map((item, index) => (
    <div
      key={index}
      className="relative w-full cursor-pointer"
      onClick={() => navigate(item.path)}
    >
      <img
        src={item.image}
        alt="banner"
        draggable="false"
        className="
          w-full 
          h-[55vh] 
          md:h-[70vh] 
          lg:h-[78vh] 
          object-cover 
          rounded-xl
        "
      />

      {/* BOTTOM GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl"></div>
    </div>
  ));

  return (
    <div className="relative px-3 md:px-6 py-4">
      <AliceCarousel
        mouseTracking
        autoPlay
        autoPlayInterval={3500}
        infinite
        animationDuration={800}
        keyboardNavigation
        items={items}
        disableDotsControls={false}
        disableButtonsControls={false}
        responsive={{
          0: { items: 1 },
          768: { items: 1 },
          1024: { items: 1 },
        }}
        renderPrevButton={() => (
          <button
            className="
              absolute left-4 top-1/2 -translate-y-1/2 
              bg-white/70 hover:bg-white shadow-md 
              w-10 h-10 md:w-14 md:h-14 
              rounded-full flex items-center justify-center 
              text-2xl md:text-4xl font-bold 
              transition-all z-10
            "
          >
            ‹
          </button>
        )}
        renderNextButton={() => (
          <button
            className="
              absolute right-4 top-1/2 -translate-y-1/2 
              bg-white/70 hover:bg-white shadow-md 
              w-10 h-10 md:w-14 md:h-14 
              rounded-full flex items-center justify-center 
              text-2xl md:text-4xl font-bold 
              transition-all z-10
            "
          >
            ›
          </button>
        )}
      />
    </div>
  );
};

export default MainCorosel;
