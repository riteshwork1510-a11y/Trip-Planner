export interface CityData {
  name: string;
  lat: number;
  lng: number;
}

export interface RegionData {
  name: string;
  cities: CityData[];
}

export interface CountryHierarchy {
  id: string;
  regionLabel: string;
  regions: RegionData[];
}

const EMPTY: CountryHierarchy = { id: "", regionLabel: "Regions", regions: [] };

function h(id: string, label: string, regions: RegionData[]): CountryHierarchy {
  return { id, regionLabel: label, regions };
}

const HIERARCHY: Record<string, CountryHierarchy> = {
  "356": h("356", "States and Union Territories", [
    { name: "Gujarat", cities: [{ name: "Ahmedabad", lat: 23.02, lng: 72.57 }, { name: "Surat", lat: 21.17, lng: 72.83 }, { name: "Vadodara", lat: 22.31, lng: 73.19 }, { name: "Rajkot", lat: 22.3, lng: 70.8 }, { name: "Junagadh", lat: 21.52, lng: 70.47 }, { name: "Dwarka", lat: 22.24, lng: 68.97 }, { name: "Somnath", lat: 20.89, lng: 70.4 }, { name: "Gandhinagar", lat: 23.22, lng: 72.63 }] },
    { name: "Maharashtra", cities: [{ name: "Mumbai", lat: 19.08, lng: 72.88 }, { name: "Pune", lat: 18.52, lng: 73.86 }, { name: "Nagpur", lat: 21.15, lng: 79.09 }, { name: "Nashik", lat: 19.99, lng: 73.79 }, { name: "Aurangabad", lat: 19.88, lng: 75.34 }, { name: "Lonavala", lat: 18.75, lng: 73.41 }, { name: "Alibag", lat: 18.64, lng: 72.87 }] },
    { name: "Rajasthan", cities: [{ name: "Jaipur", lat: 26.92, lng: 75.79 }, { name: "Udaipur", lat: 24.58, lng: 73.68 }, { name: "Jodhpur", lat: 26.24, lng: 73.02 }, { name: "Jaisalmer", lat: 26.92, lng: 70.9 }, { name: "Pushkar", lat: 26.49, lng: 74.55 }, { name: "Ajmer", lat: 26.45, lng: 74.64 }, { name: "Bikaner", lat: 28.02, lng: 73.31 }] },
    { name: "Kerala", cities: [{ name: "Kochi", lat: 9.93, lng: 76.27 }, { name: "Trivandrum", lat: 8.52, lng: 76.94 }, { name: "Munnar", lat: 10.09, lng: 77.06 }, { name: "Kozhikode", lat: 11.26, lng: 75.78 }, { name: "Alleppey", lat: 9.5, lng: 76.34 }, { name: "Thekkady", lat: 9.59, lng: 77.16 }] },
    { name: "Karnataka", cities: [{ name: "Bangalore", lat: 12.97, lng: 77.59 }, { name: "Mysore", lat: 12.3, lng: 76.66 }, { name: "Hampi", lat: 15.34, lng: 76.46 }, { name: "Goa", lat: 15.3, lng: 74.12 }, { name: "Coorg", lat: 12.42, lng: 75.74 }, { name: "Hubli", lat: 15.36, lng: 75.12 }] },
    { name: "Tamil Nadu", cities: [{ name: "Chennai", lat: 13.08, lng: 80.27 }, { name: "Madurai", lat: 9.93, lng: 78.12 }, { name: "Coimbatore", lat: 11.01, lng: 76.97 }, { name: "Ooty", lat: 11.41, lng: 76.7 }, { name: "Kodaikanal", lat: 10.24, lng: 77.49 }, { name: "Mahabalipuram", lat: 12.63, lng: 80.2 }] },
    { name: "West Bengal", cities: [{ name: "Kolkata", lat: 22.57, lng: 88.36 }, { name: "Darjeeling", lat: 27.04, lng: 88.26 }, { name: "Sundarbans", lat: 21.95, lng: 89.18 }, { name: "Shantiniketan", lat: 23.68, lng: 87.69 }] },
    { name: "Uttar Pradesh", cities: [{ name: "Agra", lat: 27.18, lng: 78.02 }, { name: "Varanasi", lat: 25.32, lng: 83.01 }, { name: "Lucknow", lat: 26.85, lng: 80.95 }, { name: "Mathura", lat: 27.49, lng: 77.67 }, { name: "Allahabad", lat: 25.44, lng: 81.85 }] },
    { name: "Himachal Pradesh", cities: [{ name: "Shimla", lat: 31.1, lng: 77.17 }, { name: "Manali", lat: 32.24, lng: 77.19 }, { name: "Dharamsala", lat: 32.22, lng: 76.32 }, { name: "Kullu", lat: 31.96, lng: 77.11 }] },
    { name: "Goa", cities: [{ name: "Panaji", lat: 15.5, lng: 73.83 }, { name: "Margao", lat: 15.27, lng: 73.97 }, { name: "Mapusa", lat: 15.59, lng: 73.81 }, { name: "Vasco da Gama", lat: 15.4, lng: 73.81 }] },
    { name: "Madhya Pradesh", cities: [{ name: "Bhopal", lat: 23.26, lng: 77.41 }, { name: "Khajuraho", lat: 24.83, lng: 79.92 }, { name: "Orchha", lat: 25.35, lng: 78.64 }, { name: "Sanchi", lat: 23.48, lng: 77.74 }, { name: "Pachmarhi", lat: 22.47, lng: 77.78 }] },
    { name: "Andhra Pradesh", cities: [{ name: "Visakhapatnam", lat: 17.69, lng: 83.22 }, { name: "Tirupati", lat: 13.63, lng: 79.42 }, { name: "Araku Valley", lat: 18.33, lng: 82.87 }] },
    { name: "Odisha", cities: [{ name: "Bhubaneswar", lat: 20.3, lng: 85.82 }, { name: "Puri", lat: 19.81, lng: 85.83 }, { name: "Konark", lat: 19.89, lng: 86.09 }] },
    { name: "Punjab", cities: [{ name: "Amritsar", lat: 31.63, lng: 74.87 }, { name: "Chandigarh", lat: 30.73, lng: 76.78 }, { name: "Ludhiana", lat: 30.9, lng: 75.86 }] },
    { name: "Uttarakhand", cities: [{ name: "Rishikesh", lat: 30.09, lng: 78.27 }, { name: "Haridwar", lat: 29.95, lng: 78.16 }, { name: "Nainital", lat: 29.38, lng: 79.44 }, { name: "Mussoorie", lat: 30.46, lng: 78.06 }] },
    { name: "Jammu and Kashmir", cities: [{ name: "Srinagar", lat: 34.08, lng: 74.8 }, { name: "Gulmarg", lat: 34.05, lng: 74.38 }, { name: "Pahalgam", lat: 34.02, lng: 75.33 }, { name: "Leh", lat: 34.16, lng: 77.58 }] },
    { name: "Ladakh", cities: [{ name: "Leh", lat: 34.16, lng: 77.58 }, { name: "Nubra Valley", lat: 34.67, lng: 77.6 }, { name: "Pangong Lake", lat: 33.76, lng: 78.67 }] },
  ]),

  "840": h("840", "States", [
    { name: "California", cities: [{ name: "Los Angeles", lat: 34.05, lng: -118.24 }, { name: "San Francisco", lat: 37.77, lng: -122.42 }, { name: "San Diego", lat: 32.72, lng: -117.16 }, { name: "Napa Valley", lat: 38.5, lng: -122.33 }, { name: "Yosemite", lat: 37.86, lng: -119.54 }, { name: "Santa Monica", lat: 34.02, lng: -118.49 }] },
    { name: "New York", cities: [{ name: "New York City", lat: 40.71, lng: -74.01 }, { name: "Buffalo", lat: 42.89, lng: -78.88 }, { name: "Albany", lat: 42.65, lng: -73.75 }, { name: "Niagara Falls", lat: 43.09, lng: -79.04 }] },
    { name: "Florida", cities: [{ name: "Miami", lat: 25.76, lng: -80.19 }, { name: "Orlando", lat: 28.54, lng: -81.38 }, { name: "Key West", lat: 24.56, lng: -81.78 }, { name: "Tampa", lat: 27.95, lng: -82.46 }, { name: "Fort Lauderdale", lat: 26.12, lng: -80.14 }] },
    { name: "Texas", cities: [{ name: "Houston", lat: 29.76, lng: -95.37 }, { name: "Austin", lat: 30.27, lng: -97.74 }, { name: "San Antonio", lat: 29.42, lng: -98.49 }, { name: "Dallas", lat: 32.78, lng: -96.8 }, { name: "El Paso", lat: 31.76, lng: -106.44 }] },
    { name: "Illinois", cities: [{ name: "Chicago", lat: 41.88, lng: -87.63 }, { name: "Springfield", lat: 39.78, lng: -89.65 }] },
    { name: "Nevada", cities: [{ name: "Las Vegas", lat: 36.17, lng: -115.14 }, { name: "Reno", lat: 39.53, lng: -119.81 }] },
    { name: "Hawaii", cities: [{ name: "Honolulu", lat: 21.31, lng: -157.86 }, { name: "Maui", lat: 20.8, lng: -156.33 }, { name: "Kauai", lat: 22.09, lng: -159.52 }, { name: "Big Island", lat: 19.6, lng: -155.5 }] },
    { name: "Colorado", cities: [{ name: "Denver", lat: 39.74, lng: -104.99 }, { name: "Aspen", lat: 39.19, lng: -106.82 }, { name: "Boulder", lat: 40.01, lng: -105.27 }] },
    { name: "Washington", cities: [{ name: "Seattle", lat: 47.61, lng: -122.33 }, { name: "Olympia", lat: 47.04, lng: -122.9 }] },
    { name: "Massachusetts", cities: [{ name: "Boston", lat: 42.36, lng: -71.06 }, { name: "Cambridge", lat: 42.37, lng: -71.1 }, { name: "Salem", lat: 42.52, lng: -70.9 }] },
    { name: "Georgia", cities: [{ name: "Atlanta", lat: 33.75, lng: -84.39 }, { name: "Savannah", lat: 32.08, lng: -81.09 }] },
    { name: "Arizona", cities: [{ name: "Phoenix", lat: 33.45, lng: -112.07 }, { name: "Grand Canyon", lat: 36.05, lng: -112.14 }, { name: "Sedona", lat: 34.87, lng: -111.76 }] },
    { name: "Oregon", cities: [{ name: "Portland", lat: 45.52, lng: -122.68 }, { name: "Crater Lake", lat: 42.94, lng: -122.11 }] },
    { name: "Pennsylvania", cities: [{ name: "Philadelphia", lat: 39.95, lng: -75.17 }, { name: "Pittsburgh", lat: 40.44, lng: -79.99 }] },
    { name: "Michigan", cities: [{ name: "Detroit", lat: 42.33, lng: -83.05 }, { name: "Traverse City", lat: 44.76, lng: -85.62 }] },
    { name: "Ohio", cities: [{ name: "Columbus", lat: 39.96, lng: -82.99 }, { name: "Cleveland", lat: 41.5, lng: -81.69 }] },
    { name: "Virginia", cities: [{ name: "Richmond", lat: 37.54, lng: -77.43 }, { name: "Virginia Beach", lat: 36.85, lng: -75.98 }] },
    { name: "North Carolina", cities: [{ name: "Charlotte", lat: 35.23, lng: -80.84 }, { name: "Asheville", lat: 35.6, lng: -82.55 }] },
    { name: "Tennessee", cities: [{ name: "Nashville", lat: 36.16, lng: -86.78 }, { name: "Memphis", lat: 35.15, lng: -90.05 }] },
    { name: "Louisiana", cities: [{ name: "New Orleans", lat: 29.95, lng: -90.07 }, { name: "Baton Rouge", lat: 30.45, lng: -91.19 }] },
  ]),

  "156": h("156", "Provinces", [
    { name: "Beijing", cities: [{ name: "Beijing", lat: 39.9, lng: 116.4 }] },
    { name: "Shanghai", cities: [{ name: "Shanghai", lat: 31.23, lng: 121.47 }] },
    { name: "Guangdong", cities: [{ name: "Guangzhou", lat: 23.13, lng: 113.26 }, { name: "Shenzhen", lat: 22.54, lng: 114.06 }, { name: "Hong Kong", lat: 22.32, lng: 114.17 }] },
    { name: "Sichuan", cities: [{ name: "Chengdu", lat: 30.57, lng: 104.07 }, { name: "Leshan", lat: 29.55, lng: 103.77 }] },
    { name: "Yunnan", cities: [{ name: "Kunming", lat: 25.04, lng: 102.68 }, { name: "Lijiang", lat: 26.87, lng: 100.23 }, { name: "Dali", lat: 25.59, lng: 100.23 }] },
    { name: "Zhejiang", cities: [{ name: "Hangzhou", lat: 30.27, lng: 120.15 }, { name: "Ningbo", lat: 29.87, lng: 121.55 }] },
    { name: "Jiangsu", cities: [{ name: "Nanjing", lat: 32.06, lng: 118.8 }, { name: "Suzhou", lat: 31.3, lng: 120.62 }] },
    { name: "Fujian", cities: [{ name: "Xiamen", lat: 24.48, lng: 118.09 }, { name: "Fuzhou", lat: 26.07, lng: 119.3 }] },
    { name: "Shaanxi", cities: [{ name: "Xi'an", lat: 34.34, lng: 108.94 }] },
    { name: "Hunan", cities: [{ name: "Changsha", lat: 28.23, lng: 112.94 }, { name: "Zhangjiajie", lat: 29.13, lng: 110.48 }] },
    { name: "Hainan", cities: [{ name: "Sanya", lat: 18.25, lng: 109.5 }, { name: "Haikou", lat: 20.04, lng: 110.35 }] },
    { name: "Tibet", cities: [{ name: "Lhasa", lat: 29.65, lng: 91.11 }] },
    { name: "Xinjiang", cities: [{ name: "Urumqi", lat: 43.83, lng: 87.58 }, { name: "Kashgar", lat: 39.47, lng: 75.99 }] },
    { name: "Inner Mongolia", cities: [{ name: "Hohhot", lat: 40.84, lng: 111.75 }] },
    { name: "Heilongjiang", cities: [{ name: "Harbin", lat: 45.75, lng: 126.65 }] },
    { name: "Jilin", cities: [{ name: "Changchun", lat: 43.88, lng: 125.32 }] },
    { name: "Liaoning", cities: [{ name: "Dalian", lat: 38.91, lng: 121.62 }, { name: "Shenyang", lat: 41.8, lng: 123.43 }] },
    { name: "Shandong", cities: [{ name: "Qingdao", lat: 36.07, lng: 120.38 }, { name: "Jinan", lat: 36.65, lng: 116.99 }] },
    { name: "Henan", cities: [{ name: "Zhengzhou", lat: 34.75, lng: 113.65 }, { name: "Luoyang", lat: 34.62, lng: 112.45 }] },
    { name: "Gansu", cities: [{ name: "Dunhuang", lat: 40.14, lng: 94.66 }] },
    { name: "Guizhou", cities: [{ name: "Guiyang", lat: 26.65, lng: 106.63 }] },
  ]),

  "392": h("392", "Prefectures", [
    { name: "Tokyo", cities: [{ name: "Tokyo", lat: 35.68, lng: 139.69 }, { name: "Shibuya", lat: 35.66, lng: 139.7 }, { name: "Shinjuku", lat: 35.69, lng: 139.7 }] },
    { name: "Osaka", cities: [{ name: "Osaka", lat: 34.69, lng: 135.5 }, { name: "Nara", lat: 34.69, lng: 135.8 }, { name: "Kobe", lat: 34.69, lng: 135.2 }] },
    { name: "Kyoto", cities: [{ name: "Kyoto", lat: 35.01, lng: 135.77 }] },
    { name: "Hokkaido", cities: [{ name: "Sapporo", lat: 43.06, lng: 141.35 }, { name: "Niseko", lat: 42.87, lng: 140.69 }, { name: "Furano", lat: 43.34, lng: 142.38 }] },
    { name: "Okinawa", cities: [{ name: "Naha", lat: 26.34, lng: 127.77 }, { name: "Ishigaki", lat: 24.34, lng: 124.16 }] },
    { name: "Nagano", cities: [{ name: "Nagano", lat: 36.65, lng: 138.18 }, { name: "Hakuba", lat: 36.7, lng: 137.86 }] },
    { name: "Hiroshima", cities: [{ name: "Hiroshima", lat: 34.39, lng: 132.46 }, { name: "Miyajima", lat: 34.3, lng: 132.31 }] },
    { name: "Fukuoka", cities: [{ name: "Fukuoka", lat: 33.59, lng: 130.4 }, { name: "Kitakyushu", lat: 33.88, lng: 130.88 }] },
    { name: "Aichi", cities: [{ name: "Nagoya", lat: 35.18, lng: 136.91 }] },
    { name: "Kanagawa", cities: [{ name: "Yokohama", lat: 35.44, lng: 139.64 }, { name: "Kamakura", lat: 35.32, lng: 139.55 }] },
    { name: "Ibaraki", cities: [{ name: "Mito", lat: 36.34, lng: 140.45 }] },
    { name: "Nara", cities: [{ name: "Nara", lat: 34.69, lng: 135.8 }] },
    { name: "Mie", cities: [{ name: "Toba", lat: 34.48, lng: 136.85 }] },
    { name: "Shizuoka", cities: [{ name: "Atami", lat: 35.1, lng: 139.07 }, { name: "Fuji", lat: 35.16, lng: 138.68 }] },
  ]),

  "076": h("076", "States", [
    { name: "Sao Paulo", cities: [{ name: "Sao Paulo", lat: -23.55, lng: -46.63 }, { name: "Campinas", lat: -22.91, lng: -47.06 }] },
    { name: "Rio de Janeiro", cities: [{ name: "Rio de Janeiro", lat: -22.91, lng: -43.17 }, { name: "Niteroi", lat: -22.88, lng: -43.1 }] },
    { name: "Bahia", cities: [{ name: "Salvador", lat: -12.97, lng: -38.51 }, { name: "Ilheus", lat: -14.79, lng: -39.05 }] },
    { name: "Minas Gerais", cities: [{ name: "Belo Horizonte", lat: -19.92, lng: -43.94 }, { name: "Ouro Preto", lat: -20.39, lng: -43.51 }] },
    { name: "Parana", cities: [{ name: "Curitiba", lat: -25.43, lng: -49.27 }, { name: "Iguazu Falls", lat: -25.69, lng: -54.44 }] },
    { name: "Amazonas", cities: [{ name: "Manaus", lat: -3.12, lng: -60.02 }] },
    { name: "Pernambuco", cities: [{ name: "Recife", lat: -8.05, lng: -34.87 }, { name: "Olinda", lat: -8.0, lng: -34.86 }] },
    { name: "Ceara", cities: [{ name: "Fortaleza", lat: -3.72, lng: -38.54 }] },
    { name: "Goias", cities: [{ name: "Goiania", lat: -16.69, lng: -49.26 }] },
    { name: "Mato Grosso", cities: [{ name: "Cuiaba", lat: -15.6, lng: -56.1 }] },
    { name: "Rio Grande do Sul", cities: [{ name: "Porto Alegre", lat: -30.03, lng: -51.23 }] },
    { name: "Santa Catarina", cities: [{ name: "Florianopolis", lat: -27.59, lng: -48.55 }] },
  ]),

  "826": h("826", "Countries", [
    { name: "England", cities: [{ name: "London", lat: 51.51, lng: -0.13 }, { name: "Bath", lat: 51.38, lng: -2.36 }, { name: "Oxford", lat: 51.75, lng: -1.26 }, { name: "Cambridge", lat: 52.21, lng: 0.12 }, { name: "Manchester", lat: 53.48, lng: -2.24 }, { name: "Liverpool", lat: 53.41, lng: -2.98 }, { name: "York", lat: 53.96, lng: -1.08 }] },
    { name: "Scotland", cities: [{ name: "Edinburgh", lat: 55.95, lng: -3.19 }, { name: "Glasgow", lat: 55.86, lng: -4.25 }, { name: "Inverness", lat: 57.48, lng: -4.22 }, { name: "Isle of Skye", lat: 57.3, lng: -6.3 }] },
    { name: "Wales", cities: [{ name: "Cardiff", lat: 51.48, lng: -3.18 }, { name: "Snowdonia", lat: 53.07, lng: -3.87 }] },
    { name: "Northern Ireland", cities: [{ name: "Belfast", lat: 54.6, lng: -5.93 }, { name: "Giant's Causeway", lat: 55.24, lng: -6.51 }] },
  ]),

  "250": h("250", "Regions", [
    { name: "Ile-de-France", cities: [{ name: "Paris", lat: 48.86, lng: 2.35 }, { name: "Versailles", lat: 48.8, lng: 2.13 }] },
    { name: "Provence-Alpes-Cote d'Azur", cities: [{ name: "Nice", lat: 43.71, lng: 7.27 }, { name: "Marseille", lat: 43.3, lng: 5.37 }, { name: "Cannes", lat: 43.55, lng: 7.02 }, { name: "Avignon", lat: 43.95, lng: 4.81 }] },
    { name: "Normandy", cities: [{ name: "Mont-Saint-Michel", lat: 48.64, lng: -1.51 }, { name: "Honfleur", lat: 49.42, lng: 0.24 }] },
    { name: "Brittany", cities: [{ name: "Rennes", lat: 48.11, lng: -1.68 }, { name: "Saint-Malo", lat: 48.65, lng: -2.01 }] },
    { name: "Loire Valley", cities: [{ name: "Orleans", lat: 47.9, lng: 1.9 }, { name: "Amboise", lat: 47.4, lng: 0.98 }] },
    { name: "Alsace", cities: [{ name: "Strasbourg", lat: 48.57, lng: 7.75 }, { name: "Colmar", lat: 48.08, lng: 7.36 }] },
    { name: "Aquitaine", cities: [{ name: "Bordeaux", lat: 44.84, lng: -0.58 }, { name: "Dax", lat: 43.71, lng: -1.05 }] },
    { name: "Bourgogne-Franche-Comte", cities: [{ name: "Dijon", lat: 47.32, lng: 5.04 }] },
    { name: "Occitanie", cities: [{ name: "Toulouse", lat: 43.6, lng: 1.44 }, { name: "Montpellier", lat: 43.61, lng: 3.88 }] },
    { name: "Nouvelle-Aquitaine", cities: [{ name: "La Rochelle", lat: 46.17, lng: -1.15 }] },
  ]),

  "276": h("276", "States", [
    { name: "Bavaria", cities: [{ name: "Munich", lat: 48.14, lng: 11.58 }, { name: "Nuremberg", lat: 49.45, lng: 11.08 }, { name: "Garmisch", lat: 47.5, lng: 11.09 }] },
    { name: "Berlin", cities: [{ name: "Berlin", lat: 52.52, lng: 13.41 }] },
    { name: "North Rhine-Westphalia", cities: [{ name: "Cologne", lat: 50.94, lng: 6.96 }, { name: "Dusseldorf", lat: 51.23, lng: 6.78 }] },
    { name: "Hamburg", cities: [{ name: "Hamburg", lat: 53.55, lng: 9.99 }] },
    { name: "Hesse", cities: [{ name: "Frankfurt", lat: 50.11, lng: 8.68 }] },
    { name: "Saxony", cities: [{ name: "Dresden", lat: 51.05, lng: 13.74 }, { name: "Leipzig", lat: 51.34, lng: 12.37 }] },
    { name: "Baden-Wurttemberg", cities: [{ name: "Stuttgart", lat: 48.78, lng: 9.18 }, { name: "Heidelberg", lat: 49.41, lng: 8.7 }] },
    { name: "Schleswig-Holstein", cities: [{ name: "Kiel", lat: 54.32, lng: 10.14 }] },
    { name: "Lower Saxony", cities: [{ name: "Hannover", lat: 52.37, lng: 9.73 }] },
  ]),

  "380": h("380", "Regions", [
    { name: "Lazio", cities: [{ name: "Rome", lat: 41.9, lng: 12.5 }, { name: "Vatican City", lat: 41.9, lng: 12.45 }] },
    { name: "Lombardy", cities: [{ name: "Milan", lat: 45.46, lng: 9.19 }, { name: "Lake Como", lat: 46.02, lng: 9.27 }] },
    { name: "Tuscany", cities: [{ name: "Florence", lat: 43.77, lng: 11.25 }, { name: "Pisa", lat: 43.72, lng: 10.4 }, { name: "Siena", lat: 43.32, lng: 11.33 }] },
    { name: "Veneto", cities: [{ name: "Venice", lat: 45.44, lng: 12.32 }, { name: "Verona", lat: 45.44, lng: 10.99 }] },
    { name: "Campania", cities: [{ name: "Naples", lat: 40.85, lng: 14.27 }, { name: "Amalfi Coast", lat: 40.63, lng: 14.6 }, { name: "Pompeii", lat: 40.75, lng: 14.49 }] },
    { name: "Sicily", cities: [{ name: "Palermo", lat: 38.12, lng: 13.36 }, { name: "Taormina", lat: 37.85, lng: 15.29 }] },
    { name: "Emilia-Romagna", cities: [{ name: "Bologna", lat: 44.49, lng: 11.34 }] },
    { name: "Piedmont", cities: [{ name: "Turin", lat: 45.07, lng: 7.69 }] },
    { name: "Umbria", cities: [{ name: "Perugia", lat: 43.11, lng: 12.39 }, { name: "Assisi", lat: 43.07, lng: 12.62 }] },
    { name: "Liguria", cities: [{ name: "Cinque Terre", lat: 44.12, lng: 9.72 }, { name: "Genoa", lat: 44.41, lng: 8.93 }] },
  ]),

  "724": h("724", "Autonomous Communities", [
    { name: "Catalonia", cities: [{ name: "Barcelona", lat: 41.39, lng: 2.17 }, { name: "Montserrat", lat: 41.59, lng: 1.84 }] },
    { name: "Andalusia", cities: [{ name: "Seville", lat: 37.39, lng: -6.0 }, { name: "Granada", lat: 37.18, lng: -3.6 }, { name: "Malaga", lat: 36.72, lng: -4.42 }, { name: "Cordoba", lat: 37.88, lng: -4.77 }] },
    { name: "Madrid", cities: [{ name: "Madrid", lat: 40.42, lng: -3.7 }] },
    { name: "Valencia", cities: [{ name: "Valencia", lat: 39.47, lng: -0.38 }, { name: "Alicante", lat: 38.35, lng: -0.49 }] },
    { name: "Basque Country", cities: [{ name: "Bilbao", lat: 43.26, lng: -2.93 }, { name: "San Sebastian", lat: 43.32, lng: -1.98 }] },
    { name: "Galicia", cities: [{ name: "Santiago de Compostela", lat: 42.88, lng: -8.54 }] },
    { name: "Balearic Islands", cities: [{ name: "Palma de Mallorca", lat: 39.57, lng: 2.65 }, { name: "Ibiza", lat: 38.91, lng: 1.43 }] },
    { name: "Canary Islands", cities: [{ name: "Las Palmas", lat: 28.1, lng: -15.41 }, { name: "Tenerife", lat: 28.05, lng: -16.56 }] },
    { name: "Castilla y Leon", cities: [{ name: "Salamanca", lat: 40.97, lng: -5.66 }] },
  ]),

  "124": h("124", "Provinces and Territories", [
    { name: "Ontario", cities: [{ name: "Toronto", lat: 43.65, lng: -79.38 }, { name: "Ottawa", lat: 45.42, lng: -75.7 }, { name: "Niagara Falls", lat: 43.09, lng: -79.04 }] },
    { name: "Quebec", cities: [{ name: "Montreal", lat: 45.5, lng: -73.57 }, { name: "Quebec City", lat: 46.81, lng: -71.21 }] },
    { name: "British Columbia", cities: [{ name: "Vancouver", lat: 49.28, lng: -123.12 }, { name: "Victoria", lat: 48.43, lng: -123.37 }, { name: "Whistler", lat: 50.12, lng: -122.95 }] },
    { name: "Alberta", cities: [{ name: "Calgary", lat: 51.05, lng: -114.07 }, { name: "Edmonton", lat: 53.55, lng: -113.49 }, { name: "Banff", lat: 51.18, lng: -115.57 }] },
    { name: "Manitoba", cities: [{ name: "Winnipeg", lat: 49.9, lng: -97.14 }] },
    { name: "Saskatchewan", cities: [{ name: "Saskatoon", lat: 52.13, lng: -106.67 }] },
    { name: "Nova Scotia", cities: [{ name: "Halifax", lat: 44.65, lng: -63.57 }] },
    { name: "New Brunswick", cities: [{ name: "Fredericton", lat: 45.96, lng: -66.64 }] },
    { name: "Newfoundland and Labrador", cities: [{ name: "St. Johns", lat: 47.56, lng: -52.71 }] },
    { name: "Prince Edward Island", cities: [{ name: "Charlottetown", lat: 46.24, lng: -63.13 }] },
  ]),

  "036": h("036", "States and Territories", [
    { name: "New South Wales", cities: [{ name: "Sydney", lat: -33.87, lng: 151.21 }, { name: "Blue Mountains", lat: -33.72, lng: 150.31 }] },
    { name: "Victoria", cities: [{ name: "Melbourne", lat: -37.81, lng: 144.96 }, { name: "Great Ocean Road", lat: -38.67, lng: 143.1 }] },
    { name: "Queensland", cities: [{ name: "Brisbane", lat: -27.47, lng: 153.03 }, { name: "Gold Coast", lat: -28.02, lng: 153.4 }, { name: "Cairns", lat: -16.92, lng: 145.78 }] },
    { name: "Western Australia", cities: [{ name: "Perth", lat: -31.95, lng: 115.86 }, { name: "Broome", lat: -17.96, lng: 122.24 }] },
    { name: "South Australia", cities: [{ name: "Adelaide", lat: -34.93, lng: 138.6 }, { name: "Barossa Valley", lat: -34.53, lng: 138.86 }] },
    { name: "Tasmania", cities: [{ name: "Hobart", lat: -42.88, lng: 147.33 }, { name: "Freycinet", lat: -42.14, lng: 148.29 }] },
    { name: "Northern Territory", cities: [{ name: "Darwin", lat: -12.46, lng: 130.84 }, { name: "Uluru", lat: -25.34, lng: 131.04 }] },
    { name: "Australian Capital Territory", cities: [{ name: "Canberra", lat: -35.28, lng: 149.13 }] },
  ]),

  "764": h("764", "Provinces", [
    { name: "Bangkok", cities: [{ name: "Bangkok", lat: 13.76, lng: 100.5 }, { name: "Ayutthaya", lat: 14.35, lng: 100.57 }] },
    { name: "Chiang Mai", cities: [{ name: "Chiang Mai", lat: 18.79, lng: 98.98 }, { name: "Chiang Rai", lat: 19.91, lng: 99.83 }] },
    { name: "Phuket", cities: [{ name: "Phuket", lat: 7.88, lng: 98.39 }] },
    { name: "Krabi", cities: [{ name: "Krabi", lat: 8.09, lng: 98.91 }, { name: "Railay Beach", lat: 8.04, lng: 98.84 }] },
    { name: "Surat Thani", cities: [{ name: "Koh Samui", lat: 9.51, lng: 100.01 }, { name: "Koh Phangan", lat: 9.75, lng: 100.03 }] },
    { name: "Kanchanaburi", cities: [{ name: "Kanchanaburi", lat: 14.02, lng: 99.53 }, { name: "River Kwai", lat: 14.04, lng: 99.5 }] },
    { name: "Nonthaburi", cities: [{ name: "Pattaya", lat: 12.92, lng: 100.88 }] },
  ]),

  "398": h("398", "Regions", [
    { name: "Almaty Region", cities: [{ name: "Almaty", lat: 43.24, lng: 76.95 }, { name: "Big Almaty Lake", lat: 43.05, lng: 77.07 }] },
    { name: "Astana", cities: [{ name: "Astana", lat: 51.13, lng: 71.43 }] },
    { name: "Mangystau Region", cities: [{ name: "Aktau", lat: 43.65, lng: 51.15 }] },
    { name: "Turkestan Region", cities: [{ name: "Turkestan", lat: 43.3, lng: 68.25 }] },
    { name: "East Kazakhstan", cities: [{ name: "Ust-Kamenogorsk", lat: 49.95, lng: 82.63 }] },
  ]),

  "360": h("360", "Provinces", [
    { name: "Bali", cities: [{ name: "Denpasar", lat: -8.67, lng: 115.21 }, { name: "Ubud", lat: -8.51, lng: 115.26 }, { name: "Seminyak", lat: -8.68, lng: 115.16 }] },
    { name: "Java", cities: [{ name: "Jakarta", lat: -6.21, lng: 106.85 }, { name: "Yogyakarta", lat: -7.79, lng: 110.37 }, { name: "Bromo", lat: -7.94, lng: 112.95 }, { name: "Bandung", lat: -6.92, lng: 107.61 }] },
    { name: "Sumatra", cities: [{ name: "Medan", lat: 3.59, lng: 98.67 }, { name: "Bukittinggi", lat: -0.31, lng: 100.37 }] },
    { name: "Kalimantan", cities: [{ name: "Banjarmasin", lat: -3.32, lng: 114.59 }] },
    { name: "Sulawesi", cities: [{ name: "Makassar", lat: -5.14, lng: 119.42 }] },
    { name: "Nusa Tenggara", cities: [{ name: "Lombok", lat: -8.58, lng: 116.35 }, { name: "Komodo", lat: -8.55, lng: 119.48 }] },
    { name: "Papua", cities: [{ name: "Jayapura", lat: -2.53, lng: 140.72 }] },
  ]),

  "643": h("643", "Federal Subjects", [
    { name: "Moscow", cities: [{ name: "Moscow", lat: 55.76, lng: 37.62 }] },
    { name: "Saint Petersburg", cities: [{ name: "Saint Petersburg", lat: 59.93, lng: 30.32 }] },
    { name: "Krasnodar Krai", cities: [{ name: "Sochi", lat: 43.6, lng: 39.73 }] },
    { name: "Republic of Crimea", cities: [{ name: "Yalta", lat: 44.48, lng: 34.17 }] },
    { name: "Altai Republic", cities: [{ name: "Gorno-Altaysk", lat: 51.96, lng: 85.96 }] },
    { name: "Republic of Tatarstan", cities: [{ name: "Kazan", lat: 55.79, lng: 49.11 }] },
    { name: "Kamchatka Krai", cities: [{ name: "Petropavlovsk-Kamchatsky", lat: 53.01, lng: 158.65 }] },
    { name: "Irkutsk Oblast", cities: [{ name: "Irkutsk", lat: 52.29, lng: 104.28 }, { name: "Lake Baikal", lat: 53.56, lng: 108.17 }] },
    { name: "Republic of Sakha", cities: [{ name: "Yakutsk", lat: 62.03, lng: 129.73 }] },
    { name: "Primorsky Krai", cities: [{ name: "Vladivostok", lat: 43.12, lng: 131.89 }] },
  ]),

  "484": h("484", "States", [
    { name: "Jalisco", cities: [{ name: "Guadalajara", lat: 20.67, lng: -103.35 }, { name: "Puerto Vallarta", lat: 20.64, lng: -105.22 }] },
    { name: "Mexico City", cities: [{ name: "Mexico City", lat: 19.43, lng: -99.13 }, { name: "Xochimilco", lat: 19.26, lng: -99.1 }] },
    { name: "Quintana Roo", cities: [{ name: "Cancun", lat: 21.16, lng: -86.85 }, { name: "Tulum", lat: 20.21, lng: -87.47 }, { name: "Playa del Carmen", lat: 20.63, lng: -87.08 }] },
    { name: "Oaxaca", cities: [{ name: "Oaxaca City", lat: 17.07, lng: -96.73 }, { name: "Hierve el Agua", lat: 16.84, lng: -95.99 }] },
    { name: "Yucatan", cities: [{ name: "Merida", lat: 20.97, lng: -89.59 }, { name: "Chichen Itza", lat: 20.68, lng: -88.57 }] },
    { name: "Baja California Sur", cities: [{ name: "Cabo San Lucas", lat: 22.89, lng: -109.91 }] },
    { name: "Guerrero", cities: [{ name: "Acapulco", lat: 16.85, lng: -99.88 }] },
    { name: "Chiapas", cities: [{ name: "San Cristobal de las Casas", lat: 16.75, lng: -92.63 }] },
    { name: "Michoacan", cities: [{ name: "Morelia", lat: 19.7, lng: -101.19 }] },
    { name: "Nuevo Leon", cities: [{ name: "Monterrey", lat: 25.67, lng: -100.32 }] },
  ]),

  "818": h("818", "Governorates", [
    { name: "Cairo", cities: [{ name: "Cairo", lat: 30.04, lng: 31.24 }, { name: "Giza", lat: 30.01, lng: 31.21 }] },
    { name: "Luxor", cities: [{ name: "Luxor", lat: 25.69, lng: 32.64 }, { name: "Valley of the Kings", lat: 25.74, lng: 32.6 }] },
    { name: "Aswan", cities: [{ name: "Aswan", lat: 24.09, lng: 32.9 }, { name: "Abu Simbel", lat: 22.34, lng: 31.62 }] },
    { name: "Alexandria", cities: [{ name: "Alexandria", lat: 31.2, lng: 29.92 }] },
    { name: "Red Sea", cities: [{ name: "Hurghada", lat: 27.26, lng: 33.81 }, { name: "Sharm El Sheikh", lat: 27.91, lng: 34.33 }] },
    { name: "Gharbia", cities: [{ name: "Tanta", lat: 30.79, lng: 31.0 }] },
  ]),

  "792": h("792", "Provinces", [
    { name: "Istanbul", cities: [{ name: "Istanbul", lat: 41.01, lng: 28.98 }] },
    { name: "Antalya", cities: [{ name: "Antalya", lat: 36.9, lng: 30.7 }, { name: "Kas", lat: 36.2, lng: 29.64 }] },
    { name: "Cappadocia", cities: [{ name: "Goreme", lat: 38.64, lng: 34.83 }, { name: "Urgup", lat: 38.63, lng: 34.91 }] },
    { name: "Ankara", cities: [{ name: "Ankara", lat: 39.93, lng: 32.85 }] },
    { name: "Bodrum", cities: [{ name: "Bodrum", lat: 37.03, lng: 27.43 }] },
    { name: "Pamukkale", cities: [{ name: "Denizli", lat: 37.77, lng: 29.09 }] },
    { name: "Ephesus", cities: [{ name: "Izmir", lat: 38.42, lng: 27.14 }] },
  ]),

  "710": h("710", "Provinces", [
    { name: "Western Cape", cities: [{ name: "Cape Town", lat: -33.92, lng: 18.42 }, { name: "Stellenbosch", lat: -33.93, lng: 18.86 }] },
    { name: "Gauteng", cities: [{ name: "Johannesburg", lat: -26.2, lng: 28.04 }, { name: "Pretoria", lat: -25.75, lng: 28.19 }] },
    { name: "KwaZulu-Natal", cities: [{ name: "Durban", lat: -29.86, lng: 31.02 }] },
    { name: "Eastern Cape", cities: [{ name: "Port Elizabeth", lat: -33.96, lng: 25.6 }] },
    { name: "Limpopo", cities: [{ name: "Polokwane", lat: -23.9, lng: 29.47 }] },
    { name: "Mpumalanga", cities: [{ name: "Nelspruit", lat: -25.47, lng: 30.97 }] },
  ]),

  "528": h("528", "Provinces", [
    { name: "North Holland", cities: [{ name: "Amsterdam", lat: 52.37, lng: 4.9 }, { name: "Haarlem", lat: 52.38, lng: 4.64 }] },
    { name: "South Holland", cities: [{ name: "Rotterdam", lat: 51.92, lng: 4.48 }, { name: "The Hague", lat: 52.08, lng: 4.3 }, { name: "Leiden", lat: 52.16, lng: 4.49 }] },
    { name: "Utrecht", cities: [{ name: "Utrecht", lat: 52.09, lng: 5.12 }] },
    { name: "Gelderland", cities: [{ name: "Arnhem", lat: 51.98, lng: 5.9 }, { name: "Nijmegen", lat: 51.84, lng: 5.85 }] },
    { name: "Drenthe", cities: [{ name: "Assen", lat: 52.99, lng: 6.56 }] },
  ]),

  "410": h("410", "Provinces", [
    { name: "Seoul", cities: [{ name: "Seoul", lat: 37.57, lng: 126.98 }] },
    { name: "Gyeonggi", cities: [{ name: "Suwon", lat: 37.26, lng: 127.03 }] },
    { name: "Gangwon", cities: [{ name: "Gangneung", lat: 37.75, lng: 128.88 }, { name: "Pyeongchang", lat: 37.66, lng: 128.37 }] },
    { name: "Jeollanam", cities: [{ name: "Suncheon", lat: 34.95, lng: 127.49 }] },
    { name: "Gyeongsang", cities: [{ name: "Busan", lat: 35.18, lng: 129.08 }, { name: "Gyeongju", lat: 35.86, lng: 129.21 }] },
    { name: "Jeju", cities: [{ name: "Jeju City", lat: 33.5, lng: 126.53 }] },
    { name: "Chungcheong", cities: [{ name: "Daejeon", lat: 36.35, lng: 127.38 }] },
  ]),

  "050": h("050", "Divisions", [
    { name: "Dhaka Division", cities: [{ name: "Dhaka", lat: 23.81, lng: 90.41 }, { name: "Sonargaon", lat: 23.65, lng: 90.5 }] },
    { name: "Chittagong Division", cities: [{ name: "Chittagong", lat: 22.36, lng: 91.78 }, { name: "Cox's Bazar", lat: 21.43, lng: 92.01 }] },
    { name: "Rajshahi Division", cities: [{ name: "Rajshahi", lat: 24.37, lng: 88.6 }] },
    { name: "Sylhet Division", cities: [{ name: "Sylhet", lat: 24.9, lng: 91.87 }] },
    { name: "Khulna Division", cities: [{ name: "Khulna", lat: 22.82, lng: 89.54 }] },
    { name: "Barisal Division", cities: [{ name: "Barisal", lat: 22.7, lng: 90.37 }] },
    { name: "Rangpur Division", cities: [{ name: "Rangpur", lat: 25.75, lng: 89.24 }] },
    { name: "Mymensingh Division", cities: [{ name: "Mymensingh", lat: 24.75, lng: 90.42 }] },
  ]),

  "586": h("586", "Provinces", [
    { name: "Punjab", cities: [{ name: "Lahore", lat: 31.55, lng: 74.35 }, { name: "Islamabad", lat: 33.69, lng: 73.04 }, { name: "Rawalpindi", lat: 33.56, lng: 73.01 }] },
    { name: "Sindh", cities: [{ name: "Karachi", lat: 24.86, lng: 67.01 }] },
    { name: "Khyber Pakhtunkhwa", cities: [{ name: "Peshawar", lat: 34.01, lng: 71.58 }, { name: "Swat", lat: 35.22, lng: 72.44 }] },
    { name: "Balochistan", cities: [{ name: "Quetta", lat: 30.18, lng: 66.97 }] },
    { name: "Gilgit-Baltistan", cities: [{ name: "Gilgit", lat: 35.88, lng: 74.47 }, { name: "Hunza", lat: 36.32, lng: 74.65 }] },
  ]),

  "682": h("682", "Regions", [
    { name: "Riyadh", cities: [{ name: "Riyadh", lat: 24.71, lng: 46.67 }] },
    { name: "Makkah", cities: [{ name: "Mecca", lat: 21.39, lng: 39.86 }, { name: "Jeddah", lat: 21.49, lng: 39.19 }] },
    { name: "Medina", cities: [{ name: "Medina", lat: 24.47, lng: 39.61 }] },
    { name: "Eastern Province", cities: [{ name: "Dammam", lat: 26.43, lng: 50.1 }] },
    { name: "Asir", cities: [{ name: "Abha", lat: 18.22, lng: 42.51 }] },
    { name: "Tabuk", cities: [{ name: "Tabuk", lat: 28.38, lng: 36.56 }] },
  ]),

  "414": h("414", "Governorates", [
    { name: "Al Asimah", cities: [{ name: "Kuwait City", lat: 29.38, lng: 47.99 }] },
    { name: "Hawalli", cities: [{ name: "Hawalli", lat: 29.34, lng: 48.03 }] },
    { name: "Al Farwaniyah", cities: [{ name: "Farwaniya", lat: 29.28, lng: 47.96 }] },
  ]),

  "784": h("784", "Emirates", [
    { name: "Dubai", cities: [{ name: "Dubai", lat: 25.2, lng: 55.27 }] },
    { name: "Abu Dhabi", cities: [{ name: "Abu Dhabi", lat: 24.45, lng: 54.65 }] },
    { name: "Sharjah", cities: [{ name: "Sharjah", lat: 25.35, lng: 55.39 }] },
    { name: "Ajman", cities: [{ name: "Ajman", lat: 25.41, lng: 55.51 }] },
    { name: "Ras al Khaimah", cities: [{ name: "Ras al Khaimah", lat: 25.8, lng: 55.94 }] },
    { name: "Fujairah", cities: [{ name: "Fujairah", lat: 25.12, lng: 56.33 }] },
    { name: "Umm Al Quwain", cities: [{ name: "Umm Al Quwain", lat: 25.56, lng: 55.55 }] },
  ]),

  "275": h("275", "Governorates", [
    { name: "West Bank", cities: [{ name: "Ramallah", lat: 31.9, lng: 35.2 }, { name: "Bethlehem", lat: 31.7, lng: 35.2 }, { name: "Hebron", lat: 31.53, lng: 35.1 }] },
    { name: "Gaza Strip", cities: [{ name: "Gaza City", lat: 31.5, lng: 34.47 }] },
  ]),

  "376": h("376", "Districts", [
    { name: "Jerusalem", cities: [{ name: "Jerusalem", lat: 31.77, lng: 35.23 }] },
    { name: "Tel Aviv", cities: [{ name: "Tel Aviv", lat: 32.09, lng: 34.78 }] },
    { name: "Haifa", cities: [{ name: "Haifa", lat: 32.79, lng: 34.99 }] },
    { name: "Southern District", cities: [{ name: "Eilat", lat: 29.56, lng: 34.95 }] },
  ]),

  "364": h("364", "Provinces", [
    { name: "Tehran", cities: [{ name: "Tehran", lat: 35.69, lng: 51.39 }] },
    { name: "Isfahan", cities: [{ name: "Isfahan", lat: 32.65, lng: 51.68 }] },
    { name: "Fars", cities: [{ name: "Shiraz", lat: 29.59, lng: 52.58 }] },
    { name: "Khorasan", cities: [{ name: "Mashhad", lat: 36.3, lng: 59.6 }] },
    { name: "East Azerbaijan", cities: [{ name: "Tabriz", lat: 38.08, lng: 46.29 }] },
  ]),

  "246": h("246", "Regions", [
    { name: "Uusimaa", cities: [{ name: "Helsinki", lat: 60.17, lng: 24.94 }] },
    { name: "Lapland", cities: [{ name: "Rovaniemi", lat: 66.5, lng: 25.72 }] },
    { name: "Pirkanmaa", cities: [{ name: "Tampere", lat: 61.5, lng: 23.79 }] },
    { name: "Southwest Finland", cities: [{ name: "Turku", lat: 60.45, lng: 22.27 }] },
  ]),

  "040": h("040", "States", [
    { name: "Vienna", cities: [{ name: "Vienna", lat: 48.21, lng: 16.37 }] },
    { name: "Salzburg", cities: [{ name: "Salzburg", lat: 47.81, lng: 13.04 }] },
    { name: "Tyrol", cities: [{ name: "Innsbruck", lat: 47.26, lng: 11.39 }] },
    { name: "Upper Austria", cities: [{ name: "Linz", lat: 48.31, lng: 14.29 }] },
    { name: "Styria", cities: [{ name: "Graz", lat: 47.07, lng: 15.44 }] },
  ]),

  "756": h("756", "Cantons", [
    { name: "Zurich", cities: [{ name: "Zurich", lat: 47.38, lng: 8.54 }] },
    { name: "Bern", cities: [{ name: "Bern", lat: 46.95, lng: 7.45 }] },
    { name: "Lucerne", cities: [{ name: "Lucerne", lat: 47.05, lng: 8.31 }] },
    { name: "Valais", cities: [{ name: "Zermatt", lat: 46.02, lng: 7.75 }, { name: "Verbier", lat: 46.1, lng: 7.23 }] },
    { name: "Geneva", cities: [{ name: "Geneva", lat: 46.2, lng: 6.14 }] },
    { name: "Graubunden", cities: [{ name: "St. Moritz", lat: 46.5, lng: 9.84 }] },
  ]),

  "554": h("554", "Regions", [
    { name: "Canterbury", cities: [{ name: "Christchurch", lat: -43.53, lng: 172.64 }] },
    { name: "Wellington", cities: [{ name: "Wellington", lat: -41.29, lng: 174.78 }] },
    { name: "Auckland", cities: [{ name: "Auckland", lat: -36.85, lng: 174.76 }] },
    { name: "Otago", cities: [{ name: "Queenstown", lat: -45.03, lng: 168.66 }, { name: "Dunedin", lat: -45.87, lng: 170.5 }] },
    { name: "Bay of Plenty", cities: [{ name: "Rotorua", lat: -38.14, lng: 176.25 }] },
    { name: "Nelson", cities: [{ name: "Nelson", lat: -41.27, lng: 173.28 }] },
  ]),

  "524": h("524", "Provinces", [
    { name: "Bagmati", cities: [{ name: "Kathmandu", lat: 27.72, lng: 85.32 }, { name: "Bhaktapur", lat: 27.67, lng: 85.43 }] },
    { name: "Gandaki", cities: [{ name: "Pokhara", lat: 28.21, lng: 83.98 }] },
    { name: "Lumbini", cities: [{ name: "Lumbini", lat: 27.47, lng: 83.28 }] },
    { name: "Karnali", cities: [{ name: "Jumla", lat: 29.27, lng: 82.18 }] },
    { name: "Sudurpashchim", cities: [{ name: "Dhangadhi", lat: 28.7, lng: 80.59 }] },
  ]),

  "144": h("144", "Provinces", [
    { name: "Western Province", cities: [{ name: "Colombo", lat: 6.93, lng: 79.84 }, { name: "Galle", lat: 6.05, lng: 80.22 }] },
    { name: "Central Province", cities: [{ name: "Kandy", lat: 7.29, lng: 80.63 }, { name: "Nuwara Eliya", lat: 6.95, lng: 80.78 }] },
    { name: "Southern Province", cities: [{ name: "Matara", lat: 5.95, lng: 80.54 }] },
    { name: "Northern Province", cities: [{ name: "Jaffna", lat: 9.66, lng: 80.0 }] },
  ]),

  "616": h("616", "Voivodeships", [
    { name: "Masovia", cities: [{ name: "Warsaw", lat: 52.23, lng: 21.01 }] },
    { name: "Lesser Poland", cities: [{ name: "Krakow", lat: 50.06, lng: 19.94 }] },
    { name: "Silesia", cities: [{ name: "Wroclaw", lat: 51.11, lng: 17.04 }] },
    { name: "Pomerania", cities: [{ name: "Gdansk", lat: 54.35, lng: 18.65 }] },
    { name: "Greater Poland", cities: [{ name: "Poznan", lat: 52.41, lng: 16.93 }] },
  ]),

  "203": h("203", "Regions", [
    { name: "Prague", cities: [{ name: "Prague", lat: 50.08, lng: 14.44 }] },
    { name: "South Moravia", cities: [{ name: "Brno", lat: 49.2, lng: 16.61 }] },
  ]),

  "348": h("348", "Counties", [
    { name: "Budapest", cities: [{ name: "Budapest", lat: 47.5, lng: 19.04 }] },
    { name: "Pest", cities: [{ name: "Szentendre", lat: 47.67, lng: 19.08 }] },
  ]),

  "642": h("642", "Counties", [
    { name: "Bucharest", cities: [{ name: "Bucharest", lat: 44.43, lng: 26.1 }] },
    { name: "Cluj", cities: [{ name: "Cluj-Napoca", lat: 46.77, lng: 23.62 }] },
    { name: "Brasov", cities: [{ name: "Brasov", lat: 45.65, lng: 25.6 }] },
  ]),

  "048": h("048", "Governorates", [
    { name: "Capital", cities: [{ name: "Manama", lat: 26.23, lng: 50.58 }] },
  ]),

  "882": h("882", "Districts", [
    { name: "Upolu", cities: [{ name: "Apia", lat: -13.83, lng: -171.76 }] },
  ]),
};

export function getCountryHierarchy(id: string): CountryHierarchy {
  return HIERARCHY[id] ?? { ...EMPTY, id };
}
