import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CountryStats {
  country: string;
  iso_a3: string;
  capital: string;
  population: number;
  area_km2: number;
  region: string;
  poverty?: {
    severity: number;
    mpi: number;
    mpi_description: string;
    poverty_headcount_ratio: number;
    extreme_poverty_percentage: number;
    gini_coefficient: number;
  };
  hunger?: {
    severity: number;
    ghi: number;
    ghi_category: string;
    ghi_description: string;
    undernourishment_percentage: number;
    child_stunting_percentage: number;
    child_wasting_percentage: number;
    child_mortality_rate: number;
  };
  conflict?: {
    severity: number;
    civilian_deaths_12mo: number;
    displaced_persons: number;
    conflict_status: string;
    conflict_description: string;
    refugees: number;
    internally_displaced: number;
    conflict_severity: string;
    affected_regions: string[];
  };
  drought?: {
    severity: number;
    spei: number;
    spei_description: string;
    drought_severity: string;
    water_stress_level: string;
    agricultural_impact: string;
    affected_population: number;
  };
  crisis_summary: string;
  last_updated: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statsCache: CountryStats[] | null = null;

  constructor(private http: HttpClient) { }

  getStats(): Observable<CountryStats[]> {
    if (this.statsCache) {
      return of(this.statsCache);
    }

    return this.http.get<CountryStats[]>('/stats/stats.json').pipe(
      map(stats => {
        this.statsCache = stats;
        return stats;
      }),
      catchError(error => {
        console.error('Error loading stats:', error);
        return of([]);
      })
    );
  }

  getSeverityForCountry(countryName: string, mode: string): number {
    if (!this.statsCache) {
      return 0; // Return 0 if data not loaded yet
    }

    // Try to find by country name (case-insensitive)
    const country = this.statsCache.find(c =>
      c.country.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) {
      return 0; // Country not found
    }

    // Handle different modes
    switch (mode) {
      case 'poverty':
        return country.poverty?.severity || 0;
      case 'drought':
        return country.drought?.severity || 0;
      case 'conflict':
        return country.conflict?.severity || 0;
      case 'famine':
        return country.hunger?.severity || 0;
      case 'all':
        // For 'all' mode, calculate average severity
        const severities = [
          country.poverty?.severity || 0,
          country.drought?.severity || 0,
          country.conflict?.severity || 0,
          country.hunger?.severity || 0
        ].filter(s => s > 0);
        return severities.length > 0
          ? Math.round(severities.reduce((a, b) => a + b, 0) / severities.length)
          : 0;
      default:
        return 0;
    }
  }

  getSeverityColor(severity: number): string {
    // Map severity (1-5) to colors: 1=green, 2=yellow-green, 3=yellow, 4=orange, 5=red
    switch (severity) {
      case 1:
        return '#4ade80'; // green-400
      case 2:
        return '#60a5fa'; // blue-400
      case 3:
        return '#facc15'; // yellow-400
      case 4:
        return '#fb923c'; // orange-400
      case 5:
        return '#f87171'; // red-400
      default:
        return '#9ca3af'; // gray-400 (default/no data)
    }
  }
}
