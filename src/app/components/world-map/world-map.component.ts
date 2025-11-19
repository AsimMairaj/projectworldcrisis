import { Component, PLATFORM_ID, Inject, AfterViewInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import * as maplibregl from 'maplibre-gl';
import { ModeService, Mode } from '../../services/mode.service';
import { StatsService } from '../../services/stats.service';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-world-map",
  standalone: true,
  templateUrl: "./world-map.component.html",
  styleUrls: ["./world-map.component.css"],
})
export class WorldMapComponent implements AfterViewInit, OnDestroy {
  @Output() countryClicked = new EventEmitter<string>();

  private map: maplibregl.Map | undefined;
  private modeSubscription: Subscription | undefined;
  private currentMode: Mode | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private statsService: StatsService,
    private modeService: ModeService
  ) {}

  ngAfterViewInit(): void {
    // Only initialize map in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Load stats data first
      this.statsService.getStats().subscribe(() => {
        // Add a small delay to ensure DOM is fully ready
        setTimeout(() => {
          this.initializeMap();
        }, 100);
      });
    }
  }

  private initializeMap(): void {
    try {
      this.map = new maplibregl.Map({
        container: 'map', // container id
        style: 'https://demotiles.maplibre.org/globe.json', // style URL
        center: [0, 0], // starting position [lng, lat]
        zoom: 2 // starting zoom
      });

      this.map.on('load', () => {
        this.setupCountryLayer();
        this.subscribeModeChanges();
        this.setupCountryClickHandler();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private setupCountryLayer(): void {
    if (!this.map) return;

    // Add GeoJSON source for countries
    this.map.addSource('countries', {
      type: 'geojson',
      data: '/countries.geojson'
    });

    // Add fill layer for countries
    this.map.addLayer({
      id: 'country-fill',
      type: 'fill',
      source: 'countries',
      paint: {
        'fill-color': '#9ca3af', // Default gray color
        'fill-outline-color': '#444444',
        'fill-opacity': 0.7
      }
    });

    // Update colors based on initial mode
    this.updateCountryColors();
  }

  private subscribeModeChanges(): void {
    // Subscribe to mode changes from the mode service
    this.currentMode = this.modeService.getCurrentMode();
    this.modeSubscription = this.modeService.currentMode$.subscribe((mode: Mode) => {
      this.currentMode = mode;
      this.updateCountryColors();
    });
  }

  private updateCountryColors(): void {
    if (!this.map || !this.currentMode) return;

    // Get all countries from stats and add their colors
    this.statsService.getStats().subscribe(stats => {
      // Build color expression based on country name (the 'name' property in the GeoJSON)
      const colorExpression: any[] = ['match', ['get', 'name']];

      // Add each country's color based on severity
      if (stats.length > 0) {
        stats.forEach(country => {
          const severity = this.statsService.getSeverityForCountry(country.country, this.currentMode!.id);
          const color = this.statsService.getSeverityColor(severity);
          // Use country name as the key to avoid duplicates
          colorExpression.push(country.country, color);
        });
      }

      // Add default color for countries not in stats (required by match expression)
      colorExpression.push('#9ca3af'); // gray-400 as default

      // Update the map layer only if it has valid data
      if (this.map && this.map.getLayer('country-fill') && colorExpression.length >= 4) {
        this.map.setPaintProperty('country-fill', 'fill-color', colorExpression);
      }
    });
  }

  private setupCountryClickHandler(): void {
    if (!this.map) return;

    // Change cursor to pointer when hovering over countries
    this.map.on('mouseenter', 'country-fill', () => {
      if (this.map) {
        this.map.getCanvas().style.cursor = 'pointer';
      }
    });

    // Change cursor back when leaving countries
    this.map.on('mouseleave', 'country-fill', () => {
      if (this.map) {
        this.map.getCanvas().style.cursor = '';
      }
    });

    // Handle country clicks
    this.map.on('click', 'country-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const countryName = e.features[0].properties?.['name'];
        if (countryName) {
          this.countryClicked.emit(countryName);
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from mode changes
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }

    // Clean up map instance
    if (this.map) {
      this.map.remove();
    }
  }
}
