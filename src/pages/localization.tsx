import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import styles from '../styles/LocalizationPage.module.css';

// Tipos
interface Location {
  lat: number;
  lng: number;
}

interface Alert {
  type: 'error' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface RouteInfo {
  distance: string;
  duration: string;
  steps: string[];
}

// Configurações do mapa
const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
};

// Coordenadas do CineMar Camocim
const cinemaLocation: Location = {
  lat: -2.9014,
  lng: -40.8419,
};

// Opções do mapa
const mapOptions = {
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
  gestureHandling: 'greedy',
  styles: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Configurações da API do Google Maps (FORA DO COMPONENTE para evitar recriação)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBEAYw7iWpGYCveYFt15AywHrhT0BJWrlU';
const LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];
const LANGUAGE = 'pt-BR';
const REGION = 'BR';

function LocalizationPage() {
  // Estados
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>(cinemaLocation);
  const [mapZoom, setMapZoom] = useState<number>(15);

  // Configurações da API do Google Maps (useMemo para evitar recriação)
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    language: LANGUAGE,
    region: REGION,
  });

  // Obter localização do usuário
  useEffect(() => {
    if (!isLoaded) return;

    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setAlert({
          type: 'error',
          title: 'Erro de geolocalização',
          message: 'Seu navegador não suporta geolocalização'
        });
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          setMapZoom(12);
          setIsLoading(false);
          
          setAlert({
            type: 'success',
            title: 'Localização obtida!',
            message: 'Sua localização foi detectada com sucesso.'
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setAlert({
            type: error.code === error.PERMISSION_DENIED ? 'warning' : 'error',
            title: 'Erro de localização',
            message: error.code === error.PERMISSION_DENIED 
              ? 'Permissão de localização negada. O mapa será centralizado no cinema.'
              : `Não foi possível obter sua localização.`
          });
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getUserLocation();
  }, [isLoaded]);

  // Calcular rota (useCallback para evitar recriação)
  const calculateRoute = useCallback(() => {
    if (!isLoaded || !userLocation) {
      setAlert({
        type: 'error',
        title: 'Erro no roteamento',
        message: 'Não foi possível calcular a rota. Verifique sua localização.'
      });
      return;
    }

    setIsLoading(true);
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: cinemaLocation,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        optimizeWaypoints: true,
        avoidTolls: false,
        avoidHighways: false,
      },
      (result, status) => {
        setIsLoading(false);
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          setAlert(null);
          
          // Extrair informações da rota
          const route = result.routes[0];
          const leg = route.legs[0];
          const steps = leg.steps.map((step: google.maps.DirectionsStep) => 
            step.instructions?.replace(/<[^>]*>/g, '') || step.instructions || ''
          ).filter(step => step.trim().length > 0);
          
          setRouteInfo({
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            steps: steps,
          });
          
          setAlert({
            type: 'success',
            title: 'Rota calculada!',
            message: `Rota encontrada: ${leg.distance?.text} em ${leg.duration?.text}`
          });
          
          // Ajustar o mapa para mostrar toda a rota
          if (result.routes[0]?.bounds) {
            const bounds = result.routes[0].bounds;
            const center = bounds.getCenter();
            setMapCenter({ lat: center.lat(), lng: center.lng() });
          }
        } else {
          console.error('Falha no cálculo da rota:', status);
          setAlert({
            type: 'error',
            title: 'Falha no roteamento',
            message: status === 'ZERO_RESULTS' 
              ? 'Nenhuma rota encontrada entre estes locais.'
              : `Não foi possível calcular a rota.`
          });
        }
      }
    );
  }, [isLoaded, userLocation]);

  // Renderizar alerta (useCallback para performance)
  const renderAlert = useCallback(() => {
    if (!alert) return null;

    const alertClasses = [
      styles.alert,
      alert.type === 'error' ? styles.alertError :
      alert.type === 'success' ? styles.alertSuccess :
      alert.type === 'info' ? styles.alertInfo :
      styles.alertWarning
    ].join(' ');

    const dismissAlert = () => setAlert(null);

    return (
      <div className={alertClasses} role="alert">
        <div className={styles.alertIcon}>
          {alert.type === 'error' ? '⚠️' :
           alert.type === 'success' ? '✅' :
           alert.type === 'info' ? 'ℹ️' : '⚠️'}
        </div>
        <div className={styles.alertContent}>
          <h4 className={styles.alertTitle}>{alert.title}</h4>
          <p className={styles.alertMessage}>{alert.message}</p>
        </div>
        <button 
          className={styles.alertClose}
          onClick={dismissAlert}
          aria-label="Fechar alerta"
        >
          ×
        </button>
      </div>
    );
  }, [alert]);

  // Se houver erro ao carregar a API
  if (loadError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>❌ Erro ao carregar o mapa</h2>
          <p>Não foi possível carregar o Google Maps. Verifique sua conexão com a internet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Localização</h1>
        <p className={styles.subtitle}>Encontre o caminho até nosso cinema</p>
      </header>

      <div className={styles.content}>
        {/* Mapa */}
        <div className={styles.mapContainer}>
          {!isLoaded ? (
            <div className={styles.mapLoading}>
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner} />
                <span className={styles.loadingText}>Carregando mapa...</span>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={mapZoom}
              options={mapOptions}
            >
              {/* Marcador do cinema */}
              <Marker
                position={cinemaLocation}
                title="CineMar Camocim"
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new google.maps.Size(40, 40),
                }}
                animation={google.maps.Animation.DROP}
              />

              {/* Marcador do usuário (se disponível) */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  title="Sua Localização"
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                  animation={google.maps.Animation.DROP}
                />
              )}

              {/* Rota (se calculada) */}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: '#b71c1c',
                      strokeWeight: 5,
                      strokeOpacity: 0.8,
                    },
                    suppressMarkers: false,
                  }}
                />
              )}
            </GoogleMap>
          )}
        </div>

        {/* Alertas */}
        {renderAlert()}

        {/* Informações e controles */}
        <div className={styles.controls}>
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h3>🎬 CineMar Camocim</h3>
              <div className={styles.addressInfo}>
                <p><strong>Endereço:</strong> R. Estados Unidos, 118 - Camocim, CE, 62400-000</p>
                <p><strong>Telefone:</strong> (88) 3621-0000</p>
                <p><strong>Horário:</strong> Segunda a Domingo: 14:00 - 23:00</p>
              </div>
            </div>

            <div className={styles.actionsSection}>
              <button
                className={`${styles.directionsButton} ${isLoading ? styles.buttonDisabled : ''}`}
                onClick={calculateRoute}
                disabled={!userLocation || !isLoaded || isLoading}
                aria-label="Calcular rota"
              >
                <span className={styles.buttonIcon}>📍</span>
                Calcular Rota
                {isLoading && <span className={styles.buttonSpinner} />}
              </button>

              {userLocation && (
                <div className={styles.userLocationInfo}>
                  <p><strong>Sua Localização:</strong></p>
                  <p>Lat: {userLocation.lat.toFixed(6)}</p>
                  <p>Lng: {userLocation.lng.toFixed(6)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informações da rota */}
          {routeInfo && (
            <div className={styles.routeInfo}>
              <h3 className={styles.routeInfoTitle}>Detalhes da Rota</h3>
              <div className={styles.routeInfoGrid}>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Distância</span>
                  <span className={styles.infoValue}>{routeInfo.distance}</span>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Duração</span>
                  <span className={styles.infoValue}>{routeInfo.duration}</span>
                </div>
              </div>
              
              {routeInfo.steps.length > 0 && (
                <div className={styles.stepsContainer}>
                  <h4>Instruções da Rota:</h4>
                  <ol className={styles.stepsList}>
                    {routeInfo.steps.map((step, index) => (
                      <li key={index} className={styles.stepItem}>
                        <span className={styles.stepNumber}>{index + 1}.</span>
                        <span className={styles.stepText}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Informações de como chegar */}
          <div className={styles.directionsInfo}>
            <h3>🚗 Como chegar ao cinema</h3>
            <div className={styles.directionsGrid}>
              <div className={styles.directionCard}>
                <h4>De Carro</h4>
                <ul>
                  <li>Siga pela BR-222 até Camocim</li>
                  <li>Entre na Rua Estados Unidos</li>
                  <li>Estamos no número 118</li>
                  <li>Estacionamento gratuito disponível</li>
                </ul>
              </div>
              
              <div className={styles.directionCard}>
                <h4>Transporte Público</h4>
                <ul>
                  <li>Linha 01 - Centro x Vila</li>
                  <li>Linha 02 - Guriú x Centro</li>
                  <li>Descer na Praça da Matriz</li>
                  <li>Caminhar 200m até o cinema</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocalizationPage;