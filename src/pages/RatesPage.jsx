import React, { useState, useEffect, useRef } from "react";
import {
  IndianRupee,
  Car,
  Users,
  MapPin,
  PlusCircle,
  Trash2,
  Settings,
  BusFront,
} from "lucide-react";
const API_URL = import.meta.env.REACT_APP_Backend_URL || "https://cabadmin-backend-production.up.railway.app";

// --- API Configuration ---
// This is the correct relative path for the frontend to access the Express backend.
const BASE_URL = `${API_URL}/api/rates`;

// Initial data for all rates - Used as a fallback if the server returns no rates.
const initialRates = {
  perSeatRates: {
    "Sambhaji nagar to Pune (Home Drop)": 1200,
    "Sambhaji nagar to Pune (Shivaji nagar Drop)": 900,
  },
  perKmRates: {
    "Swift Dezire (4+1)": {
      "Sambhaji nagar-Pune-Sambhaji nagar": 12,
      "Sambhaji nagar-Mumbai-Sambhaji nagar": 15,
      "Local within Sambhaji nagar": 11,
    },
    "Ertiga (6+1)": {
      "Sambhaji nagar-Pune-Sambhaji nagar": 14,
      "Sambhaji nagar-Mumbai-Sambhaji nagar": 18,
      "Local within Sambhaji nagar": 13,
    },
    "Innova Crysta": {
      "Sambhaji nagar-Pune-Sambhaji nagar": 20,
      "Sambhaji nagar-Mumbai-Sambhaji nagar": 23,
      "Local within Sambhaji nagar": 17,
    },
  },
  busRates: {
    "17 Seater Bus": {
      "Sambhaji nagar": 20,
      "Pune": 22,
      "Mumbai": 25,
    },
    "40 Seater Bus": {
      "Sambhaji nagar": 45,
      "Pune": 50,
      "Mumbai": 55,
    },
    "50 Seater Bus": {
      "Sambhaji nagar": 52,
      "Pune": 60,
      "Mumbai": 70,
    },
  },
  fixedCabRates: {
    "Sambhajinagar - Pune One Way Sedan (4+1)": 3200,
    "Sambhajinagar - Pune One Way Ertiga (6+1)": 4000,
    "Sambhajinagar - Mumbai Airport One Way Sedan (4+1)": 6000,
    "Sambhajinagar - Mumbai Airport One Way Ertiga (6+1)": 7500,
  },
  customRoutes: [
    { route: "Sambhajinagar → Pune (One Way)", vehicle: "Dzire (4+1)", rate: 3000 },
    { route: "Sambhajinagar → Pune (One Way)", vehicle: "Ertiga (6+1)", rate: 3800 },
    { route: "Sambhajinagar → Mumbai", vehicle: "Sedan (4+1)", rate: 5500 },
    { route: "Sambhajinagar → Mumbai", vehicle: "Ertiga (24/7)", rate: 6000 },
    { route: "Sambhajinagar → Shivajinagar (Pickup/Drop)", vehicle: "Home Pickup", rate: 1200 },
  ],
  sharingRoutes: [],
};

// Function to merge saved rates with initial rates (to handle new default keys)
const mergeRates = (savedRates) => {
  const cleanRates = {
    perSeatRates: { ...initialRates.perSeatRates, ...savedRates.perSeatRates },
    perKmRates: {},
    busRates: { ...initialRates.busRates, ...savedRates.busRates },
    fixedCabRates: { ...initialRates.fixedCabRates, ...savedRates.fixedCabRates },
    customRoutes: savedRates.customRoutes || initialRates.customRoutes,
    sharingRoutes: savedRates.sharingRoutes || [],
  };

  // Explicitly handle nested objects like perKmRates
  for (const vehicle in initialRates.perKmRates) {
    cleanRates.perKmRates[vehicle] = {
      ...initialRates.perKmRates[vehicle],
      ...(savedRates.perKmRates && savedRates.perKmRates[vehicle]),
    };
  }
  
  // Applying the original UI logic to remove old entries (Aurangabad)
  if (cleanRates.busRates) {
    if (
      cleanRates.busRates["40 Seater Bus"] &&
      cleanRates.busRates["40 Seater Bus"]["Aurangabad"]
    ) {
      delete cleanRates.busRates["40 Seater Bus"]["Aurangabad"];
    }
    if (
      cleanRates.busRates["50 Seater Bus"] &&
      cleanRates.busRates["50 Seater Bus"]["Aurangabad"]
    ) {
      delete cleanRates.busRates["50 Seater Bus"]["Aurangabad"];
    }
  }

  return cleanRates;
};


// Main App Component
const RatesPage = () => {
  const [rates, setRates] = useState({
    ...initialRates,
    sharingRoutes: initialRates.sharingRoutes || [], 
  });
  
  // State for the Sharing Route Add Form
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    pickup: "",
    drop: "",
    seating: "",
    price: "",
  });

  const [saveStatus, setSaveStatus] = useState("Loading...");
  const saveTimeout = useRef(null);

  // --- API Functions ---

  // 1. Fetch initial rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Object.keys(data).length === 0) {
          setRates({
            ...initialRates,
            sharingRoutes: initialRates.sharingRoutes || [], 
          });
          setSaveStatus("Ready"); 
          return;
        }

        const merged = mergeRates(data);
        setRates(merged);
        setSaveStatus("Loaded");
      } catch (error) {
        console.error("Error fetching rates:", error);
        setRates({
          ...initialRates,
          sharingRoutes: initialRates.sharingRoutes || [],
        }); 
        setSaveStatus(`Load Failed: ${error.message.substring(0, 15)}...`);
      }
    };
    fetchRates();
  }, []); 

  // 2. Function to save rates to the backend
  const saveRatesToBackend = async (dataToSave) => {
    try {
      setSaveStatus("Saving...");
      const response = await fetch(`${BASE_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The backend expects the whole rates object in req.body.rates
        body: JSON.stringify({ rates: dataToSave }),
      });

      if (response.status === 404) {
          throw new Error("404: API endpoint not found.");
      }

      if (response.ok) {
        setSaveStatus("Saved!");
      } else {
        const errorText = await response.text();
        let errorMessage = "Failed to save rates";
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving rates:", error);
      setSaveStatus(`Save Failed! (${error.message.substring(0, 20)}...)`); 
      setTimeout(() => setSaveStatus("Ready"), 5000);
    }
  };

  // 3. Autosave effect (Debounced Save)
  useEffect(() => {
    // Only autosave if the status is not loading and rates are present
    if (saveStatus !== "Loading..." && rates && Object.keys(rates).length > 0) {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      
      saveTimeout.current = setTimeout(() => {
        setSaveStatus("Auto Saving...");
        saveRatesToBackend(rates);
      }, 500); 
    }
    return () => clearTimeout(saveTimeout.current);
  }, [rates]); 

  // --- Rate Update Handlers ---

  const updateNestedRate = (category, key1, key2, value) => {
    setRates(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key1]: {
          ...prev[category][key1],
          [key2]: value,
        },
      },
    }));
  };

  const updateSimpleRate = (category, key, value) => {
    setRates(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const updateCustomRoute = (index, key, value) => {
    setRates(prev => {
      const updated = [...prev.customRoutes];
      updated[index][key] = value;
      return { ...prev, customRoutes: updated };
    });
  };

  const deleteCustomRoute = (index) => {
    setRates(prev => {
      const updated = prev.customRoutes.filter((_, i) => i !== index);
      return { ...prev, customRoutes: updated };
    });
  };

  const addCustomRoute = () => {
    setRates(prev => ({
      ...prev,
      customRoutes: [...prev.customRoutes, { route: "New Route", vehicle: "Vehicle", rate: 0 }],
    }));
  };
  
  // Sharing Route Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRoute = () => {
    const { from, to, pickup, drop, seating, price } = formData;
    if (!from || !to || !pickup || !drop || !seating || !price) return;
    
    const newRoute = {
      displayRoute: `${from} → ${to}`,
      pickup,
      drop,
      seating,
      price: Number(price), 
    };
    
    setRates(prev => ({
        ...prev,
        sharingRoutes: [...prev.sharingRoutes, newRoute],
    }));

    setFormData({
      from: "",
      to: "",
      pickup: "",
      drop: "",
      seating: "",
      price: "",
    });
  };

  const handleDeleteRoute = (index) => {
    setRates(prev => ({
        ...prev,
        sharingRoutes: prev.sharingRoutes.filter((_, idx) => idx !== index),
    }));
  };
  
  // Helper function for the price stepper UI
  const renderStepper = (value, onChange, step = 1) => (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - step))}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold"
      >
        –
      </button>
      <input
        type="number"
        className="flex-1 text-center py-1 bg-white focus:outline-none w-16"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button
        type="button"
        onClick={() => onChange(value + step)}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold"
      >
        +
      </button>
    </div>
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50 font-sans min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Rates and Pricing</h2>
      </div>

      {/* Save Status Indicator */}
      <div className="flex justify-end">
        <div
          className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${            
            saveStatus === "Saved!" || saveStatus === "Loaded" ? "bg-green-600" :
            saveStatus.includes("Failed") ? "bg-red-600" :
            saveStatus.includes("Saving") ? "bg-blue-600" :
            "bg-gray-500" // Default for "Ready" or unknown state
          }`}
        >
          {saveStatus}
        </div>
      </div>
      
      {/* Per KM Rates (Cabs) */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Car className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Per KM Rates (Cabs)</h3>
            <p className="text-sm text-gray-600">Distance-based pricing for different cabs</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(rates.perKmRates || {}).map(([vehicle, cityRates]) => (
            <div key={vehicle} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 capitalize mb-3">{vehicle}</h4>
              <div className="space-y-3">
                {Object.entries(cityRates || {}).map(([city, rate]) => (
                  <div key={city}>
                    <label className="block text-xs text-gray-600">{city}</label>
                    <div className="flex items-center space-x-2">
                      <IndianRupee size={16} className="text-gray-500" />
                      {renderStepper(rate, (val) => updateNestedRate("perKmRates", vehicle, city, val), 1)}
                      <span className="text-sm text-gray-600">/km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per KM Rates (Buses) */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <BusFront className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Per KM Rates (Buses)</h3>
            <p className="text-sm text-gray-600">Distance-based pricing for buses</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(rates.busRates || {}).map(([busType, cityRates]) => (
            <div key={busType} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 capitalize mb-3">{busType}</h4>
              <div className="space-y-3">
                {Object.entries(cityRates || {}).map(([city, rate]) => (
                  <div key={city}>
                    <label className="block text-xs text-gray-600">{city}</label>
                    <div className="flex items-center space-x-2">
                      <IndianRupee size={16} className="text-gray-500" />
                      {renderStepper(rate, (val) => updateNestedRate("busRates", busType, city, val), 1)}
                      <span className="text-sm text-gray-600">/km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per Seat Rates */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Per Seat Rates (Sharing)</h3>
            <p className="text-sm text-gray-600">For shared rides from Sambhajinagar to Pune</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(rates.perSeatRates || {}).map(([vehicle, rate]) => (
            <div key={vehicle} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 capitalize">{vehicle}</h4>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Rate per Seat</label>
                <div className="flex items-center space-x-2">
                  <IndianRupee size={16} className="text-gray-500" />
                  {renderStepper(rate, (val) => updateSimpleRate("perSeatRates", vehicle, val), 50)}
                  <span className="text-sm text-gray-600">/seat</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Cab Rates */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Fixed Cab Rates</h3>
            <p className="text-sm text-gray-600">One Way (25% Advance) - fixed pricing</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(rates.fixedCabRates || {}).map(([route, rate]) => (
            <div key={route} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 capitalize mb-3">{route}</h4>
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Rate</label>
                <div className="flex items-center space-x-2">
                  <IndianRupee size={16} className="text-gray-500" />
                  {renderStepper(rate, (val) => updateSimpleRate("fixedCabRates", route, val), 100)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom Routes */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <MapPin className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Custom Routes</h3>
            <p className="text-sm text-gray-600">Special predefined routes and fixed rates</p>
          </div>
        </div>
        <div className="space-y-4">
          {(rates.customRoutes || []).map((route, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Route</label>
                  <input
                    type="text"
                    value={route.route}
                    onChange={(e) => updateCustomRoute(idx, "route", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Vehicle</label>
                  <input
                    type="text"
                    value={route.vehicle}
                    onChange={(e) => updateCustomRoute(idx, "vehicle", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Rate</label>
                    <div className="flex items-center space-x-2">
                      <IndianRupee size={16} className="text-gray-500" />
                      {renderStepper(route.rate, (val) => updateCustomRoute(idx, "rate", val))}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCustomRoute(idx)}
                    className="ml-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                      <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={addCustomRoute}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Route
          </button>
        </div>
      </div>

      {/* Sharing Cab Routes */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Sharing Cab Routes</h3>
            <p className="text-sm text-gray-600">Add and manage routes for shared cab services</p>
          </div>
        </div>
        {/* Add Route Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <input
            name="from"
            value={formData.from}
            onChange={handleChange}
            placeholder="From (e.g., Sambhajinagar)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
          />
          <input
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="To (e.g., Pune)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
          />
          <input
            name="pickup"
            value={formData.pickup}
            onChange={handleChange}
            placeholder="Pickup Location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
          />
          <input
            name="drop"
            value={formData.drop}
            onChange={handleChange}
            placeholder="Drop Location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
          />
          <input
            name="seating"
            value={formData.seating}
            onChange={handleChange}
            placeholder="Seating (e.g., 3+1)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
          />
          <div className="flex items-center space-x-2">
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              placeholder="Price (e.g., 900)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm"
            />
            <button
              onClick={handleAddRoute}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Add Route
            </button>
          </div>
        </div>
        {/* Routes List */}
        <div className="space-y-4">
          {(rates.sharingRoutes || []).length > 0 ? (
            (rates.sharingRoutes || []).map((r, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Route</label>
                    <div className="text-sm font-medium">{r.displayRoute}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Vehicle/Seating</label>
                    <div className="text-sm">{r.seating}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Price</label>
                      <div className="flex items-center space-x-2">
                        <IndianRupee size={16} className="text-gray-500" />
                        <span className="text-sm">{r.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRoute(idx)}
                      className="ml-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No sharing cabs have been added yet.
            </div>
          )}
        </div>
      </div>

      {/* Additional Charges Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gray-100 p-2 rounded-lg">
            <IndianRupee className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Additional Charges</h3>
            <p className="text-sm text-gray-600">Extra costs not included in the base rates.</p>
          </div>
        </div>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Toll, parking, and driver food are extra for cabs.</li>
          <li>Toll, parking, permit, and driver food are extra for buses.</li>
        </ul>
      </div>
    </div>
  );
};

export default RatesPage;