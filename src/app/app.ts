import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { WelcomeDialogComponent } from './components/welcome-dialog/welcome-dialog.component';
import { OceanBackgroundComponent } from './components/ocean-background/ocean-background.component';
import { CountryPopUpDialogComponent } from './components/country-pop-up-dialog/country-pop-up-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WorldMapComponent, WelcomeDialogComponent, OceanBackgroundComponent, CountryPopUpDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projectworldcrisis');

  // Control country dialog visibility
  showCountryDialog = signal(false);
  selectedCountry = signal<string | undefined>(undefined);

  openCountryDialog(countryName?: string) {
    this.selectedCountry.set(countryName);
    this.showCountryDialog.set(true);
  }

  closeCountryDialog() {
    this.showCountryDialog.set(false);
  }
}
