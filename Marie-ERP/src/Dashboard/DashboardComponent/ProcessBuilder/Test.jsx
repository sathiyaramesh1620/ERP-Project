import React, { useState } from "react";

const CategorySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categoriesData = {
    Administration: [
      "Business License",
      "Business Insurance",
      "Printing",
      "Stationary",
      "Reading Articles",
      "Subscriptions",
      "Donations",
      "Laundry",
      "Uniform",
      "Sundry",
    ],
    Advertising: ["Online", "Social Media"],
    Communications: ["Internet", "Telephone"],
    Depreciation: [
      "Office Equipment",
      "Kitchen Equipment",
      "Dining Equipment",
      "Motor Vehicle",
      "IT Systems",
    ],
    Logistics: [
      "Motor Vehicle - Road Tax and Insurance",
      "Toll Fares",
      "Parking and Fines",
      "Taxi Fares",
      "Flights",
      "Accommodation",
      "Petrol",
      "Postage",
    ],
    Materials: ["Packaging", "Cleaning", "Small Value Materials"],
    Payments: ["Delivery Commissions", "Bank Merchant Charges"],
    Rentals: [
      "Building",
      "Office Equipment",
      "Kitchen Equipment",
      "Motor Vehicle",
      "IT Systems",
    ],
    Repairs: ["Building", "Equipment", "Motor Vehicle", "IT Systems"],
    Reporting: [
      "Auditors Remuneration",
      "Tax Agent Remuneration",
      "Secretarial Remuneration",
      "Bank Charges",
    ],
    Utilities: ["Electricity", "Water", "Gas", "Sewerage"],
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCategories = Object.keys(categoriesData).filter((category) =>
    category.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div>
        {filteredCategories.map((category) => (
          <div key={category}>
            <h3>{category}</h3>
            <ul>
              {categoriesData[category].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySearch;
