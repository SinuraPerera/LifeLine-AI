export type Language = 'en' | 'si' | 'ta';

export interface EmergencyGuide {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string; // Lucide icon name
  color: string; // hex or tailwind text/bg color class
  steps: Record<Language, string[]>;
  metronomeBpm?: number; // Optional bpm for metronome (e.g., CPR)
  warnings: Record<Language, string[]>;
}

export interface Hospital {
  id: string;
  name: Record<Language, string>;
  address: Record<Language, string>;
  phone: string;
  lat: number;
  lng: number;
  distanceKm: number;
  bedsAvailable: number;
  hasTraumaCenter: boolean;
  hasICU: boolean;
  facilities: Record<Language, string[]>;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'image-analysis';
  imageUrl?: string;
  isStreaming?: boolean;
}

export interface GPSCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface EmergencyLog {
  id: string;
  userId: string;
  timestamp: string;
  type: string;
  coords: GPSCoords;
  description: string;
  status: 'active' | 'resolved' | 'dispatched';
  triageLevel: 'low' | 'medium' | 'high' | 'critical';
}
