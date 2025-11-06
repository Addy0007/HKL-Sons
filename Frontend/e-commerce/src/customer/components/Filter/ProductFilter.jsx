import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const filters = {
  color: [
    { name: "White", value: "white" },
    { name: "Black", value: "black" },
    { name: "Blue", value: "blue" },
    { name: "Red", value: "red" },
    { name: "Pink", value: "pink" },
    { name: "Green", value: "green" },
    { name: "Yellow", value: "yellow" },
  ],
  price: [
    { name: "₹0 - ₹999", value: "0-999" },
    { name: "₹1000 - ₹2499", value: "1000-2499" },
    { name: "₹2500 - ₹4999", value: "2500-4999" },
    { name: "₹5000+", value: "5000-99999" },
  ],
  discount: [
    { name: "10% and above", value: "10" },
    { name: "20% and above", value: "20" },
    { name: "30% and above", value: "30" },
    { name: "40% and above", value: "40" },
    { name: "50% and above", value: "50" },
  ],
};

// ✅ Dynamic sizes based on category
const dynamicSizes = {
  kurtas: ["S", "M", "L", "XL", "XXL"],
  shirts: ["S", "M", "L", "XL", "XXL"],
  sweaters: ["S", "M", "L", "XL", "XXL"],
  jeans: ["28", "30", "32", "34", "36"],
  shoes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
};

export default function ProductFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const category = params.levelThree?.toLowerCase();

  const availableSizes = dynamicSizes[category] || [];

  const [expandedSections, setExpandedSections] = useState({
    color: true,
    size: true,
    price: true,
    discount: true,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    size: [],
    price: "",
    discount: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSelectedFilters({
      color: searchParams.get("color")?.split(",").filter(Boolean) || [],
      size: searchParams.get("size")?.split(",").filter(Boolean) || [],
      price: searchParams.get("price") || "",
      discount: searchParams.get("discount") || "",
    });
  }, [location.search]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (filterType, value, isMultiSelect = true) => {
    let updatedFilters = { ...selectedFilters };

    if (isMultiSelect) {
      const current = updatedFilters[filterType] || [];
      updatedFilters[filterType] = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
    } else {
      updatedFilters[filterType] = updatedFilters[filterType] === value ? "" : value;
    }

    setSelectedFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const updateURL = (filters) => {
    const params = new URLSearchParams(location.search);

    filters.color.length > 0 ? params.set("color", filters.color.join(",")) : params.delete("color");
    filters.size.length > 0 ? params.set("size", filters.size.join(",")) : params.delete("size");
    filters.price ? params.set("price", filters.price) : params.delete("price");
    filters.discount ? params.set("discount", filters.discount) : params.delete("discount");

    params.set("page", "1");
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedFilters({ color: [], size: [], price: "", discount: "" });
    navigate(location.pathname);
  };

  const hasActiveFilters =
    selectedFilters.color.length > 0 ||
    selectedFilters.size.length > 0 ||
    selectedFilters.price ||
    selectedFilters.discount;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Clear All
          </button>
        )}
      </div>

      {/* COLOR FILTER */}
      <FilterSection
        title="Color"
        expanded={expandedSections.color}
        toggle={() => toggleSection("color")}
        options={filters.color}
        selected={selectedFilters.color}
        onChange={(value) => handleFilterChange("color", value)}
      />

      {/* SIZE FILTER - AUTO HIDES IF NO SIZES FOR THIS CATEGORY */}
      {availableSizes.length > 0 && (
        <FilterSection
          title="Size"
          expanded={expandedSections.size}
          toggle={() => toggleSection("size")}
          options={availableSizes.map((s) => ({ name: s, value: s }))}
          selected={selectedFilters.size}
          onChange={(value) => handleFilterChange("size", value)}
        />
      )}

      {/* PRICE FILTER */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        toggle={() => toggleSection("price")}
        options={filters.price}
        selected={[selectedFilters.price]}
        onChange={(value) => handleFilterChange("price", value, false)}
      />

      {/* DISCOUNT FILTER */}
      <FilterSection
        title="Discount"
        expanded={expandedSections.discount}
        toggle={() => toggleSection("discount")}
        options={filters.discount}
        selected={[selectedFilters.discount]}
        onChange={(value) => handleFilterChange("discount", value, false)}
      />
    </div>
  );
}

function FilterSection({ title, expanded, toggle, options, selected, onChange }) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button onClick={toggle} className="flex items-center justify-between w-full text-left">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => onChange(opt.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{opt.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
