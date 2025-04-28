import { Hospital } from "../components/HospitalCard";

type MockHospital = Omit<Hospital, "distance"> & {
  latitude: number;
  longitude: number;
};

const casablancaHospitals: MockHospital[] = [
  {
    id: "cas1",
    name: "CHU Ibn Rochd",
    address: "Boulevard des Almohades, Casablanca",
    latitude: 33.5890,
    longitude: -7.6128,
    bloodUrgencyLevel: 75,
    bloodTypesNeeded: ["O+", "A+", "B-"],
    hasUrgentNeed: true
  },
  {
    id: "cas2",
    name: "Hôpital Cheikh Khalifa",
    address: "Hay Hassani, Casablanca",
    latitude: 33.5644,
    longitude: -7.6552,
    bloodUrgencyLevel: 60,
    bloodTypesNeeded: ["A-", "AB+"],
    hasUrgentNeed: false
  },
  {
    id: "cas3",
    name: "Centre de Transfusion Sanguine de Casablanca",
    address: "Rue Tarik Ibn Ziad, Casablanca",
    latitude: 33.5731,
    longitude: -7.5990,
    bloodUrgencyLevel: 90,
    bloodTypesNeeded: ["O-", "AB-", "B+", "A+"],
    hasUrgentNeed: true
  },
  {
    id: "cas4",
    name: "Clinique Atfal",
    address: "Boulevard Massira Al Khadra, Casablanca",
    latitude: 33.5820,
    longitude: -7.6390,
    bloodUrgencyLevel: 40,
    bloodTypesNeeded: ["A+", "O+"],
    hasUrgentNeed: false
  }
];

const rabatHospitals: MockHospital[] = [
  {
    id: "rab1",
    name: "Hôpital Ibn Sina",
    address: "Avenue Hassan II, Rabat",
    latitude: 34.0076,
    longitude: -6.8498,
    bloodUrgencyLevel: 80,
    bloodTypesNeeded: ["A+", "O-", "B+"],
    hasUrgentNeed: true
  },
  {
    id: "rab2",
    name: "Centre National de Transfusion Sanguine",
    address: "Avenue Ibn Sina, Rabat",
    latitude: 34.0056,
    longitude: -6.8456,
    bloodUrgencyLevel: 95,
    bloodTypesNeeded: ["O-", "AB-", "A-", "B-"],
    hasUrgentNeed: true
  },
  {
    id: "rab3",
    name: "Hôpital Militaire Mohammed V",
    address: "Avenue des FAR, Rabat",
    latitude: 34.0156,
    longitude: -6.8376,
    bloodUrgencyLevel: 65,
    bloodTypesNeeded: ["B+", "AB+"],
    hasUrgentNeed: false
  }
];

const marrakeshHospitals: MockHospital[] = [
  {
    id: "mar1",
    name: "CHU Mohammed VI",
    address: "Avenue Ibn Sina, Marrakech",
    latitude: 31.6570,
    longitude: -8.0128,
    bloodUrgencyLevel: 70,
    bloodTypesNeeded: ["O+", "A+", "AB+"],
    hasUrgentNeed: true
  },
  {
    id: "mar2",
    name: "Hôpital Ibn Tofail",
    address: "Rue Abdelouahab Derraq, Marrakech",
    latitude: 31.6278,
    longitude: -8.0050,
    bloodUrgencyLevel: 55,
    bloodTypesNeeded: ["A-", "B+"],
    hasUrgentNeed: false
  }
];

const fesHospitals: MockHospital[] = [
  {
    id: "fes1",
    name: "CHU Hassan II",
    address: "Route Sidi Harazem, Fès",
    latitude: 34.0393,
    longitude: -4.9966,
    bloodUrgencyLevel: 85,
    bloodTypesNeeded: ["O-", "AB-", "B-"],
    hasUrgentNeed: true
  },
  {
    id: "fes2",
    name: "Centre Régional de Transfusion Sanguine de Fès",
    address: "Boulevard Mohammed V, Fès",
    latitude: 34.0344,
    longitude: -5.0062,
    bloodUrgencyLevel: 90,
    bloodTypesNeeded: ["O+", "O-", "A+", "B+"],
    hasUrgentNeed: true
  }
];

const tangierHospitals: MockHospital[] = [
  {
    id: "tan1",
    name: "Hôpital Mohammed V",
    address: "Avenue Mohammed VI, Tanger",
    latitude: 35.7633,
    longitude: -5.8320,
    bloodUrgencyLevel: 60,
    bloodTypesNeeded: ["A+", "B+"],
    hasUrgentNeed: false
  },
  {
    id: "tan2",
    name: "Centre de Transfusion Sanguine de Tanger",
    address: "Boulevard Mohammed V, Tanger",
    latitude: 35.7710,
    longitude: -5.8280,
    bloodUrgencyLevel: 75,
    bloodTypesNeeded: ["O-", "AB+"],
    hasUrgentNeed: true
  }
];

const agadirHospitals: MockHospital[] = [
  {
    id: "aga1",
    name: "CHU Agadir",
    address: "Avenue Hassan II, Agadir",
    latitude: 30.4265,
    longitude: -9.6072,
    bloodUrgencyLevel: 70,
    bloodTypesNeeded: ["A+", "O+"],
    hasUrgentNeed: true
  }
];

// Default hospitals for other cities
const defaultHospitals: MockHospital[] = [
  {
    id: "def1",
    name: "Centre Hospitalier Régional",
    address: "Centre-ville",
    latitude: 0,
    longitude: 0,
    bloodUrgencyLevel: 65,
    bloodTypesNeeded: ["O+", "A+"],
    hasUrgentNeed: true
  },
  {
    id: "def2",
    name: "Centre de Transfusion Sanguine",
    address: "Avenue principale",
    latitude: 0,
    longitude: 0,
    bloodUrgencyLevel: 80,
    bloodTypesNeeded: ["O-", "B+", "AB-"],
    hasUrgentNeed: true
  }
];

// Map cities to their respective hospital lists
const cityToHospitals: { [key: string]: MockHospital[] } = {
  "Casablanca": casablancaHospitals,
  "Rabat": rabatHospitals,
  "Marrakesh": marrakeshHospitals,
  "Fes": fesHospitals,
  "Tangier": tangierHospitals,
  "Agadir": agadirHospitals
};

export function getMockHospitalsForCity(city: string): MockHospital[] {
  // Normalize city name for case-insensitive comparison
  const normalizedCity = city.toLowerCase();
  
  // Find the matching city in our data
  const matchingCity = Object.keys(cityToHospitals).find(
    c => c.toLowerCase() === normalizedCity
  );
  
  // Return hospitals for the matching city, or default hospitals if no match
  return matchingCity ? cityToHospitals[matchingCity] : defaultHospitals;
}
