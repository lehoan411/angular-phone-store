import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLayoutComponent } from "./shared/header-layout/header-layout.component";
import { FooterLayoutComponent } from "./shared/footer-layout/footer-layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderLayoutComponent, FooterLayoutComponent ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
