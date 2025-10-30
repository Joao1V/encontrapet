const DEFAULT_CENTER: google.maps.LatLngLiteral = {
   lat: -8.76077,
   lng: -63.90393,
};

const MAP_CONTAINER_STYLE = {
   height: '100%',
   borderRadius: '5px',
   minHeight: 400,
};

const MAP_STYLES: google.maps.MapTypeStyle[] = [
   {
      featureType: 'poi', // Points of interest
      stylers: [{ visibility: 'simplified' }],
   },
   {
      featureType: 'transit', // Transit stations/lines
      stylers: [{ visibility: 'off' }],
   },
   {
      featureType: 'road', // Hide road landmarks
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
   },
   {
      featureType: 'landscape.man_made', // Man-made structures including buildings
      stylers: [{ visibility: 'off' }],
   },
   {
      featureType: 'landscape', // General landscape features
      elementType: 'geometry',
      stylers: [{ visibility: 'simplified' }],
   },
];

const GOOGLE_COMPONENTS_FILTER = [
   {
      type: 'route',
      accessor: 'street',
      isLongName: true,
   },
   {
      type: 'street_number',
      accessor: 'street_number',
   },
   {
      type: 'postal_code',
      accessor: 'postal_code',
   },
   {
      type: 'sublocality',
      accessor: 'district',
   },
   {
      type: 'locality',
      accessor: 'city',
   },
   {
      type: 'administrative_area_level_1',
      accessor: 'state_abbrev',
   },
];

export { DEFAULT_CENTER, MAP_CONTAINER_STYLE, MAP_STYLES, GOOGLE_COMPONENTS_FILTER };
