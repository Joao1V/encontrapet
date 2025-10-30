'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Input, type InputProps, Skeleton } from '@heroui/react';

import { Autocomplete, type Libraries, LoadScriptNext } from '@react-google-maps/api';
import { Search } from 'lucide-react';

// Interfaces para tipagem
type Place = {
   lat: number;
   lng: number;
   fullLocation: string;
   street: string;
   district: string;
   city: string;
   state: string;
};
type GoogleAutocompleteProps = Omit<InputProps, 'onValueChange' | 'value' | 'onSelect'> & {
   onSelect?: (place: Place) => void;
   onClear?: () => void;
   showIcon?: boolean;
   defaultValue?: string;
   placeholder?: string;
};

const libraries: Libraries = ['places'];

const isCoordinate = (text: string): { lat: number; lng: number } | null => {
   const coordRegex = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;
   const match = text.match(coordRegex);

   if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);

      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
         return { lat, lng };
      }
   }

   return null;
};

export const GoogleAutocomplete: React.FC<GoogleAutocompleteProps> = ({
   showIcon = false,
   defaultValue,
   placeholder,
   onSelect,
   onClear,
   ...inputProps
}) => {
   const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
   const [text, setText] = useState<string>(defaultValue || '');

   const handleLoad = (autocompleteInstance: google.maps.places.Autocomplete): void => {
      autocompleteInstance.addListener('place_changed', () => {
         handlePlaceChanged();
      });

      setAutocomplete(autocompleteInstance);
   };

   const handlePlaceChanged = (): void => {
      if (autocomplete) {
         const place = autocomplete.getPlace();

         // Extrair componentes do endereço
         let street = '';
         let district = '';
         let city = '';
         let state = '';

         if (place.address_components) {
            for (const component of place.address_components) {
               const types = component.types;

               if (types.includes('route')) {
                  street = component.long_name;
               }
               if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
                  district = component.long_name;
               }
               if (types.includes('administrative_area_level_2')) {
                  city = component.long_name;
               }
               if (types.includes('administrative_area_level_1')) {
                  state = component.short_name;
               }
            }
         }

         const lat = place.geometry?.location?.lat();
         const lng = place.geometry?.location?.lng();
         const fullLocation = place.formatted_address;

         if (onSelect && lat !== undefined && lng !== undefined && fullLocation) {
            onSelect({
               lat,
               lng,
               fullLocation,
               street,
               district,
               city,
               state,
            });
         }
         setText(fullLocation || '');
      }
   };

   // Função para buscar endereço por coordenadas (Reverse Geocoding)
   const reverseGeocode = async (lat: number, lng: number) => {
      if (!window.google || !window.google.maps) {
         console.error('Google Maps API não carregada');
         return;
      }

      const geocoder = new window.google.maps.Geocoder();
      const latlng = new window.google.maps.LatLng(lat, lng);

      try {
         const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoder.geocode({ location: latlng }, (results, status) => {
               if (status === 'OK' && results) {
                  resolve(results);
               } else {
                  reject(new Error(`Geocoding failed: ${status}`));
               }
            });
         });

         if (result && result.length > 0) {
            const address = result[0].formatted_address;

            // Extrair componentes do endereço
            let street = '';
            let district = '';
            let city = '';
            let state = '';

            if (result[0].address_components) {
               for (const component of result[0].address_components) {
                  const types = component.types;

                  if (types.includes('route')) {
                     street = component.long_name;
                  }
                  if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
                     district = component.long_name;
                  }
                  if (types.includes('administrative_area_level_2')) {
                     city = component.long_name;
                  }
                  if (types.includes('administrative_area_level_1')) {
                     state = component.short_name;
                  }
               }
            }

            // Chamar onSelect com as informações da coordenada
            if (onSelect && address) {
               onSelect({
                  lat,
                  lng,
                  fullLocation: address,
                  street,
                  district,
                  city,
                  state,
               });
            }
         } else {
            // Se não encontrou endereço, usar apenas as coordenadas
            const coordText = `${lat}, ${lng}`;
            setText(coordText);

            if (onSelect) {
               onSelect({
                  lat,
                  lng,
                  fullLocation: coordText,
                  street: '',
                  district: '',
                  city: '',
                  state: '',
               });
            }
         }
      } catch (error) {
         console.error('Erro no reverse geocoding:', error);

         // Em caso de erro, usar apenas as coordenadas
         const coordText = `${lat}, ${lng}`;
         setText(coordText);

         if (onSelect) {
            onSelect({
               lat,
               lng,
               fullLocation: coordText,
               street: '',
               district: '',
               city: '',
               state: '',
            });
         }
      }
   };

   // Função para processar mudanças no input
   const handleInputChange = (value: string) => {
      setText(value);

      // Verificar se o valor é uma coordenada
      const coords = isCoordinate(value);

      if (coords) {
         // É uma coordenada, fazer reverse geocoding
         reverseGeocode(coords.lat, coords.lng);
      }
   };

   // Efeito para processar defaultValue se for uma coordenada

   useEffect(() => {
      if (defaultValue) {
         const coords = isCoordinate(defaultValue);
         if (coords) {
            // Aguardar a API do Google Maps carregar
            const checkGoogleMaps = setInterval(() => {
               if (window.google?.maps) {
                  clearInterval(checkGoogleMaps);
                  reverseGeocode(coords.lat, coords.lng);
               }
            }, 100);

            // Timeout para evitar loop infinito
            setTimeout(() => {
               clearInterval(checkGoogleMaps);
            }, 5000);
         }
      }
   }, [defaultValue]);

   return (
      <LoadScriptNext
         loadingElement={<Skeleton className="h-8 rounded-lg" />}
         googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
         libraries={libraries}
         language={'pt-BR'}
         onError={() => <div>Erro ao carregar, recarregue a página</div>}
      >
         <Autocomplete
            onLoad={handleLoad}
            options={{
               componentRestrictions: {
                  country: 'br',
               },
               fields: ['formatted_address', 'geometry', 'address_components'],
            }}
            onPlaceChanged={handlePlaceChanged}
         >
            <Input
               radius={'sm'}
               isClearable
               onClear={onClear}
               startContent={showIcon ? <Search className={'h-5 w-5'} /> : undefined}
               placeholder={placeholder || 'Digite um endereço ou coordenadas (lat, lng)'}
               value={text}
               {...inputProps}
               onValueChange={handleInputChange}
            />
         </Autocomplete>
      </LoadScriptNext>
   );
};
export default GoogleAutocomplete;
