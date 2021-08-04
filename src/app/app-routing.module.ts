import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';

const routes: Routes = [
	// { path: 'main', component: AppComponent },
	// { path: '', redirectTo: '/main', pathMatch: 'full' },
	// { path: '**', redirectTo: '/main' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
