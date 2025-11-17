import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { WelcomeDialogComponent } from './components/welcome-dialog/welcome-dialog.component';
import { OceanBackgroundComponent } from './components/ocean-background/ocean-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WorldMapComponent, WelcomeDialogComponent, OceanBackgroundComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projectworldcrisis');
}
