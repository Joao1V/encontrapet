import { GOOGLE_COMPONENTS_FILTER } from './constants';
import type {
   Address,
   AddressComponent,
   AddressResult,
   GeocoderParams,
   GeocoderResult,
} from './types';

const generateAddressFromComponents = (address_components: AddressComponent[]): Address => {
   return address_components.reduce<Address>((acc, comp) => {
      GOOGLE_COMPONENTS_FILTER.forEach(({ type, accessor, isLongName }) => {
         if (comp.types.includes(type)) {
            acc[accessor] = isLongName ? comp.long_name : comp.short_name;
         }
      });
      return acc;
   }, {});
};

const getAddress = async ({ lat, lng, address }: GeocoderParams): Promise<AddressResult> => {
   if (!window.google?.maps?.Geocoder) {
      throw new Error('Google Maps API não carregada');
   }

   const geocoder = new window.google.maps.Geocoder();

   try {
      const request: google.maps.GeocoderRequest = {};
      if (lat && lng) {
         request.location = { lat, lng };
      }
      if (address) {
         request.address = address;
      }

      const results = await new Promise<GeocoderResult[]>((resolve, reject) => {
         geocoder.geocode(request, (results, status) => {
            if (status === 'OK' && results) {
               resolve(results);
            } else {
               reject(new Error(`Geocoder falhou: ${status}`));
            }
         });
      });

      if (!results?.length) {
         throw new Error('Nenhum resultado encontrado');
      }

      const {
         address_components,
         formatted_address,
         geometry: { location },
      } = results[0];

      const structuredAddress = generateAddressFromComponents(address_components);

      return {
         formatted_address,
         lat: location.lat(),
         lng: location.lng(),
         address: structuredAddress,
      };
   } catch (error: any) {
      throw new Error(error?.message || 'Ocorreu um erro ao buscar o endereço');
   }
};

export { getAddress };
