import { useState, useEffect, useCallback } from "react";

const LOCATION_KEY = "practice-planner-location";

interface GeoResult {
  latitude: number;
  longitude: number;
  name: string;
  admin1?: string;
  country?: string;
}

interface WeatherData {
  locationLabel: string;
  temperature: number; // Fahrenheit
  windSpeed: number; // mph
  humidity: number;
  precipitation: number; // mm
  weatherCode: number;
  dailyMax: number;
  dailyMin: number;
  dailyPrecipProb: number;
  dailyWindMax: number;
}

interface WeatherSuggestion {
  icon: string;
  text: string;
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function getWeatherDescription(code: number): string {
  return WMO_DESCRIPTIONS[code] || "Unknown";
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return "\u2600\uFE0F";
  if (code <= 2) return "\u26C5";
  if (code === 3) return "\u2601\uFE0F";
  if (code <= 48) return "\uD83C\uDF2B\uFE0F";
  if (code <= 57) return "\uD83C\uDF27\uFE0F";
  if (code <= 67) return "\uD83C\uDF27\uFE0F";
  if (code <= 77) return "\u2744\uFE0F";
  if (code <= 82) return "\uD83C\uDF26\uFE0F";
  if (code <= 86) return "\uD83C\uDF28\uFE0F";
  return "\u26C8\uFE0F";
}

function getCoachingSuggestions(weather: WeatherData): WeatherSuggestion[] {
  const suggestions: WeatherSuggestion[] = [];

  // Hot conditions
  if (weather.temperature >= 85 || weather.dailyMax >= 90) {
    suggestions.push({
      icon: "\uD83E\uDD75",
      text: "Hot conditions: shorten conditioning, add extra water breaks every 15 min, consider moving drills to shaded areas",
    });
  }

  // Cold conditions
  if (weather.temperature <= 45 || weather.dailyMin <= 40) {
    suggestions.push({
      icon: "\uD83E\uDD76",
      text: "Cold conditions: extend dynamic warm-up by 5-10 min, keep players moving between drills, have layers available",
    });
  }

  // Wind
  if (weather.windSpeed >= 15 || weather.dailyWindMax >= 20) {
    suggestions.push({
      icon: "\uD83D\uDCA8",
      text: "Windy conditions: de-emphasize break throws and hucks, focus on short/mid-range throws, adjust scrimmage to play into/with the wind",
    });
  }

  // Rain
  if (
    weather.precipitation > 0 ||
    weather.dailyPrecipProb >= 60 ||
    (weather.weatherCode >= 51 && weather.weatherCode <= 67) ||
    (weather.weatherCode >= 80 && weather.weatherCode <= 82)
  ) {
    suggestions.push({
      icon: "\uD83C\uDF27\uFE0F",
      text: "Rain expected: shorter explanation blocks, keep players moving, bring extra discs (wet discs are slippery), emphasize grip adjustments",
    });
  }

  // Thunderstorm
  if (weather.weatherCode >= 95) {
    suggestions.push({
      icon: "\u26A0\uFE0F",
      text: "Thunderstorm risk: have an indoor backup plan, monitor conditions, be ready to pull players off the field immediately",
    });
  }

  return suggestions;
}

function loadSavedLocation(): string {
  try {
    return localStorage.getItem(LOCATION_KEY) || "";
  } catch {
    return "";
  }
}

function saveLocation(location: string): void {
  try {
    localStorage.setItem(LOCATION_KEY, location);
  } catch {
    // ignore
  }
}

export default function WeatherInfo() {
  const [location, setLocation] = useState(loadSavedLocation);
  const [inputValue, setInputValue] = useState(location);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (loc: string) => {
    if (!loc.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Geocode
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc.trim())}&count=1&language=en`
      );
      if (!geoRes.ok) throw new Error("Geocoding failed");
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("Location not found. Try a city name like 'Salt Lake City'.");
        setLoading(false);
        return;
      }

      const geo: GeoResult = geoData.results[0];

      // Step 2: Fetch weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=1`
      );
      if (!weatherRes.ok) throw new Error("Weather fetch failed");
      const weatherData = await weatherRes.json();

      const locationLabel = [geo.name, geo.admin1, geo.country]
        .filter(Boolean)
        .join(", ");

      setWeather({
        locationLabel,
        temperature: Math.round(weatherData.current.temperature_2m),
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        humidity: Math.round(weatherData.current.relative_humidity_2m),
        precipitation: weatherData.current.precipitation,
        weatherCode: weatherData.current.weather_code,
        dailyMax: Math.round(weatherData.daily.temperature_2m_max[0]),
        dailyMin: Math.round(weatherData.daily.temperature_2m_min[0]),
        dailyPrecipProb: Math.round(
          weatherData.daily.precipitation_probability_max[0]
        ),
        dailyWindMax: Math.round(weatherData.daily.wind_speed_10m_max[0]),
      });
    } catch {
      setError("Could not load weather. Check location and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount if location is saved
  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = inputValue.trim();
    if (!loc) return;
    setLocation(loc);
    saveLocation(loc);
    fetchWeather(loc);
  };

  const suggestions = weather ? getCoachingSuggestions(weather) : [];

  return (
    <section className="weather-section">
      <h3>Practice Weather</h3>
      <form className="weather-location-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="weather-location-input"
          placeholder="Practice location (e.g. Salt Lake City)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="weather-fetch-btn" disabled={loading}>
          {loading ? "Loading..." : "Check Weather"}
        </button>
      </form>

      {error && <p className="weather-error">{error}</p>}

      {weather && (
        <div className="weather-display">
          <div className="weather-current">
            <div className="weather-main">
              <span className="weather-emoji">
                {getWeatherEmoji(weather.weatherCode)}
              </span>
              <div>
                <span className="weather-temp">{weather.temperature}°F</span>
                <span className="weather-desc">
                  {getWeatherDescription(weather.weatherCode)}
                </span>
              </div>
            </div>
            <div className="weather-details">
              <span>
                Wind: <strong>{weather.windSpeed} mph</strong>
              </span>
              <span>
                Humidity: <strong>{weather.humidity}%</strong>
              </span>
              <span>
                Rain chance: <strong>{weather.dailyPrecipProb}%</strong>
              </span>
              <span>
                Hi/Lo:{" "}
                <strong>
                  {weather.dailyMax}°/{weather.dailyMin}°
                </strong>
              </span>
            </div>
            <p className="weather-location-label">{weather.locationLabel}</p>
          </div>

          {suggestions.length > 0 && (
            <div className="weather-suggestions">
              <h4>Weather Adjustments</h4>
              {suggestions.map((s, i) => (
                <div key={i} className="weather-suggestion">
                  <span className="weather-suggestion-icon">{s.icon}</span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
