import { Component, OnInit } from "@angular/core";
import { HttpService } from './services/http.service';
import { TabMenuComponent } from "../app/tab-menu/tab-menu.component";
import { NavBarComponent } from "../app/nav-bar/nav-bar.component";
import { GlobalConfig } from './global';
import { ErrorHandlerService } from './services/error-handler.service';
import { ActivatedRoute, Router } from "@angular/router";

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
		private route: ActivatedRoute,
		private router: Router
	) {
	}

	ngOnInit() {
		this.checkAccessTokenFromAdminRedirect();
		this.checkTokenForValidation();
		this.checkNotification();
		let hostname = window.location.hostname;
		sessionStorage.setItem('hostname', hostname)
	}

	// checkAccessTokenFromAdminRedirect() {
	// 	if (window.location.search !== '') {
	// 		let token, refreshToken, lang, appCode;
	// 		this.route.queryParams.subscribe(params => {
	// 			token = params['token'];
	// 			refreshToken = params['refresh_token'];
	// 			lang = params['lang'];
	// 			appCode = params['appCode'];
	// 			sessionStorage.setItem('token', token);
	// 			sessionStorage.setItem('refresh_token', refreshToken);
	// 			sessionStorage.setItem('lang', lang);
	// 			sessionStorage.setItem('appCode', appCode);

	// 			console.log(token)
	// 		});
	// 	} else if (!sessionStorage.token) {
	// 		alert('У вас недостаточно прав');
	// 		window.location.href = GlobalConfig.ADMIN_PAGE
	// 	}
	// }

	checkAccessTokenFromAdminRedirect() {
		if (window.location.search !== '') {
			let search = window.location.search.substr(7);
			let splittedSearch = search.split('&');
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
			alert('У вас недостаточно прав');
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
