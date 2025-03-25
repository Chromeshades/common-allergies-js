const assert = require('assert');
const { 
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
} = require('../index');

describe('Allergies Module', () => {
  it('should return a list of all allergies', () => {
    const result = getAllergies();
    assert(Array.isArray(result), 'Result should be an array');
    assert(result.length > 0, 'Result should not be empty');
  });

  it('should filter allergies by type correctly', () => {
    const environmentalType = getAllergiesByType('Environmental');
    assert(Array.isArray(environmentalType), 'Environmental allergies should be an array');
    assert(environmentalType.every(item => item.type === 'Environmental'), 
           'All items should be of Environmental type');
    
    const foodType = getAllergiesByType('Food');
    assert(Array.isArray(foodType), 'Food allergies should be an array');
    assert(foodType.every(item => item.type === 'Food'), 
           'All items should be of Food type');
  });

  it('should return specific allergy categories', () => {
    // Test environmental allergies
    const environmental = getEnvironmentalAllergies();
    assert(Array.isArray(environmental), 'Environmental allergies should be an array');
    assert(environmental.length > 0, 'Environmental allergies should not be empty');
    
    // Test food allergies
    const food = getFoodAllergies();
    assert(Array.isArray(food), 'Food allergies should be an array');
    assert(food.length > 0, 'Food allergies should not be empty');
    
    // Test insect allergies
    const insect = getInsectAllergies();
    assert(Array.isArray(insect), 'Insect allergies should be an array');
    
    // Test medication allergies
    const medication = getMedicationAllergies();
    assert(Array.isArray(medication), 'Medication allergies should be an array');
    
    // Test other allergies
    const other = getOtherAllergies();
    assert(Array.isArray(other), 'Other allergies should be an array');
  });

  it('should have the expected structure for allergy objects', () => {
    const allergies = getAllergies();
    const sampleAllergy = allergies[0];
    
    // Check required properties exist
    assert(sampleAllergy.hasOwnProperty('id'), 'Allergy should have an id');
    assert(sampleAllergy.hasOwnProperty('name'), 'Allergy should have a name');
    assert(sampleAllergy.hasOwnProperty('type'), 'Allergy should have a type');
    assert(sampleAllergy.hasOwnProperty('commonSymptoms'), 'Allergy should have common symptoms');
    assert(Array.isArray(sampleAllergy.commonSymptoms), 'Common symptoms should be an array');
  });

  // Tests for new filtering functions
  it('should filter allergies by symptom', () => {
    // Case-insensitive by default
    const hivesAllergies = getAllergiesBySymptom('hives');
    assert(Array.isArray(hivesAllergies), 'Hives allergies should be an array');
    assert(hivesAllergies.length > 0, 'Should find allergies with hives symptom');
    assert(hivesAllergies.every(allergy => 
      allergy.commonSymptoms.some(symptom => 
        symptom.toLowerCase().includes('hives')
      )
    ), 'All allergies should include hives in symptoms');
    
    // Test case sensitivity
    const caseSensitiveHives = getAllergiesBySymptom('Hives', true);
    assert(caseSensitiveHives.every(allergy => 
      allergy.commonSymptoms.some(symptom => 
        symptom.includes('Hives')
      )
    ), 'Case sensitive search should only match exact case');
  });

  it('should filter allergies by category', () => {
    const legumeAllergies = getAllergiesByCategory('Legume');
    assert(Array.isArray(legumeAllergies), 'Legume allergies should be an array');
    assert(legumeAllergies.every(allergy => allergy.category === 'Legume'), 
           'All allergies should be in Legume category');
  });

  it('should filter allergies by cross-reactivity', () => {
    const peanutCross = getAllergiesByCrossReactivity('peanut');
    assert(Array.isArray(peanutCross), 'Cross-reactive allergies should be an array');
    assert(peanutCross.every(allergy => 
      allergy.crossReactivity.some(item => 
        item.toLowerCase().includes('peanut')
      )
    ), 'All allergies should have peanut cross-reactivity');
  });

  it('should find an allergy by ID', () => {
    // Get a known ID from the first allergy
    const firstAllergy = getAllergies()[0];
    const id = firstAllergy.id;
    
    const foundAllergy = getAllergyById(id);
    assert(foundAllergy !== null, 'Should find an allergy with the ID');
    assert(foundAllergy.id === id, 'Found allergy should have matching ID');
    
    // Test with unknown ID
    const unknownAllergy = getAllergyById('unknown-id-999');
    assert(unknownAllergy === null, 'Should return null for unknown ID');
  });

  // Tests for advanced filtering capabilities
  describe('Advanced filtering', () => {
    it('should filter allergies by multiple criteria with AND logic', () => {
      // Find food allergies that cause hives
      const foodAndHives = filterAllergies({
        type: 'Food',
        symptom: 'hives'
      });
      
      assert(Array.isArray(foodAndHives), 'Result should be an array');
      assert(foodAndHives.every(allergy => allergy.type === 'Food'), 
             'All allergies should be of type Food');
      assert(foodAndHives.every(allergy => 
        allergy.commonSymptoms.some(symptom => 
          symptom.toLowerCase().includes('hives')
        )
      ), 'All allergies should have hives in symptoms');
    });

    it('should filter allergies by multiple criteria with OR logic', () => {
      // Find allergies that are either food type OR cause hives
      const foodOrHives = filterAllergies({
        type: 'Food',
        symptom: 'hives',
        logicOperator: 'OR'
      });
      
      assert(Array.isArray(foodOrHives), 'Result should be an array');
      assert(foodOrHives.length > 0, 'Should find some allergies');
      
      // Every allergy should either be Food type OR have hives symptom
      const allMatch = foodOrHives.every(allergy => 
        allergy.type === 'Food' || 
        allergy.commonSymptoms.some(symptom => 
          symptom.toLowerCase().includes('hives')
        )
      );
      
      assert(allMatch, 'All allergies should either be Food type OR contain hives symptom');
    });

    it('should filter by treatment content', () => {
      const avoidanceAllergies = filterAllergies({
        treatmentContains: 'avoidance'
      });
      
      assert(Array.isArray(avoidanceAllergies), 'Result should be an array');
      assert(avoidanceAllergies.every(allergy => 
        allergy.treatment.toLowerCase().includes('avoidance')
      ), 'All allergies should mention avoidance in treatment');
    });

    it('should filter by allergy name', () => {
      const nutAllergies = filterAllergies({
        nameContains: 'nut'
      });
      
      assert(Array.isArray(nutAllergies), 'Result should be an array');
      assert(nutAllergies.every(allergy => 
        allergy.name.toLowerCase().includes('nut')
      ), 'All allergies should include "nut" in their name');
    });

    it('should work with case-sensitive filtering', () => {
      // Case-sensitive search for "Hives" (capital H)
      const caseSensitiveAllergies = filterAllergies({
        symptom: 'Hives',
        caseSensitive: true
      });
      
      // Case-insensitive search
      const caseInsensitiveAllergies = filterAllergies({
        symptom: 'Hives',
        caseSensitive: false
      });
      
      // Sensitive search should return fewer results than insensitive search
      assert(caseSensitiveAllergies.length <= caseInsensitiveAllergies.length, 
             'Case-sensitive search should return fewer or equal results');
    });

    it('should support custom filter functions with advancedSearch', () => {
      // Create custom filters
      const isEnvironmental = allergy => allergy.type === 'Environmental';
      const causesItching = allergy => 
        allergy.commonSymptoms.some(s => 
          s.toLowerCase().includes('itch')
        );
      
      // Find environmental allergies that cause itching using AND logic
      const result = advancedSearch([isEnvironmental, causesItching]);
      
      assert(Array.isArray(result), 'Result should be an array');
      assert(result.every(isEnvironmental), 'All allergies should be environmental');
      assert(result.every(causesItching), 'All allergies should cause itching');
    });

    it('should support OR logic with advancedSearch', () => {
      // Create custom filters
      const isFood = allergy => allergy.type === 'Food';
      const isInsect = allergy => allergy.type === 'Insect';
      
      // Find allergies that are either food OR insect type
      const result = advancedSearch([isFood, isInsect], 'OR');
      
      assert(Array.isArray(result), 'Result should be an array');
      assert(result.every(allergy => allergy.type === 'Food' || allergy.type === 'Insect'), 
             'All allergies should be either Food or Insect type');
    });
  });

  // Tests for the new allergy name functions
  describe('Allergy name functions', () => {
    it('should extract names from an array of allergies', () => {
      const allergies = getAllergies().slice(0, 3); // Get first 3 allergies
      const names = getAllergyNames(allergies);
      
      assert(Array.isArray(names), 'Result should be an array');
      assert.strictEqual(names.length, 3, 'Should have 3 names');
      assert(names.every(name => typeof name === 'string'), 'All items should be strings');
      
      // Check that names match the original allergies
      allergies.forEach((allergy, index) => {
        assert.strictEqual(names[index], allergy.name, 'Name should match the original allergy');
      });
    });

    it('should return all allergy names', () => {
      const allNames = getAllAllergyNames();
      const allAllergies = getAllergies();
      
      assert(Array.isArray(allNames), 'Result should be an array');
      assert.strictEqual(allNames.length, allAllergies.length, 'Should have same length as all allergies');
    });

    it('should return food allergy names', () => {
      const foodNames = getFoodAllergyNames();
      const foodAllergies = getFoodAllergies();
      
      assert(Array.isArray(foodNames), 'Result should be an array');
      assert.strictEqual(foodNames.length, foodAllergies.length, 'Should have same length as food allergies');
      
      // Verify if the returned names are indeed food allergies
      const allFoodNames = foodAllergies.map(allergy => allergy.name);
      assert(foodNames.every(name => allFoodNames.includes(name)), 
             'All names should be food allergy names');
    });

    it('should return environmental allergy names', () => {
      const envNames = getEnvironmentalAllergyNames();
      const envAllergies = getEnvironmentalAllergies();
      
      assert(Array.isArray(envNames), 'Result should be an array');
      assert.strictEqual(envNames.length, envAllergies.length, 
                         'Should have same length as environmental allergies');
    });

    it('should return allergy names by type', () => {
      const foodNamesViaType = getAllergyNamesByType('Food');
      const foodNames = getFoodAllergyNames();
      
      assert(Array.isArray(foodNamesViaType), 'Result should be an array');
      assert.strictEqual(foodNamesViaType.length, foodNames.length, 
                         'Should match direct call to getFoodAllergyNames');
      
      // Check the two arrays have the same content
      const sortedDirect = [...foodNames].sort();
      const sortedViaType = [...foodNamesViaType].sort();
      assert.deepStrictEqual(sortedViaType, sortedDirect, 
                           'Arrays should have the same content');
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle invalid allergy type', () => {
      const invalidType = getAllergiesByType('InvalidType');
      assert(Array.isArray(invalidType), 'Should return empty array for invalid type');
      assert.strictEqual(invalidType.length, 0, 'Should return empty array for invalid type');
    });

    it('should handle null/undefined inputs', () => {
      const nullResult = getAllergiesByType(null);
      const undefinedResult = getAllergiesByType(undefined);
      
      assert(Array.isArray(nullResult), 'Should handle null input');
      assert(Array.isArray(undefinedResult), 'Should handle undefined input');
      assert.strictEqual(nullResult.length, 0, 'Should return empty array for null');
      assert.strictEqual(undefinedResult.length, 0, 'Should return empty array for undefined');
    });

    it('should handle empty symptom search', () => {
      const emptySymptom = getAllergiesBySymptom('');
      assert(Array.isArray(emptySymptom), 'Should return empty array for empty symptom');
      assert.strictEqual(emptySymptom.length, 0, 'Should return empty array for empty symptom');
    });
  });

  describe('Additional name function tests', () => {
    it('should return insect allergy names', () => {
      const insectNames = getInsectAllergyNames();
      const insectAllergies = getInsectAllergies();
      
      assert(Array.isArray(insectNames), 'Result should be an array');
      assert.strictEqual(insectNames.length, insectAllergies.length, 'Should have same length as insect allergies');
      assert(insectNames.every(name => typeof name === 'string'), 'All items should be strings');
    });

    it('should return medication allergy names', () => {
      const medNames = getMedicationAllergyNames();
      const medAllergies = getMedicationAllergies();
      
      assert(Array.isArray(medNames), 'Result should be an array');
      assert.strictEqual(medNames.length, medAllergies.length, 'Should have same length as medication allergies');
      assert(medNames.every(name => typeof name === 'string'), 'All items should be strings');
    });

    it('should return other allergy names', () => {
      const otherNames = getOtherAllergyNames();
      const otherAllergies = getOtherAllergies();
      
      assert(Array.isArray(otherNames), 'Result should be an array');
      assert.strictEqual(otherNames.length, otherAllergies.length, 'Should have same length as other allergies');
    });

    it('should handle invalid inputs in name functions', () => {
      const invalidNames = getAllergyNames(null);
      const undefinedNames = getAllergyNames(undefined);
      const emptyNames = getAllergyNames([]);
      
      assert(Array.isArray(invalidNames), 'Should handle null input');
      assert(Array.isArray(undefinedNames), 'Should handle undefined input');
      assert(Array.isArray(emptyNames), 'Should handle empty array');
      assert.strictEqual(invalidNames.length, 0, 'Should return empty array for null');
      assert.strictEqual(undefinedNames.length, 0, 'Should return empty array for undefined');
      assert.strictEqual(emptyNames.length, 0, 'Should return empty array for empty input');
    });
  });

  describe('Advanced filter edge cases', () => {
    it('should handle empty filter criteria', () => {
      const result = filterAllergies({});
      const allAllergies = getAllergies();
      
      assert(Array.isArray(result), 'Result should be an array');
      assert.strictEqual(result.length, allAllergies.length, 'Should return all allergies when no criteria');
    });

    it('should handle non-existent symptom', () => {
      const result = filterAllergies({ symptom: 'nonexistentsymptom123' });
      
      assert(Array.isArray(result), 'Result should be an array');
      assert.strictEqual(result.length, 0, 'Should return empty array for non-existent symptom');
    });

    it('should handle multiple invalid criteria', () => {
      const result = filterAllergies({
        type: 'InvalidType',
        symptom: 'InvalidSymptom',
        category: 'InvalidCategory'
      });
      
      assert(Array.isArray(result), 'Result should be an array');
      assert.strictEqual(result.length, 0, 'Should return empty array for all invalid criteria');
    });
  });

  describe('Cross-reactivity detailed tests', () => {
    it('should handle case sensitivity in cross-reactivity search', () => {
      const caseSensitive = getAllergiesByCrossReactivity('Peanut', true);
      const caseInsensitive = getAllergiesByCrossReactivity('peanut', false);
      
      assert(Array.isArray(caseSensitive), 'Case sensitive result should be array');
      assert(Array.isArray(caseInsensitive), 'Case insensitive result should be array');
      assert(caseInsensitive.length >= caseSensitive.length, 'Case insensitive should return >= results');
    });

    it('should handle multiple cross-reactivity patterns', () => {
      const multiPattern = getAllergies().filter(allergy => 
        allergy.crossReactivity && allergy.crossReactivity.length > 1
      );
      
      assert(Array.isArray(multiPattern), 'Result should be array');
      assert(multiPattern.every(allergy => allergy.crossReactivity.length > 1),
        'Should only include allergies with multiple cross-reactivities');
    });
  });

  describe('Data Validation Tests', () => {
    it('should validate allergy ID format', () => {
      const allergies = getAllergies();
      allergies.forEach(allergy => {
        assert(allergy.id.includes('-'), 'ID should contain a hyphen');
        assert(/^[a-zA-Z0-9-]+$/.test(allergy.id), 'ID should only contain letters, numbers, and hyphens');
        assert(allergy.id.split('-').length >= 2, 'ID should have at least two parts separated by hyphens');
      });
    });

    it('should ensure no duplicate IDs exist', () => {
      const allergies = getAllergies();
      const ids = allergies.map(a => a.id);
      const uniqueIds = new Set(ids);
      assert.strictEqual(ids.length, uniqueIds.size, 'Should have no duplicate IDs');
    });

    it('should validate cross-reactivity data', () => {
      const allergies = getAllergies();
      allergies.forEach(allergy => {
        if (allergy.crossReactivity) {
          assert(Array.isArray(allergy.crossReactivity), 'Cross-reactivity should be an array');
          allergy.crossReactivity.forEach(item => {
            assert(typeof item === 'string', 'Cross-reactivity items should be strings');
            assert(item.length > 0, 'Cross-reactivity items should not be empty');
          });
        }
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle large dataset filtering efficiently', () => {
      const start = process.hrtime();
      
      const result = filterAllergies({
        symptom: 'rash',
        type: 'Food',
        treatmentContains: 'avoidance'
      });

      const [seconds, nanoseconds] = process.hrtime(start);
      assert(seconds === 0 && nanoseconds < 50000000, 'Should complete filtering in under 50ms');
    });

    it('should efficiently search cross-reactivity patterns', () => {
      const start = process.hrtime();
      
      getAllergiesByCrossReactivity('peanut');
      
      const [seconds, nanoseconds] = process.hrtime(start);
      assert(seconds === 0 && nanoseconds < 10000000, 'Should complete cross-reactivity search in under 10ms');
    });
  });

  describe('Data Integrity Tests', () => {
    it('should validate required fields across all allergy types', () => {
      const allergies = getAllergies();
      const requiredFields = ['id', 'name', 'type', 'commonSymptoms', 'medicalName', 'treatment'];
      
      allergies.forEach(allergy => {
        requiredFields.forEach(field => {
          assert(allergy.hasOwnProperty(field), `Allergy ${allergy.id} missing required field: ${field}`);
          assert(allergy[field] !== undefined, `Required field ${field} should not be undefined`);
          assert(allergy[field] !== null, `Required field ${field} should not be null`);
          assert(allergy[field] !== '', `Required field ${field} should not be empty`);
        });
      });
    });

    it('should validate treatment patterns', () => {
      const allergies = getAllergies();
      allergies.forEach(allergy => {
        assert(typeof allergy.treatment === 'string', 'Treatment should be a string');
        assert(allergy.treatment.length >= 5, 'Treatment description should be meaningful');
      });
    });

    it('should validate prevalence data format', () => {
      const allergies = getAllergies();
      allergies.forEach(allergy => {
        assert(typeof allergy.prevalence === 'object', 'Prevalence should be an object');
        Object.entries(allergy.prevalence).forEach(([key, value]) => {
          assert(typeof key === 'string', 'Prevalence key should be a string');
          assert(typeof value === 'string', 'Prevalence value should be a string');
          assert(key.length > 0, 'Prevalence key should not be empty');
          assert(value.length > 0, 'Prevalence value should not be empty');
        });
      });
    });

    it('should validate medical names', () => {
      const allergies = getAllergies();
      allergies.forEach(allergy => {
        assert(typeof allergy.medicalName === 'string', 'Medical name should be a string');
        assert(allergy.medicalName.length > 0, 'Medical name should not be empty');
      });
    });
  });

  describe('Type-specific Data Tests', () => {
    it('should validate food allergy specific fields', () => {
      const foodAllergies = getFoodAllergies();
      foodAllergies.forEach(allergy => {
        if (allergy.avoidFoods) {
          assert(Array.isArray(allergy.avoidFoods), 'avoidFoods should be an array');
          assert(allergy.avoidFoods.every(food => typeof food === 'string'), 
                 'avoidFoods items should be strings');
        }
      });
    });

    it('should validate medication allergy specific fields', () => {
      const medAllergies = getMedicationAllergies();
      medAllergies.forEach(allergy => {
        assert(allergy.category, 'Medication allergies should have a category');
        assert(typeof allergy.category === 'string', 'Category should be a string');
      });
    });
  });

  describe('Search Performance Tests', () => {
    it('should efficiently filter by multiple criteria', () => {
      const start = process.hrtime();
      
      const result = filterAllergies({
        type: 'Food',
        symptom: 'hives',
        treatmentContains: 'avoidance',
        category: 'Legume'
      });

      const [seconds, nanoseconds] = process.hrtime(start);
      assert(seconds === 0 && nanoseconds < 100000000, 
             'Complex filtering should complete in under 100ms');
    });

    it('should handle large AND/OR operations efficiently', () => {
      const start = process.hrtime();
      
      const result = filterAllergies({
        type: 'Food',
        symptom: 'anaphylaxis',
        category: 'Legume',
        logicOperator: 'OR'
      });

      const [seconds, nanoseconds] = process.hrtime(start);
      assert(seconds === 0 && nanoseconds < 100000000, 
             'OR operations should complete in under 100ms');
    });
  });
});
