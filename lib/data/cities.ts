import { HostCity } from '../types';

export const HOST_CITIES: HostCity[] = [
  {
    name: 'Mexico City (CDMX)',
    country: 'Mexico',
    coordinates: {
      lat: 19.4326,
      lng: -99.1332,
    },
    description:
      'The vibrant capital with world-class dining, historic sites, and modern infrastructure. Home to multiple stadiums and the heart of Mexican culture.',
  },
  {
    name: 'Guadalajara',
    country: 'Mexico',
    coordinates: {
      lat: 20.6597,
      lng: -103.3496,
    },
    description:
      'Known as the "Pearl of the West," Guadalajara offers traditional Mexican charm, tequila culture, and passionate football fans.',
  },
  {
    name: 'Monterrey',
    country: 'Mexico',
    coordinates: {
      lat: 25.6866,
      lng: -100.3161,
    },
    description:
      'A modern industrial hub surrounded by mountains, known for its business culture, excellent cuisine, and strong football tradition.',
  },
];

export function getCityByName(name: string): HostCity | undefined {
  return HOST_CITIES.find((city) => city.name.toLowerCase() === name.toLowerCase());
}
