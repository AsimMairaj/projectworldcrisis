import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Mode {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private currentModeSubject = new BehaviorSubject<Mode>({
    id: 'all',
    name: 'Summary Overview',
    icon: '🌍',
    description: 'Overall summary outlook of all crisis situations',
    color: 'from-blue-500 to-purple-500'
  });

  public currentMode$: Observable<Mode> = this.currentModeSubject.asObservable();

  getCurrentMode(): Mode {
    return this.currentModeSubject.value;
  }

  setCurrentMode(mode: Mode): void {
    this.currentModeSubject.next(mode);
  }
}
