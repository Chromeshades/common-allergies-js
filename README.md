# Common Allergies JS
A comprehensive JavaScript library providing structured data on common allergies across multiple categories, with over 200 allergies documented in detail.

## Installation
```bash
npm install common-allergies-js
```

## Features
- Comprehensive database of common allergies organized by type
- Over 200 documented allergies with detailed information
- Data structure includes symptoms, prevalence, treatments, cross-reactivity and more
- Type-safe API with full TypeScript support
- Simple, flexible API for accessing allergy data
- Advanced filtering capabilities for complex queries
- Special categories like Latex-Fruit Syndrome and medication cross-sensitivities

## Usage

### Basic Usage

```javascript
// CommonJS
const allergies = require('common-allergies-js');

// OR ES Modules
import * as allergies from 'common-allergies-js';
// OR import specific functions
import { 
  getAllergies, 
  getAllergiesByType, 
  getFoodAllergies 
} from 'common-allergies-js';

// Get all allergies
const allAllergies = allergies.getAllergies();
// OR with named import
// const allAllergies = getAllergies();
console.log(`Total allergies: ${allAllergies.length}`);

// Get allergies by type
const foodAllergies = allergies.getAllergiesByType('Food');
// OR with named import
// const foodAllergies = getAllergiesByType('Food');
console.log(`Food allergies: ${foodAllergies.length}`);

// Get specific category
const environmentalAllergies = allergies.getEnvironmentalAllergies();
// OR with named import
// const environmentalAllergies = getEnvironmentalAllergies();
console.log(`Environmental allergies: ${environmentalAllergies.length}`);
```

### Available Methods

| Method | Description | Return Type |
|--------|-------------|-------------|
| `getAllergies()` | Returns all allergies from all categories | `Allergy[]` |
| `getAllergiesByType(type)` | Returns allergies filtered by type | `Allergy[]` |
| `getEnvironmentalAllergies()` | Returns only environmental allergies | `Allergy[]` |
| `getFoodAllergies()` | Returns only food allergies | `Allergy[]` |
| `getInsectAllergies()` | Returns only insect allergies | `Allergy[]` |
| `getMedicationAllergies()` | Returns only medication allergies | `Allergy[]` |
| `getOtherAllergies()` | Returns other miscellaneous allergies | `Allergy[]` |
| `getAllergiesBySymptom(symptom, caseSensitive?)` | Returns allergies with a specific symptom | `Allergy[]` |
| `getAllergiesByCategory(category)` | Returns allergies in a specific category | `Allergy[]` |
| `getAllergiesByCrossReactivity(allergen, caseSensitive?)` | Returns allergies with cross-reactivity to the specified allergen | `Allergy[]` |
| `getAllergyById(id)` | Returns a single allergy by its unique ID | `Allergy \| null` |
| `filterAllergies(filters)` | Returns allergies filtered by multiple criteria | `Allergy[]` |
| `advancedSearch(filterFunctions, logicOperator?)` | Returns allergies filtered by custom functions | `Allergy[]` |
| `getAllergyNames(allergies)` | Extracts just the names from an array of allergies | `string[]` |
| `getAllAllergyNames()` | Gets the names of all allergies | `string[]` |
| `getFoodAllergyNames()` | Gets the names of all food allergies | `string[]` |
| `getEnvironmentalAllergyNames()` | Gets the names of all environmental allergies | `string[]` |
| `getInsectAllergyNames()` | Gets the names of all insect allergies | `string[]` |
| `getMedicationAllergyNames()` | Gets the names of all medication allergies | `string[]` |
| `getOtherAllergyNames()` | Gets the names of all other allergies | `string[]` |
| `getAllergyNamesByType(type)` | Gets allergy names filtered by type | `string[]` |

## Data Structure

Each allergy object follows this structure:

```typescript
interface Allergy {
  id: string;            // Unique identifier
  name: string;          // Allergy name
  type: string;          // Primary classification (Food, Environmental, etc.)
  category: string;      // Sub-classification (Legume, Seafood, etc.)
  commonSymptoms: string[]; // Array of common symptoms
  crossReactivity: string[]; // Related allergies or cross-reactive substances
  prevalence: {          // Prevalence statistics by demographic
    [key: string]: string;
  };
  avoidFoods?: string[]; // Foods to avoid (for food allergies)
  commonSources?: string[]; // Common sources (for environmental allergies)
  medicalName: string;   // Medical terminology
  testingMethods: string[]; // Methods used for diagnosis
  treatment: string;     // Common treatment approaches
}
```

## Examples

### Finding allergies with specific symptoms

```javascript
const allergies = require('common-allergies-js');

// Get all allergies that commonly cause hives
const hivesAllergies = allergies.getAllergiesBySymptom('hives');
console.log(`Allergies that cause hives: ${hivesAllergies.length}`);
hivesAllergies.forEach(allergy => console.log(`- ${allergy.name} (${allergy.type})`));
```

### Finding food allergies with cross-reactivity

```javascript
const allergies = require('common-allergies-js');

// Get food allergies that cross-react with peanuts
const peanutCrossReactive = allergies.getAllergiesByCrossReactivity('peanut');
console.log('Food allergies with peanut cross-reactivity:');
peanutCrossReactive.forEach(allergy => console.log(`- ${allergy.name}`));
```

### Looking up an allergy by ID

```javascript
const allergies = require('common-allergies-js');

// Get details for a specific allergy
const peanutAllergy = allergies.getAllergyById('peanut-001');
if (peanutAllergy) {
  console.log(`Allergy: ${peanutAllergy.name}`);
  console.log(`Medical name: ${peanutAllergy.medicalName}`);
  console.log('Common symptoms:');
  peanutAllergy.commonSymptoms.forEach(symptom => console.log(`- ${symptom}`));
}
```

### Finding allergies by category

```javascript
const allergies = require('common-allergies-js');

// Get all legume allergies
const legumeAllergies = allergies.getAllergiesByCategory('Legume');
console.log('Legume allergies:');
legumeAllergies.forEach(allergy => console.log(`- ${allergy.name}`));
```

### Advanced Filtering with Multiple Criteria

```javascript
const allergies = require('common-allergies-js');

// Find food allergies that cause hives and mention avoidance in treatment
const result = allergies.filterAllergies({
  type: 'Food',
  symptom: 'hives',
  treatmentContains: 'avoidance'
});

console.log(`Found ${result.length} food allergies that cause hives and mention avoidance in treatment`);
result.forEach(allergy => console.log(`- ${allergy.name}`));

// Find allergies that are either food type OR environmental
const foodOrEnvironmental = allergies.filterAllergies({
  type: 'Food',
  symptom: 'sneezing',
  logicOperator: 'OR'  // Use OR logic instead of the default AND
});

console.log(`Found ${foodOrEnvironmental.length} allergies that are either food allergies or cause sneezing`);
```

### Custom Filter Functions with Advanced Search

The `advancedSearch` function allows for completely custom filtering logic:

```javascript
const allergies = require('common-allergies-js');

// Create custom filter functions
const isCommon = allergy => {
  // Consider an allergy common if it has "common" in its prevalence data
  return Object.values(allergy.prevalence).some(value => 
    value.toLowerCase().includes('common')
  );
};

const hasManySymptoms = allergy => allergy.commonSymptoms.length > 5;

const requiresEpinephrine = allergy => 
  allergy.treatment.toLowerCase().includes('epinephrine');

// Combine filters with AND logic (default)
const severeCommonAllergies = allergies.advancedSearch([
  isCommon,
  hasManySymptoms,
  requiresEpinephrine
]);

console.log(`Found ${severeCommonAllergies.length} common allergies with many symptoms that require epinephrine`);

// Use OR logic between filters
const eitherCommonOrSevere = allergies.advancedSearch([
  isCommon,
  requiresEpinephrine
], 'OR');

console.log(`Found ${eitherCommonOrSevere.length} allergies that are either common or require epinephrine`);
```

### Getting Just the Names of Allergies

For cases where you only need the names of allergies (like displaying in a dropdown or simple list), use the name-specific functions:

```javascript
const allergies = require('common-allergies-js');

// Get all food allergy names
const foodAllergyNames = allergies.getFoodAllergyNames();
console.log('Food allergies:');
foodAllergyNames.forEach(name => console.log(`- ${name}`));

// Get names of allergies that cause hives
const hivesAllergies = allergies.getAllergiesBySymptom('hives');
const hivesAllergyNames = allergies.getAllergyNames(hivesAllergies);
console.log('Allergies that cause hives:');
hivesAllergyNames.forEach(name => console.log(`- ${name}`));

// Get names of allergies by type
const envAllergyNames = allergies.getAllergyNamesByType('Environmental');
console.log('Environmental allergies:');
envAllergyNames.forEach(name => console.log(`- ${name}`));
```

These name-only functions are useful when:
- Populating select dropdowns or checkboxes
- Creating simple lists for display
- Generating reports where only the allergy names are needed
- Building autocomplete functionality
- Creating CSV exports of allergy names

## Filter Options

The `filterAllergies` function accepts an options object with the following properties:

```typescript
interface FilterOptions {
  // Filter by allergy type (Food, Environmental, Insect, Medication, Other)
  type?: string;
  
  // Filter by category (e.g., Legume, Seafood)
  category?: string;
  
  // Filter by symptom text
  symptom?: string;
  
  // Filter by cross-reactivity
  crossReactivity?: string;
  
  // Filter by treatment text
  treatmentContains?: string;
  
  // Filter by allergy name
  nameContains?: string;
  
  // Whether string comparisons are case-sensitive (default: false)
  caseSensitive?: boolean;
  
  // Logic to use between filters (AND or OR, default: AND)
  logicOperator?: 'AND' | 'OR';
}
```

## TypeScript Support

This library includes TypeScript declarations for all functions and data structures. When using TypeScript, you'll get full type safety and autocompletion:

```typescript
import { getAllergies, getAllergiesByType, Allergy, AllergyType } from 'common-allergies-js';

// Type-safe usage
const foodAllergies: Allergy[] = getAllergiesByType('Food');

// AllergyType is a union type that ensures only valid types are used
const type: AllergyType = 'Environmental'; // Valid
// const invalidType: AllergyType = 'Something'; // Error: Type '"Something"' is not assignable to type 'AllergyType'
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Data Sources

The allergy information provided in this library is compiled from publicly available medical resources and is intended for informational purposes only. This is not medical advice. Always consult with a healthcare provider for diagnosis and treatment of allergies.

## Advanced Usage Examples

### Exploring Specialized Categories

```javascript
const allergies = require('common-allergies-js');

// Find all allergies related to the Latex-Fruit Syndrome
const latexRelated = allergies.getAllergiesByCrossReactivity('latex');
console.log('Latex-Fruit Syndrome related allergies:');
latexRelated.forEach(allergy => console.log(`- ${allergy.name} (${allergy.type})`));

// Find all food allergies that may trigger oral allergy syndrome
const oralAllergySyndrome = allergies.getFoodAllergies().filter(allergy => 
  allergy.commonSymptoms.some(symptom => 
    symptom.toLowerCase().includes('oral') || 
    symptom.toLowerCase().includes('itching in the mouth')
  )
);
console.log('Foods that may trigger oral allergy syndrome:');
oralAllergySyndrome.forEach(allergy => console.log(`- ${allergy.name}`));
```

### Finding Medication Allergies by Category

```javascript
const allergies = require('common-allergies-js');

// Get all antibiotic allergies
const antibioticAllergies = allergies.getAllergiesByCategory('Antibiotic');
console.log(`Found ${antibioticAllergies.length} antibiotic allergies`);

// Get all NSAID allergies
const nsaidAllergies = allergies.getAllergiesByCategory('NSAID');
console.log('NSAID allergies:');
nsaidAllergies.forEach(allergy => console.log(`- ${allergy.name}`));

// Find medications with significant cross-reactivity
const crossReactiveMeds = allergies.getMedicationAllergies().filter(allergy => 
  allergy.crossReactivity && allergy.crossReactivity.length > 1
);
console.log(`Found ${crossReactiveMeds.length} medications with significant cross-reactivity concerns`);
```

### Analyzing Allergy Prevalence

```javascript
const allergies = require('common-allergies-js');

// Find the most common childhood allergies
const childhoodAllergies = allergies.getAllergies().filter(allergy => 
  allergy.prevalence && 
  (allergy.prevalence.children || allergy.prevalence.infants) &&
  allergy.prevalence.children?.includes('%') 
);

// Sort by prevalence percentage (descending)
childhoodAllergies.sort((a, b) => {
  const getPercentage = (str) => {
    const match = str?.match(/(\d+(?:\.\d+)?)%/);
    return match ? parseFloat(match[1]) : 0;
  };
  
  const percentA = getPercentage(a.prevalence.children);
  const percentB = getPercentage(b.prevalence.children);
  
  return percentB - percentA;
});

console.log('Most common childhood allergies by prevalence:');
childhoodAllergies.slice(0, 5).forEach(allergy => {
  console.log(`- ${allergy.name}: ${allergy.prevalence.children || allergy.prevalence.infants}`);
});
```

### Finding Allergies with Serious Symptoms

```javascript
const allergies = require('common-allergies-js');

// Find allergies that can potentially cause anaphylaxis
const anaphylaxisRisk = allergies.getAllergies().filter(allergy => 
  allergy.commonSymptoms.some(symptom => 
    symptom.toLowerCase().includes('anaphylaxis')
  )
);

console.log(`Found ${anaphylaxisRisk.length} allergies that can potentially cause anaphylaxis`);

// Find allergies requiring epinephrine in treatment
const epinephrineRequired = allergies.getAllergies().filter(allergy => 
  allergy.treatment.toLowerCase().includes('epinephrine')
);

console.log('High-risk allergies requiring emergency epinephrine:');
epinephrineRequired.forEach(allergy => console.log(`- ${allergy.name} (${allergy.type})`));
```

## Dataset Coverage

This library provides comprehensive information on allergies across multiple categories:

### Food Allergies
Contains detailed information on over 25 food allergies, including:
- Common allergens (peanuts, tree nuts, shellfish, dairy, eggs)
- Grain allergies (wheat, corn, buckwheat)
- Fruit allergies (kiwi, apple, strawberry, banana, avocado, mango)
- Seed allergies (sesame, sunflower, poppy)
- Legumes (soy, chickpeas, lupin)
- Vegetables (celery, garlic)
- Special focus on cross-reactivity patterns like Latex-Fruit Syndrome

### Medication Allergies
Detailed information on over 80 medication allergies, including:
- Antibiotics (penicillins, cephalosporins, sulfa drugs, macrolides)
- Pain relievers (NSAIDs, opioids)
- Anesthetics (local and general)
- Contrast agents
- Chemotherapy drugs
- Biologics
- Anticonvulsants
- Antidepressants
- Cardiovascular medications
- GI medications

### Insect Allergies
Covers over 40 insect and arachnid allergies, including:
- Stinging insects (bees, wasps, hornets, fire ants)
- Biting insects (mosquitoes, flies, bedbugs)
- Household insects (cockroaches, silverfish)
- Special allergens like dust mites
- Rare allergies to moths, butterflies, and various fly species

### Other Allergies
Includes information on chemical sensitivities, contactants, and other allergens:
- Hair dye and cosmetic ingredients
- Preservatives
- Industrial chemicals
- Metals
- Natural rubber latex

The total dataset includes medical terminology, cross-reactivity patterns, prevalence statistics, and treatment approaches for over 200 allergies, making it one of the most comprehensive allergy reference libraries available in JavaScript.

## Testing

This library maintains high test coverage across all functionality. To run the tests:

```bash
npm test
```

For coverage report:

```bash
npm run test:coverage
```

### Test Coverage Areas

The test suite covers:

1. **Core Functionality**
   - Data retrieval and filtering
   - Type-specific operations
   - Search and filtering capabilities
   - Name extraction utilities

2. **Data Validation**
   - JSON schema compliance
   - Required field validation
   - Data format consistency
   - Cross-reactivity relationships

3. **Edge Cases**
   - Empty/null/undefined inputs
   - Invalid search criteria
   - Case sensitivity handling
   - Non-existent data queries

4. **Performance**
   - Large dataset operations
   - Complex filtering scenarios
   - Search efficiency
   - AND/OR operations

### Performance Benchmarks

The library maintains the following performance targets:
- Basic filtering: < 50ms
- Complex queries: < 100ms
- Cross-reactivity searches: < 10ms

### Writing Tests

When contributing new features, please ensure:
1. All new functions have corresponding test cases
2. Edge cases are properly handled and tested
3. Performance benchmarks are maintained
4. Data validation is included where relevant

Example test structure:
```javascript
describe('Feature', () => {
  it('should handle the basic case', () => {
    const result = someFunction(validInput);
    assert(result.isValid);
  });

  it('should handle edge cases', () => {
    const emptyResult = someFunction('');
    assert(Array.isArray(emptyResult));
    assert(emptyResult.length === 0);
  });
});
```
