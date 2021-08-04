Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore

@Mankunian
Mankunian
	/
	slices - ng2
1
10
Code
Issues
Pull requests
10
Actions
Projects
Wiki
Security
11
Insights
Settings
slices - ng2 / src / app / app.component.ts /
@Mankunian
Mankunian Соединение с веб - сокетом сразу после того как перешлина срезы, Убрал …
…
Latest commit bee4748 on 29 May
History
1 contributor
We found potential security vulnerabilities in your dependencies.
Only the owner of this repository can see this message.

115 lines(103 sloc)  3.55 KB

import { Component, OnInit } from "@angular/core";
import { HttpService } from './services/http.service';
import { TabMenuComponent } from "../app/tab-menu/tab-menu.component";
import { NavBarComponent } from "../app/nav-bar/nav-bar.component";
import { GlobalConfig } from './global';
import { ErrorHandlerService } from './services/error-handler.service';

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	userInfo: Record<string, any>;
	marqueeText: any[];
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(private http: HttpService,
		public tabMenuComponent: TabMenuComponent,
		public navbarComponent: NavBarComponent,
		public errorHandler: ErrorHandlerService,
	) {
	}

	ngOnInit() {
		this.checkAccessTokenFromAdminRedirect();
		this.checkTokenForValidation();
		this.checkNotification();
		let hostname = window.location.hostname;
		sessionStorage.setItem('hostname', hostname)
	}

	checkAccessTokenFromAdminRedirect() {
		if (window.location.search !== '') {
			let search = window.location.search.substr(7);
			let splittedSearch = search.split('&');
			console.log(splittedSearch)
			console.log(splittedSearch[0])
			console.log(splittedSearch[1])
			console.log(splittedSearch[2])
			console.log(splittedSearch[3])
			let accessToken = splittedSearch[0];
			let refreshToken = splittedSearch[1].substr(14);
			let lang = splittedSearch[2].substr(5);
			let appCode = splittedSearch[3].substr(8);
			let hostName = window.location.origin;

			sessionStorage.setItem('token', accessToken);
			sessionStorage.setItem('refresh_token', refreshToken);
			sessionStorage.setItem('lang', lang);
			sessionStorage.setItem('appCode', appCode);
			window.location.href = hostName;
		} else if (!sessionStorage.token) {
			alert('У вас недостаточно прав')
			// Here redirect to local IP-address url of admin 
			window.location.href = GlobalConfig.ADMIN_PAGE
		}
	}

	checkTokenForValidation() {
		this.http.checkTokenValidationService().subscribe(data => {
			if (data == null) {
				let tokenIsValid = 'true';
				sessionStorage.setItem('tokenIsValid', tokenIsValid);
			}
		}, error => {
			console.log(error);
			this.errorHandler.alertError(error);
		})
	}

	checkNotification() {
		let appCode = sessionStorage.getItem('appCode');
		this.http.getTechnicalNotificationService(appCode).subscribe((data: any) => {
			this.marqueeText = [];
			data.forEach(element => {
				if (element.status == 'PLANNED') {
					this.marqueeText.push(element);
					element.startDate = this.convertStartDate(element);
					element.endDate = this.convertEndDate(element);
				}
			});
		}, error => {
			this.errorHandler.alertError(error)
		})
	}

	convertStartDate(element) {
		let year, month, dt, hour, minute
		let startDate = new Date(element.startDate);
		year = startDate.getFullYear();
		month = startDate.getMonth() + 1;
		dt = startDate.getDate();
		hour = startDate.getUTCHours() + 6;
		minute = startDate.getUTCMinutes();

		if (hour < 10) hour = '0' + hour;
		if (minute < 10) minute = '0' + minute;
		if (dt < 10) dt = '0' + dt;
		if (month < 10) month = '0' + month;

		return dt + '/' + month + '/' + year + ', ' + hour + ':' + minute;

	}

	convertEndDate(element) {
		let year, month, dt, hour, minute
		let endDate = new Date(element.endDate);
		year = endDate.getFullYear();
		month = endDate.getMonth() + 1;
		dt = endDate.getDate();
		hour = endDate.getUTCHours() + 6;
		minute = endDate.getUTCMinutes();

		if (hour < 10) hour = '0' + hour;
		if (minute < 10) minute = '0' + minute;
		if (dt < 10) dt = '0' + dt;
		if (month < 10) month = '0' + month;
		return dt + '/' + month + '/' + year + ' ,' + hour + ':' + minute;
	}
}
© 2021 GitHub, Inc.
	Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete