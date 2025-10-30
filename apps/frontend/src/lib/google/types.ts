interface GeocoderParams {
   lat?: number;
   lng?: number;
   address?: string;
}

interface AddressComponent {
   long_name: string;
   short_name: string;
   types: string[];
}

interface Address {
   street?: string;
   street_number?: string;
   postal_code?: string;
   district?: string;
   city?: string;
   state_abbrev?: string;
   [key: string]: string | undefined;
}

interface GeocoderResult {
   address_components: AddressComponent[];
   formatted_address: string;
   geometry: {
      location: {
         lat: () => number;
         lng: () => number;
      };
   };
}

interface AddressResult {
   formatted_address: string;
   lat: number;
   lng: number;
   address: Address;
}

interface ComponentsMapsPinProps {
   onChangeCenter?: (address: AddressResult) => void;
   address?: {
      cep: string;
      street_name?: string;
      street_number?: string | number;
      city?: string;
      state?: string;
   };
   coords?: {
      lat: number;
      lng: number;
   };
}

interface ComponentsMapsPinRef {
   onChangeAddress: () => Promise<void>;
}

export type {
   GeocoderParams,
   AddressComponent,
   Address,
   GeocoderResult,
   AddressResult,
   ComponentsMapsPinProps,
   ComponentsMapsPinRef,
};
