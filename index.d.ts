/**
 * Type definitions for common-allergies-js
 */

/**
 * Object representing an allergy
 */
export interface Allergy {
  /** Unique identifier for the allergy */
  id: string;
  /** Name of the allergy */
  name: string;
  /** Primary classification (Food, Environmental, Insect, Medication, Other) */
  type: AllergyType;
  /** Sub-classification (e.g., Legume, Seafood, Airborne) */
  category: string;
  /** List of common symptoms */
  commonSymptoms: string[];
  /** Related allergies or substances with cross-reactivity */
  crossReactivity: string[];
  /** Prevalence statistics by demographic */
  prevalence: {
    [demographic: string]: string;
  };
  /** Foods to avoid (primarily for food allergies) */
  avoidFoods?: string[];
  /** Common sources of the allergen (primarily for environmental allergies) */
  commonSources?: string[];
  /** Seasonality information (primarily for environmental allergies) */
  seasonality?: {
    [season: string]: string;
  };
  /** Medically recognized name for the allergy */
  medicalName: string;
  /** Methods used for diagnosing the allergy */
  testingMethods: string[];
  /** Common approaches to treating the allergy */
  treatment: string;
  /** Peak seasons (for seasonal allergies) */
  peakSeasons?: string;
  /** Specific allergen proteins (where identified) */
  allergenProteins?: {
    [source: string]: string;
  };
}

/**
 * Allergy type classifications
 */
export type AllergyType = 'Food' | 'Environmental' | 'Insect' | 'Medication' | 'Other';

/**
 * Logic operator for combining multiple filters
 */
export type LogicOperator = 'AND' | 'OR';

/**
 * Filter options for the filterAllergies function
 */
export interface FilterOptions {
  /** Filter by allergy type */
  type?: AllergyType;
  /** Filter by allergy category */
  category?: string;
  /** Filter by symptom text */
  symptom?: string;
  /** Filter by cross-reactivity */
  crossReactivity?: string;
  /** Filter by treatment text */
  treatmentContains?: string;
  /** Filter by allergy name */
  nameContains?: string;
  /** Whether string comparisons are case-sensitive */
  caseSensitive?: boolean;
  /** Logic to use between filters ('AND' or 'OR') */
  logicOperator?: LogicOperator;
}

/**
 * Filter function for advanced searches
 */
export type FilterFunction = (allergy: Allergy) => boolean;

/**
 * Returns all allergies from all categories
 * @returns Combined array of all allergies
 */
export function getAllergies(): Allergy[];

/**
 * Returns allergies filtered by type
 * @param type The type of allergies to filter by (e.g., 'Food', 'Environmental')
 * @returns Filtered array of allergies
 */
export function getAllergiesByType(type: AllergyType): Allergy[];

/**
 * Returns environmental allergies
 * @returns Array of environmental allergies
 */
export function getEnvironmentalAllergies(): Allergy[];

/**
 * Returns food allergies
 * @returns Array of food allergies
 */
export function getFoodAllergies(): Allergy[];

/**
 * Returns insect allergies
 * @returns Array of insect allergies
 */
export function getInsectAllergies(): Allergy[];

/**
 * Returns medication allergies
 * @returns Array of medication allergies
 */
export function getMedicationAllergies(): Allergy[];

/**
 * Returns other allergies
 * @returns Array of other allergies
 */
export function getOtherAllergies(): Allergy[];

/**
 * Returns allergies by symptom
 * @param symptom Text to search for within symptoms
 * @param caseSensitive Whether to perform a case-sensitive search
 * @returns Allergies that include the specified symptom
 */
export function getAllergiesBySymptom(symptom: string, caseSensitive?: boolean): Allergy[];

/**
 * Returns allergies by category
 * @param category The category to filter by
 * @returns Allergies of the specified category
 */
export function getAllergiesByCategory(category: string): Allergy[];

/**
 * Returns allergies that have cross-reactivity with the specified allergen
 * @param allergen The allergen to check for cross-reactivity
 * @param caseSensitive Whether to perform a case-sensitive search
 * @returns Allergies with cross-reactivity to the specified allergen
 */
export function getAllergiesByCrossReactivity(allergen: string, caseSensitive?: boolean): Allergy[];

/**
 * Returns an allergy by its unique ID
 * @param id The unique identifier for the allergy
 * @returns The allergy object or null if not found
 */
export function getAllergyById(id: string): Allergy | null;

/**
 * Filter allergies by multiple criteria
 * @param filters Object containing filter criteria
 * @returns Filtered allergies
 */
export function filterAllergies(filters: FilterOptions): Allergy[];

/**
 * Advanced search function with custom filter functions
 * @param filterFunctions Array of filter functions
 * @param logicOperator Logic to use between filters ('AND' or 'OR')
 * @returns Filtered allergies
 */
export function advancedSearch(filterFunctions: FilterFunction[], logicOperator?: LogicOperator): Allergy[];

/**
 * Get just the names of allergies from an array of allergy objects
 * @param allergies Array of allergy objects
 * @returns Array of allergy names
 */
export function getAllergyNames(allergies: Allergy[]): string[];

/**
 * Get names of all allergies
 * @returns Array of all allergy names
 */
export function getAllAllergyNames(): string[];

/**
 * Get names of all food allergies
 * @returns Array of food allergy names
 */
export function getFoodAllergyNames(): string[];

/**
 * Get names of all environmental allergies
 * @returns Array of environmental allergy names
 */
export function getEnvironmentalAllergyNames(): string[];

/**
 * Get names of all insect allergies
 * @returns Array of insect allergy names
 */
export function getInsectAllergyNames(): string[];

/**
 * Get names of all medication allergies
 * @returns Array of medication allergy names
 */
export function getMedicationAllergyNames(): string[];

/**
 * Get names of all other allergies
 * @returns Array of other allergy names
 */
export function getOtherAllergyNames(): string[];

/**
 * Get names of allergies by type
 * @param type Type of allergies to get names for
 * @returns Array of allergy names of the specified type
 */
export function getAllergyNamesByType(type: AllergyType): string[];