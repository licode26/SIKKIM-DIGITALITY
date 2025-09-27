import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SparklesIcon, SpinnerIcon, MapIcon, MapPinIcon, CrosshairIcon } from './Icons';

interface Waypoint {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

interface Route {
  routeName: string;
  description: string;
  waypoints: Waypoint[];
}

interface PlottableWaypoint extends Waypoint {
  x: number;
  y: number;
}

const InteractiveMap: React.FC = () => {
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<PlottableWaypoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isCentering, setIsCentering] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  const generateRoutes = async () => {
    setIsLoading(true);
    setError(null);
    setRoutes(null);
    setSelectedRoute(null);
    setActiveWaypoint(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = "Generate 3 diverse and scenic routes in Sikkim, suitable for tourists. For each route, provide a name, a brief description, and a list of 4-5 key waypoints with their name, a short description, and approximate latitude/longitude coordinates.";
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              routes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    routeName: { type: Type.STRING },
                    description: { type: Type.STRING },
                    waypoints: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          description: { type: Type.STRING },
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const jsonResponse = JSON.parse(response.text);

      if (jsonResponse.routes && jsonResponse.routes.length > 0) {
        setRoutes(jsonResponse.routes);
        setSelectedRoute(jsonResponse.routes[0]);
      } else {
        setError("The AI couldn't generate routes at this time. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while generating routes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const normalizeCoordinates = (waypoints: Waypoint[], userLoc: { lat: number; lng: number } | null): { plottableWaypoints: PlottableWaypoint[], plottableUserLocation: { x: number; y: number } | null } => {
    const allPoints = [...waypoints];
    if (userLoc) {
      allPoints.push({ name: 'user', description: 'Your location', ...userLoc });
    }
    
    if (allPoints.length === 0) {
      return { plottableWaypoints: [], plottableUserLocation: null };
    }

    const latitudes = allPoints.map(p => p.lat);
    const longitudes = allPoints.map(p => p.lng);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const PADDING = 20;
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 400;

    const getCoords = (lat: number, lng: number) => ({
      x: PADDING + ((lng - minLng) / lngRange) * (SVG_WIDTH - 2 * PADDING),
      y: (SVG_HEIGHT - PADDING) - ((lat - minLat) / latRange) * (SVG_HEIGHT - 2 * PADDING),
    });

    const plottableWaypoints = waypoints.map(wp => ({
      ...wp,
      ...getCoords(wp.lat, wp.lng),
    }));

    const plottableUserLocation = userLoc ? getCoords(userLoc.lat, userLoc.lng) : null;

    return { plottableWaypoints, plottableUserLocation };
  };

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route);
    setActiveWaypoint(null);
  };
  
  const handleCenterOnUser = () => {
    setIsCentering(true);
    setGeolocationError(null);
    setActiveWaypoint(null);

    if (!navigator.geolocation) {
      setGeolocationError("Geolocation is not supported by your browser.");
      setIsCentering(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsCentering(false);
      },
      () => {
        setGeolocationError("Unable to retrieve your location. Please enable location services.");
        setIsCentering(false);
      }
    );
  };

  const { plottableWaypoints, plottableUserLocation } = selectedRoute ? normalizeCoordinates(selectedRoute.waypoints, userLocation) : { plottableWaypoints: [], plottableUserLocation: null };
  const pathData = plottableWaypoints.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');


  return (
    <div className="animate-fade-in">
      <section className="py-20 sm:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Interactive Scenic Map</h1>
            <p className="mt-4 text-lg text-brand-text-secondary">
              Discover Sikkim's hidden gems. Let our AI generate personalized, scenic routes for your adventure, complete with points of interest and stunning viewpoints.
            </p>
            <div className="mt-8">
              <button
                onClick={generateRoutes}
                disabled={isLoading}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 text-base font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 disabled:bg-brand-light-gray disabled:cursor-not-allowed"
              >
                {isLoading ? <SpinnerIcon /> : <SparklesIcon />}
                <span>{isLoading ? 'Generating Routes...' : 'Generate AI Scenic Routes'}</span>
              </button>
            </div>
          </div>

          <div className="mt-16">
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-gray/50 rounded-xl">
                <SpinnerIcon />
                <p className="mt-4 text-brand-text-secondary">AI is charting the best paths for you...</p>
              </div>
            )}
            {error && <p className="mt-6 text-center text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</p>}
            
            {!isLoading && !routes && !error && (
                <div className="flex flex-col items-center justify-center text-center p-16 bg-brand-gray/30 rounded-xl border-2 border-dashed border-brand-light-gray/50">
                    <MapIcon />
                    <p className="mt-4 text-brand-text-secondary">Your generated routes will appear here.</p>
                    <p className="text-sm text-brand-text-secondary/70">Click the button above to start.</p>
                </div>
            )}

            {routes && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-brand-gray/50 border border-brand-light-gray/20 rounded-xl p-6 h-fit">
                  <h2 className="text-xl font-bold text-white mb-4">Generated Routes</h2>
                  <div className="space-y-3">
                    {routes.map((route, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectRoute(route)}
                        className={`w-full text-left p-4 rounded-lg transition-colors border-2 ${selectedRoute?.routeName === route.routeName ? 'bg-brand-teal/10 border-brand-teal' : 'bg-brand-gray border-brand-light-gray hover:border-brand-light-gray/50'}`}
                      >
                        <h3 className="font-semibold text-brand-text">{route.routeName}</h3>
                        <p className="text-sm text-brand-text-secondary mt-1">{route.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-brand-gray/50 border border-brand-light-gray/20 rounded-xl p-6">
                  {selectedRoute ? (
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedRoute.routeName}</h2>
                      <p className="mt-2 text-brand-text-secondary">{selectedRoute.description}</p>
                      
                      <div className="mt-6 aspect-[5/4] bg-brand-dark rounded-lg p-2 border border-brand-light-gray/50 relative overflow-hidden">
                        <button
                          onClick={handleCenterOnUser}
                          className="absolute top-2 right-2 z-10 p-2 bg-brand-dark/70 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors"
                          aria-label="Center on my location"
                          disabled={isCentering}
                        >
                          {isCentering ? <SpinnerIcon /> : <CrosshairIcon />}
                        </button>
                        <svg viewBox="0 0 500 400" className="w-full h-full cursor-pointer" onClick={() => setActiveWaypoint(null)}>
                           <path d={pathData} fill="none" stroke="rgba(45, 212, 191, 0.4)" strokeWidth="2" strokeDasharray="4" style={{ pointerEvents: 'none' }} />
                           {plottableWaypoints.map((wp, index) => (
                             <g 
                                key={index} 
                                className="cursor-pointer" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveWaypoint(wp === activeWaypoint ? null : wp);
                                }}
                             >
                               <circle cx={wp.x} cy={wp.y} r="12" fill="transparent" />
                               <circle cx={wp.x} cy={wp.y} r="8" fill={activeWaypoint?.name === wp.name ? '#14B8A6' : 'rgba(30, 41, 59, 0.8)'} stroke="#2DD4BF" strokeWidth="2" className="transition-all" />
                               <circle cx={wp.x} cy={wp.y} r="4" fill={activeWaypoint?.name === wp.name ? '#E2E8F0' : '#2DD4BF'} className="transition-all" />
                             </g>
                           ))}
                           {activeWaypoint && (
                                <foreignObject 
                                    x={Math.min(activeWaypoint.x + 12, 500 - 180)}
                                    y={Math.max(10, activeWaypoint.y - 80)}
                                    width="170" 
                                    height="75"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <div xmlns="http://www.w3.org/1999/xhtml" 
                                         className="bg-brand-dark p-2 rounded-md shadow-lg border border-brand-light-gray/50 text-xs animate-fade-in">
                                        <h4 className="font-bold text-white mb-1 truncate">{activeWaypoint.name}</h4>
                                        <p className="text-brand-text-secondary leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {activeWaypoint.description}
                                        </p>
                                    </div>
                                </foreignObject>
                           )}
                           {plottableUserLocation && (
                              <g className="pointer-events-none">
                                <circle cx={plottableUserLocation.x} cy={plottableUserLocation.y} r="8" fill="rgba(59, 130, 246, 0.3)">
                                  <animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                                </circle>
                                <circle cx={plottableUserLocation.x} cy={plottableUserLocation.y} r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
                              </g>
                           )}
                        </svg>
                      </div>
                      {geolocationError && <p className="mt-2 text-center text-sm text-yellow-400">{geolocationError}</p>}

                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Waypoints</h3>
                        <ul className="space-y-3">
                          {selectedRoute.waypoints.map((wp, index) => (
                            <li key={index} className="flex items-start space-x-3 p-3 bg-brand-dark/50 rounded-md">
                               <div className="mt-1 text-brand-teal"><MapPinIcon /></div>
                               <div>
                                 <h4 className="font-semibold text-brand-text">{wp.name}</h4>
                                 <p className="text-sm text-brand-text-secondary">{wp.description}</p>
                               </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-brand-text-secondary">Select a route to see details.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteractiveMap;