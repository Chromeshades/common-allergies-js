const fs = require('fs');
const path = require('path');

// Import all allergy data from the data folder
const environmentalAllergies = require('./data/environmental-allergies.json');
const foodAllergies = require('./data/food-allergies.json');
const insectAllergies = require('./data/insect-allergies.json');
const medicationAllergies = require('./data/medication-allergies.json');
const otherAllergies = require('./data/other-allergies.json');

// Combine all allergies
const allAllergies = [
  ...environmentalAllergies,
  ...foodAllergies,
  ...insectAllergies,
  ...medicationAllergies,
  ...otherAllergies
];

/**
 * Returns all allergies from all categories
 * @returns {Array} Combined array of all allergies
 */
function getAllergies() {
  return allAllergies;
}

/**
 * Returns allergies filtered by type
 * @param {string} type - The type of allergies to filter by (e.g., 'Food', 'Environmental')
 * @returns {Array} Filtered array of allergies
 */
function getAllergiesByType(type) {
  return allAllergies.filter(allergy => allergy.type === type);
}

/**
 * Returns environmental allergies
 * @returns {Array} Array of environmental allergies
 */
function getEnvironmentalAllergies() {
  return environmentalAllergies;
}

/**
 * Returns food allergies
 * @returns {Array} Array of food allergies
 */
function getFoodAllergies() {
  return foodAllergies;
}

/**
 * Returns insect allergies
 * @returns {Array} Array of insect allergies
 */
function getInsectAllergies() {
  return insectAllergies;
}

/**
 * Returns medication allergies
 * @returns {Array} Array of medication allergies
 */
function getMedicationAllergies() {
  return medicationAllergies;
}

/**
 * Returns other allergies
 * @returns {Array} Array of other allergies
 */
function getOtherAllergies() {
  return otherAllergies;
}

/**
 * Returns allergies by symptom
 * @param {string} symptom - Text to search for within symptoms
 * @param {boolean} [caseSensitive=false] - Whether to perform a case-sensitive search
 * @returns {Array} Allergies that include the specified symptom
 */
function getAllergiesBySymptom(symptom, caseSensitive = false) {
  // Return empty array for null, undefined, or empty string symptoms
  if (!symptom || symptom.trim() === '') {
    return [];
  }

  return allAllergies.filter(allergy => {
    return allergy.commonSymptoms.some(s => {
      if (caseSensitive) {
        return s.includes(symptom);
      } else {
        return s.toLowerCase().includes(symptom.toLowerCase());
      }
    });
  });
}

/**
 * Returns allergies by category
 * @param {string} category - The category to filter by
 * @returns {Array} Allergies of the specified category
 */
function getAllergiesByCategory(category) {
  return allAllergies.filter(allergy => allergy.category === category);
}

/**
 * Returns allergies that have cross-reactivity with the specified allergen
 * @param {string} allergen - The allergen to check for cross-reactivity
 * @param {boolean} [caseSensitive=false] - Whether to perform a case-sensitive search
 * @returns {Array} Allergies with cross-reactivity to the specified allergen
 */
function getAllergiesByCrossReactivity(allergen, caseSensitive = false) {
  return allAllergies.filter(allergy => {
    return allergy.crossReactivity.some(cr => {
      if (caseSensitive) {
        return cr.includes(allergen);
      } else {
        return cr.toLowerCase().includes(allergen.toLowerCase());
      }
    });
  });
}

/**
 * Returns an allergy by its unique ID
 * @param {string} id - The unique identifier for the allergy
 * @returns {Object|null} The allergy object or null if not found
 */
function getAllergyById(id) {
  return allAllergies.find(allergy => allergy.id === id) || null;
}

/**
 * Filter allergies by multiple criteria
 * @param {Object} filters - Object containing filter criteria
 * @param {string} [filters.type] - Filter by allergy type
 * @param {string} [filters.category] - Filter by allergy category
 * @param {string} [filters.symptom] - Filter by symptom text
 * @param {string} [filters.crossReactivity] - Filter by cross-reactivity
 * @param {string} [filters.treatmentContains] - Filter by treatment text
 * @param {string} [filters.nameContains] - Filter by allergy name
 * @param {boolean} [filters.caseSensitive=false] - Whether string comparisons are case-sensitive
 * @param {string} [filters.logicOperator='AND'] - Logic to use between filters ('AND' or 'OR')
 * @returns {Array} Filtered allergies
 */
function filterAllergies(filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return allAllergies;
  }

  const {
    type,
    category,
    symptom,
    crossReactivity,
    treatmentContains,
    nameContains,
    caseSensitive = false,
    logicOperator = 'AND'
  } = filters;

  return allAllergies.filter(allergy => {
    const typeMatch = !type || allergy.type === type;
    
    const categoryMatch = !category || allergy.category === category;
    
    const symptomMatch = !symptom || allergy.commonSymptoms.some(s => {
      if (caseSensitive) {
        return s.includes(symptom);
      } else {
        return s.toLowerCase().includes(symptom.toLowerCase());
      }
    });
    
    const crossReactivityMatch = !crossReactivity || allergy.crossReactivity.some(cr => {
      if (caseSensitive) {
        return cr.includes(crossReactivity);
      } else {
        return cr.toLowerCase().includes(crossReactivity.toLowerCase());
      }
    });
    
    const treatmentMatch = !treatmentContains || (() => {
      if (caseSensitive) {
        return allergy.treatment.includes(treatmentContains);
      } else {
        return allergy.treatment.toLowerCase().includes(treatmentContains.toLowerCase());
      }
    })();
    
    const nameMatch = !nameContains || (() => {
      if (caseSensitive) {
        return allergy.name.includes(nameContains);
      } else {
        return allergy.name.toLowerCase().includes(nameContains.toLowerCase());
      }
    })();

    if (logicOperator.toUpperCase() === 'OR') {
      // For OR logic, only include criteria that were actually specified
      const criteria = [];
      if (type) criteria.push(typeMatch);
      if (category) criteria.push(categoryMatch);
      if (symptom) criteria.push(symptomMatch);
      if (crossReactivity) criteria.push(crossReactivityMatch);
      if (treatmentContains) criteria.push(treatmentMatch);
      if (nameContains) criteria.push(nameMatch);
      
      // If no criteria were specified, return true (include all)
      return criteria.length === 0 || criteria.some(match => match === true);
    } else {
      // Default to AND logic
      return typeMatch && categoryMatch && symptomMatch && 
             crossReactivityMatch && treatmentMatch && nameMatch;
    }
  });
}

/**
 * Advanced search function with custom filter functions
 * @param {Function[]} filterFunctions - Array of filter functions
 * @param {string} [logicOperator='AND'] - Logic to use between filters ('AND' or 'OR')
 * @returns {Array} Filtered allergies
 */
function advancedSearch(filterFunctions, logicOperator = 'AND') {
  if (!Array.isArray(filterFunctions) || filterFunctions.length === 0) {
    return allAllergies;
  }

  return allAllergies.filter(allergy => {
    const results = filterFunctions.map(fn => fn(allergy));
    
    if (logicOperator.toUpperCase() === 'OR') {
      return results.some(result => result === true);
    } else {
      return results.every(result => result === true);
    }
  });
}

/**
 * Get just the names of allergies from an array of allergy objects
 * @param {Array} allergies - Array of allergy objects
 * @returns {string[]} Array of allergy names
 */
function getAllergyNames(allergies) {
  if (!Array.isArray(allergies)) {
    return [];
  }
  return allergies.map(allergy => allergy.name);
}

/**
 * Get names of all allergies
 * @returns {string[]} Array of all allergy names
 */
function getAllAllergyNames() {
  return getAllergyNames(allAllergies);
}

/**
 * Get names of all food allergies
 * @returns {string[]} Array of food allergy names
 */
function getFoodAllergyNames() {
  return getAllergyNames(foodAllergies);
}

/**
 * Get names of all environmental allergies
 * @returns {string[]} Array of environmental allergy names
 */
function getEnvironmentalAllergyNames() {
  return getAllergyNames(environmentalAllergies);
}

/**
 * Get names of all insect allergies
 * @returns {string[]} Array of insect allergy names
 */
function getInsectAllergyNames() {
  return getAllergyNames(insectAllergies);
}

/**
 * Get names of all medication allergies
 * @returns {string[]} Array of medication allergy names
 */
function getMedicationAllergyNames() {
  return getAllergyNames(medicationAllergies);
}

/**
 * Get names of all other allergies
 * @returns {string[]} Array of other allergy names
 */
function getOtherAllergyNames() {
  return getAllergyNames(otherAllergies);
}

/**
 * Get names of allergies by type
 * @param {string} type - Type of allergies to get names for
 * @returns {string[]} Array of allergy names of the specified type
 */
function getAllergyNamesByType(type) {
  return getAllergyNames(getAllergiesByType(type));
}

module.exports = {
  getAllergies,
  getAllergiesByType,
  getEnvironmentalAllergies,
  getFoodAllergies,
  getInsectAllergies,
  getMedicationAllergies,
  getOtherAllergies,
  getAllergiesBySymptom,
  getAllergiesByCategory,
  getAllergiesByCrossReactivity,
  getAllergyById,
  filterAllergies,
  advancedSearch,
  // New name-only functions
  getAllergyNames,
  getAllAllergyNames,
  getFoodAllergyNames,
  getEnvironmentalAllergyNames,
  getInsectAllergyNames,
  getMedicationAllergyNames,
  getOtherAllergyNames,
  getAllergyNamesByType
};
