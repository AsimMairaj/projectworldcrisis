import { Component, OnInit, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from '@angular/common'; 
import type * as L from 'leaflet'; 

@Component({
  selector: "app-world-map",
  templateUrl: "./world-map.component.html",
  styleUrls: ["./world-map.component.css"],
})
export class WorldMapComponent implements OnInit {
  
  // Store the map instance so we can access it later for redrawing
  private mapInstance: L.Map | null = null; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.initMap();
    // CRITICAL: Call the resize after a safe delay
    this.ensureMapSize();
  }

  private initMap(): void { 
    if (isPlatformBrowser(this.platformId)) {
      const Leaflet = (window as any).L as typeof L;
      
      if (typeof Leaflet === 'undefined') {
        console.error("Leaflet object 'L' not found.");
        return; 
      }
      
      // 3. INITIALIZE THE MAP and store the instance
      this.mapInstance = Leaflet.map('map').setView([0, 0], 2); 

      // 4. ADD TILE LAYER 
      Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.mapInstance);

      // 5. ADD MARKER 
      Leaflet.marker([34.05, -118.24]) 
          .addTo(this.mapInstance)
          .bindPopup('A Sample Crisis Location') 
          .openPopup(); 
    }
  }
  
  // New method to explicitly handle the resize
  private ensureMapSize(): void {
    if (this.mapInstance && isPlatformBrowser(this.platformId)) {
      // CRITICAL FIX: Increase delay to 1000ms (1 second) for absolute layout stability
      setTimeout(() => {
          console.log("Forcing map redraw (invalidateSize) after 1000ms delay.");
          this.mapInstance!.invalidateSize(); 
      }, 1000); 
    }
  }
}