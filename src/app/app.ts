import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorldMapComponent } from './components/world-map/world-map.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WorldMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projectworldcrisis');
}
