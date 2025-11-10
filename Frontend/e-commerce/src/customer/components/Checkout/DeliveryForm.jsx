import React, { useState } from "react";

const SearchableSelect = ({ value, onChange, options, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={isOpen ? searchTerm : value}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className="border rounded-md p-3 w-full disabled:bg-gray-100"
      />
      
      {isOpen && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No results found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const SearchablePincodeSelect = ({ value, onChange, options, placeholder, onManualInput }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
    option.includes(searchTerm)
  );

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(true);
    
    if (onManualInput) {
      onManualInput(val);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={isOpen ? searchTerm : value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        maxLength={6}
        className="border rounded-md p-3 w-full"
      />
      
      {isOpen && options.length > 0 && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No matching pincodes</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const DeliveryForm = ({
  address,
  handleFieldChange, // ✅ Auto-saves to Redux/localStorage
  states,
  districts,
  pincodes,
  pincodeStatus,
  onStateChange,
  onDistrictChange,
  handlePincodeInput,
  onContinue
}) => {
  
  const isFormValid = () => {
    return (
      address.firstName &&
      address.lastName &&
      address.streetAddress &&
      address.state &&
      address.district &&
      address.zipCode &&
      address.city &&
      address.mobile &&
      pincodeStatus === 'deliverable'
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-emerald-800">Delivery Address</h2>

      {/* First Name */}
      <input
        type="text"
        value={address.firstName}
        onChange={(e) => handleFieldChange('firstName', e.target.value)}
        placeholder="First Name"
        className="border rounded-md p-3 w-full"
        required
      />

      {/* Last Name */}
      <input
        type="text"
        value={address.lastName}
        onChange={(e) => handleFieldChange('lastName', e.target.value)}
        placeholder="Last Name"
        className="border rounded-md p-3 w-full"
        required
      />

      {/* Street Address */}
      <textarea
        value={address.streetAddress}
        onChange={(e) => handleFieldChange('streetAddress', e.target.value)}
        placeholder="House / Flat / Street Address (e.g., 303, Parkwood Apartments, Near City Mall)"
        className="border rounded-md p-3 w-full min-h-[80px]"
        required
      />

      {/* State - Searchable */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
        <SearchableSelect
          value={address.state}
          onChange={onStateChange}
          options={states}
          placeholder="Type to search state..."
          disabled={false}
        />
      </div>

      {/* District - Searchable */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
        <SearchableSelect
          value={address.district}
          onChange={onDistrictChange}
          options={districts}
          placeholder={address.state ? "Type to search district..." : "Select State First"}
          disabled={!address.state}
        />
      </div>

      {/* Pincode - Single Unified Searchable Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
        <SearchablePincodeSelect
          value={address.zipCode}
          onChange={handlePincodeInput}
          options={pincodes}
          placeholder="Type or search PIN code..."
          onManualInput={handlePincodeInput}
        />
        
        {/* Status Messages */}
        {pincodeStatus === 'not-deliverable' && address.zipCode.length === 6 && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <span className="mr-1">🚫</span> 
            Sorry, we cannot deliver to this PIN code
          </p>
        )}
        
        {pincodeStatus === 'not-found' && address.zipCode.length === 6 && (
          <p className="text-red-600 text-sm mt-1 flex items-center">
            <span className="mr-1">🚫</span> 
            Sorry, we cannot deliver to this PIN code
          </p>
        )}
        
        {pincodeStatus === 'deliverable' && (
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <span className="mr-1">✅</span> 
            Delivery available
          </p>
        )}
      </div>

      {/* City */}
      <input
        type="text"
        value={address.city}
        onChange={(e) => handleFieldChange('city', e.target.value)}
        placeholder="City"
        className="border rounded-md p-3 w-full"
        required
      />

      {/* Mobile */}
      <input
        type="tel"
        value={address.mobile}
        onChange={(e) => handleFieldChange('mobile', e.target.value)}
        placeholder="Phone Number"
        maxLength={10}
        className="border rounded-md p-3 w-full"
        required
      />

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          disabled={!isFormValid()}
          onClick={onContinue}
          className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DeliveryForm;