export interface CropPrice {
  name: string;
  price: number;
  unit: string;
  change: number;
  emoji: string;
}

export interface Listing {
  id: string;
  crop: { id: string; name: string; category: string; unit: string; cropUrl: string };
  farmer: { userId: string; fullName: string; phone: string };
  farmerId: string;
  location: string;
  pricePerUnit: string;
  quantityAvailable: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface AIInsight {
  title: string;
  body: string;
}

export interface WeatherData {
  location: { name: string; region: string };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    condition: { text: string; icon: string; code: number };
    uv: number;
  };
  forecast: {
    forecastday: {
      date: string;
      maxtemp_c: number;
      mintemp_c: number;
      condition: { text: string; icon: string; code: number };
      daily_chance_of_rain: number;
    }[];
  };
}

export interface DiseaseResult {
  label: string;
  score: number;
}

export const KENYAN_CROPS: CropPrice[] = [
  { name: "Maize",       price: 4200, unit: "90kg bag", change: 3.2,   emoji: "🌽" },
  { name: "Tomatoes",    price: 80,   unit: "kg",       change: -5.1,  emoji: "🍅" },
  { name: "Potatoes",    price: 55,   unit: "kg",       change: 1.8,   emoji: "🥔" },
  { name: "Beans",       price: 150,  unit: "kg",       change: 7.4,   emoji: "🫘" },
  { name: "Kale (Sukuma)", price: 30, unit: "bunch",    change: -2.3,  emoji: "🥬" },
  { name: "Avocado",     price: 25,   unit: "piece",    change: 12.0,  emoji: "🥑" },
  { name: "Bananas",     price: 200,  unit: "bunch",    change: -1.5,  emoji: "🍌" },
  { name: "Onions",      price: 90,   unit: "kg",       change: 4.6,   emoji: "🧅" },
];

export const CROP_EMOJIS: Record<string, string> = {
  Maize: "🌽", Tomatoes: "🍅", Potatoes: "🥔", Beans: "🫘",
  Kale: "🥬", Avocado: "🥑", Bananas: "🍌", Onions: "🧅",
  Rice: "🌾", Wheat: "🌾", Mango: "🥭", Pineapple: "🍍",
  Cabbage: "🥦", Carrots: "🥕", Spinach: "🌿", default: "🌱",
};

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const SHORT_MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export const PLANTING_CALENDAR: Record<string, number[]> = {
  Maize:    [2, 3, 9, 10],
  Tomatoes: [1, 2, 6, 7],
  Beans:    [2, 3, 9, 10],
  Potatoes: [2, 3, 8, 9],
  Kale:     [0,1,2,3,4,5,6,7,8,9,10,11],
  Onions:   [1, 2, 9, 10],
};

export const GROWING_TIPS = [
  { crop: "Maize",    tip: "Plant at the onset of long rains. Space 75cm between rows.",                          icon: "🌽" },
  { crop: "Tomatoes", tip: "Stake plants early. Water consistently to prevent blossom end rot.",                  icon: "🍅" },
  { crop: "Beans",    tip: "Inoculate seeds with rhizobium before planting to boost nitrogen fixation.",          icon: "🫘" },
  { crop: "Potatoes", tip: "Use certified seeds. Hill up soil around plants as they grow.",                       icon: "🥔" },
];

export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
export const HF_API_KEY      = import.meta.env.VITE_HF_API_KEY as string;