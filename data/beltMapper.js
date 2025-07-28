/**
 * This object maps canonical belt keys (the ones used in belt_data.json)
 * to a list of possible aliases that an AI might return.
 * All aliases should be in lowercase for easy comparison.
 * @type {Object.<string, string[]>}
 */
export const beltAliasMapping = {
  // The key 'jr-stem' maps to these possible inputs
  'jr-stem': [
    'jr stem',
    'jr-stem',
    'jr. stem',
    'jr stem belt',
    'stem jr',
    'stem jr belt',
    'stem jr. belt'
  ],

  // The key 'foundation' maps to these possible inputs
  'foundation': [
    'foundation',
    'foundation belt'
  ],

  // The key 'white' maps to these possible inputs
  'white': [
    'white',
    'white belt'
  ],

  // The key 'gray' maps to these possible inputs
  'gray': [
    'gray',
    'gray belt'
  ],

  // The key 'orange' maps to these possible inputs
  'orange': [
    'orange',
    'orange belt'
  ],

  // The key 'yellow' maps to these possible inputs
  'yellow': [
    'yellow',
    'yellow belt'
  ],

  // The key 'green' maps to these possible inputs
  'green': [
    'green',
    'green belt'
  ],

  // The key 'red' maps to these possible inputs
  'red': [
    'red',
    'red belt'
  ],

  // The key 'blue' maps to these possible inputs
  'blue': [
    'blue',
    'blue belt'
  ],

  // The key 'black' maps to these possible inputs
  'black': [
    'black',
    'black belt'
  ]
};