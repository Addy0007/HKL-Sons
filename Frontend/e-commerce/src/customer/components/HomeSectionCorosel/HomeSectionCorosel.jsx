import React from "react";
import { Button } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HomeSectionCart from "../HomeSectionCart/HomeSectionCart";

const HomeSectionCorosel = ({ data, sectionTitle = "Featured Products" }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [itemsPerSlide, setItemsPerSlide] = React.useState(5);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const containerRef = React.useRef(null);

  const products = data || [];

  // 🔹 Responsive items per slide
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Set starting index once we know itemsPerSlide
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

  // 🔹 Handle infinite loop jump
  React.useEffect(() => {
    if (!isTransitioning) return;

    const timeout = setTimeout(() => {
      if (activeIndex === 0) {
        setIsTransitioning(false);
        setActiveIndex(products.length);
      } else if (activeIndex === products.length + itemsPerSlide) {
        setIsTransitioning(false);
        setActiveIndex(itemsPerSlide);
      } else {
        setIsTransitioning(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeIndex, isTransitioning, itemsPerSlide, products.length]);

  // 🔹 No data -> show nothing
  if (!products || products.length === 0) return null;

  // 🔹 For small lists, just show row (no infinite scroll)
  if (products.length <= itemsPerSlide) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-5">
          {sectionTitle}
        </h2>
        <div className="flex gap-4 flex-wrap">
          {products.map((product) => (
            <HomeSectionCart key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // 🔹 Extended products for infinite-like carousel
  const extendedProducts = [
    ...products.slice(-itemsPerSlide),
    ...products,
    ...products.slice(0, itemsPerSlide),
  ];

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-5">
        {sectionTitle}
      </h2>

      <div className="relative border border-gray-100 rounded-2xl p-5 bg-gradient-to-b from-gray-50 to-white shadow-md overflow-hidden">
        {/* Slides container */}
        <div
          ref={containerRef}
          className="flex"
          style={{
            transform: `translateX(-${activeIndex * (100 / itemsPerSlide)}%)`,
            transition: isTransitioning ? "transform 500ms ease-out" : "none",
          }}
        >
          {extendedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              style={{
                minWidth: `${100 / itemsPerSlide}%`,
                padding: "0 10px",
              }}
            >
              <HomeSectionCart product={product} />
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
        <Button
          variant="contained"
          onClick={slidePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: "-20px",
            transform: "translateY(-50%)",
            bgcolor: "white",
            width: 48,
            height: 48,
            minWidth: 48,
            borderRadius: "50%",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": {
              bgcolor: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
            "@media (max-width: 640px)": {
              left: "5px",
              width: 40,
              height: 40,
              minWidth: 40,
            },
          }}
        >
          <KeyboardArrowLeftIcon sx={{ color: "#374151", fontSize: "28px" }} />
        </Button>

        {/* RIGHT BUTTON */}
        <Button
          variant="contained"
          onClick={slideNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: "-20px",
            transform: "translateY(-50%)",
            bgcolor: "white",
            width: 48,
            height: 48,
            minWidth: 48,
            borderRadius: "50%",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": {
              bgcolor: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
            "@media (max-width: 640px)": {
              right: "5px",
              width: 40,
              height: 40,
              minWidth: 40,
            },
          }}
        >
          <KeyboardArrowRightIcon sx={{ color: "#374151", fontSize: "28px" }} />
        </Button>
      </div>
    </div>
  );
};

export default HomeSectionCorosel;
