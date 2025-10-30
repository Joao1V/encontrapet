import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import pinGoogle from '../assets/pin-google.png';
import { DEFAULT_CENTER, MAP_CONTAINER_STYLE, MAP_STYLES } from '../constants';
import { getAddress } from '../helpers';
import type { ComponentsMapsPinProps, ComponentsMapsPinRef } from '../types';

const GoogleMaps = forwardRef<ComponentsMapsPinRef, ComponentsMapsPinProps>((props, ref) => {
   const { onChangeCenter, address, coords } = props;

   // Estado
   const [currentCenter, setCurrentCenter] = useState<google.maps.LatLngLiteral>(
      coords ? coords : DEFAULT_CENTER,
   );
   const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
   const [zoom, setZoom] = useState<number>(coords ? 17 : 12);
   const [isFetching, setIsFetching] = useState<boolean>(false);

   // Refs
   const mapRef = useRef<google.maps.Map | null>(null);

   /**
    * Verifica a permissão de geolocalização
    */
   const checkGeolocationPermission = useCallback(async (): Promise<string | undefined> => {
      if (navigator.permissions) {
         try {
            const permissionStatus = await navigator.permissions.query({
               name: 'geolocation' as PermissionName,
            });
            return permissionStatus.state;
         } catch (error) {
            console.error('Erro ao verificar permissão de geolocalização', error);
            return undefined;
         }
      }
      return undefined;
   }, []);

   /**
    * Utiliza a localização atual do usuário
    */
   const handleUseCurrentLocation = useCallback(
      async (type?: string): Promise<void> => {
         try {
            const permission = await checkGeolocationPermission();

            if (permission === 'denied' && type !== 'first-loading') {
               console.error('Permissão de geolocalização negada');
               // Implementar notificação aqui
               return;
            }

            if (!navigator.geolocation) {
               console.error('Geolocalização não é suportada por este navegador');
               return;
            }

            if (type !== 'first-loading') setLoading(true);

            navigator.geolocation.getCurrentPosition(
               (position) => {
                  const location: google.maps.LatLngLiteral = {
                     lat: position.coords.latitude,
                     lng: position.coords.longitude,
                  };
                  setCurrentCenter(location);
                  setUserLocation(location);
                  setShowConfirmButton(true);
                  setLoading(false);
               },
               (error) => {
                  console.error('Erro ao obter localização do usuário', error);
                  setLoading(false);
                  // Implementar notificação de erro aqui
               },
               { timeout: 10000, enableHighAccuracy: true },
            );
         } catch (error) {
            setLoading(false);
            console.error('Erro ao acessar geolocalização', error);
            // Implementar notificação de erro aqui
         }
      },
      [checkGeolocationPermission],
   );

   /**
    * Obtém o centro atual do mapa e busca o endereço
    */
   const onGetCenter = useCallback(async (): Promise<void> => {
      if (!mapRef.current) return;

      const newCenter = mapRef.current.getCenter();
      if (!newCenter) return;

      const location: google.maps.LatLngLiteral = {
         lat: newCenter.lat(),
         lng: newCenter.lng(),
      };

      try {
         setIsFetching(true);
         setShowConfirmButton(false);

         const addressResult = await getAddress({ lat: location.lat, lng: location.lng });

         if (onChangeCenter) {
            onChangeCenter(addressResult);
         }
      } catch (error) {
         console.error('Erro ao obter endereço:', error);
         // Implementar notificação de erro aqui
      } finally {
         setIsFetching(false);
      }
   }, [onChangeCenter]);

   /**
    * Busca endereço a partir do texto fornecido
    */
   const onMapLoaded = useCallback(async (): Promise<void> => {
      if (!address?.street_name || !address?.cep) return;

      try {
         const addressParts = [
            address.street_name,
            address.street_number,
            address.city,
            address.state,
            address.cep,
         ]
            .filter(Boolean)
            .join(', ');

         const fullAddress = addressParts.replace(/, ([^,]*)$/, ' $1');

         const res = await getAddress({ address: fullAddress });

         console.log(fullAddress);
         if (onChangeCenter) {
            onChangeCenter(res);
         }

         const { lat, lng } = res;
         console.log(lat, lng);
         setCurrentCenter({ lat, lng });
         setZoom(16);
      } catch (error) {
         console.error('Erro ao carregar endereço:', error);
      }
   }, [address, onChangeCenter]);

   // Expõe métodos para o componente pai
   useImperativeHandle(ref, () => ({
      onChangeAddress: onMapLoaded,
   }));

   return (
      <div className="position-relative w-100">
         <LoadScriptNext
            loadingElement={<div className={'skeleton h-300px'}></div>}
            language={'pt-BR'}
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={['places']}
         >
            <GoogleMap
               mapContainerStyle={MAP_CONTAINER_STYLE}
               center={currentCenter}
               zoom={zoom}
               options={{
                  minZoom: 6,
                  maxZoom: 18,
                  mapTypeId: 'roadmap',
                  mapTypeControl: false,
                  fullscreenControl: false,
                  streetViewControl: false,
                  styles: MAP_STYLES,
                  gestureHandling: 'cooperative',
                  zoomControl: true,
               }}
               onDragEnd={() => {
                  if (!showConfirmButton) {
                     setShowConfirmButton(true);
                  }
               }}
               onLoad={async (map) => {
                  console.log(coords);
                  mapRef.current = map;
                  if (coords?.lng && coords?.lat) return;
                  console.log('Tem que buscar!');
                  await onMapLoaded();
               }}
            >
               {/* Overlay de carregamento */}
               {loading && (
                  <div
                     className="position-absolute d-flex inset-0 h-100 w-100 flex-center bg-dark bg-opacity-50"
                     style={{ zIndex: 100 }}
                     aria-live="polite"
                     aria-atomic="true"
                  >
                     <div className="d-flex flex-center flex-column gap-2 rounded-2 bg-body p-3 px-5">
                        {/*<Spinner aria-label="Carregando..." />*/}
                        <h5 className="mb-0">Aguarde...</h5>
                     </div>
                  </div>
               )}

               {/* Pin central fixo */}
               <div
                  style={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -100%)',
                     zIndex: 2,
                  }}
                  aria-hidden="true"
               >
                  <img src={pinGoogle} className="object-fit-contain" alt="Marcador no mapa" />
               </div>

               {/* Botão de localização atual */}
               <div
                  className="d-flex justify-content-end position-absolute align-self-start"
                  style={{ zIndex: 2, inset: 0, marginTop: 24, marginRight: 10 }}
               >
                  <button
                     type="button"
                     disabled={loading}
                     className="btn-focus d-flex fw-bold flex-center gap-1"
                     onClick={() => handleUseCurrentLocation()}
                     aria-label="Usar minha localização atual"
                  >
                     {/*<KTIcon name={'focus'} className={'fs-1'} />*/}
                  </button>
               </div>

               {/* Botão de confirmação */}
               {showConfirmButton && (
                  <div
                     style={{
                        position: 'absolute',
                        bottom: 24,
                        left: '50%',
                        transform: 'translate(-50%, 0%)',
                        zIndex: 2,
                     }}
                  >
                     <button
                        type="button"
                        disabled={isFetching}
                        className="btn btn-sm btn-dark d-flex fs-6 fw-bold flex-center gap-2 rounded-pill"
                        onClick={onGetCenter}
                        aria-label="Confirmar localização"
                     >
                        {isFetching ? (
                           <div>Loading...</div>
                        ) : (
                           <img
                              className="object-fit-contain"
                              src={pinGoogle}
                              width={13}
                              height={24}
                              alt=""
                              aria-hidden="true"
                           />
                        )}
                        Confirmar localização
                     </button>
                  </div>
               )}

               {/* Marcador da localização do usuário */}
               {userLocation && (
                  <Marker
                     position={userLocation}
                     icon={{
                        path: 'M 0, 0 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0',
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: 'white',
                        scale: 1,
                     }}
                     title="Sua localização atual"
                  />
               )}
            </GoogleMap>
         </LoadScriptNext>
      </div>
   );
});

GoogleMaps.displayName = 'GoogleMaps';

export default React.memo(GoogleMaps);
