import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { SaveEditReasonObj } from "./../saveEditReasonObj";
import { TreeNode } from 'primeng/api';
import { GlobalConfig } from '../global';
import { Subscription } from 'rxjs';
import { SharedService } from './shared.service';

// eslint-disable-next-line prettier/prettier
@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private BASE_API_URL = GlobalConfig.BASE_API_URL;
	private ADMIN_URL = GlobalConfig.ADM_URL;
	private baseAuthUser = GlobalConfig.BASE_AUTH_USER
	public changeLang: unknown = 'RU';
	public checkDeleted: unknown = false;
	public subscription: Subscription;

	constructor(private http: HttpClient, shared: SharedService) {
		this.subscription = shared.subjChangeLang$.subscribe(lang => {
			this.changeLang = lang;
		})
		this.subscription = shared.subjCheckDeleted$.subscribe(checkDeleted => {
			this.checkDeleted = checkDeleted
		})
	}

	getTechnicalNotificationService(appCode) {
		return this.http.get(GlobalConfig.ADM_URL + '/api/v1/ru/adm-core/maintenance-messages/?app-code=' + appCode);
	}

	checkTokenValidationService() {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + 'test', options)
	}

	getPermissionsByUserService() {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(GlobalConfig.ADM_URL + '/api/v1/RU/adm-core/my/permissions', options)
	}

	getUserInfoService(userId) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(GlobalConfig.ADM_URL + '/api/v1/RU/adm-core/users/' + userId, options)
	}

	changePassUserService(newPass, currentPass, userId) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		const body = {
			"currentPassword": currentPass,
			"newPassword": newPass
		}
		return this.http.put(GlobalConfig.ADM_URL + '/api/v1/RU/adm-core/users/' + userId + '/change-password', body, options)
	}

	getGroupList() {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/groups', options)
	}

	getTerritories() {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/territories', options)
	}

	getSliceNumber() {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/max', options);
	}

	getSlices(groupCode, statusCode, year) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices' + '?deleted=' + this.checkDeleted + '&groupCode=' + groupCode + '&statusCode=' + statusCode + '&year=' + year, options)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getSliceGroups() {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/parents' + '?deleted=' + this.checkDeleted, options)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getHistory(sliceId: number) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/history', options)
	}

	getUsers() {
		return this.http.get('./assets/json/users.json')
	}

	getDataGridInAgreement(sliceId: number, historyId: number) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/history/' + historyId + '/approving', options)
	}

	getReportsBySliceIdService(sliceId) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/reports?sliceId=' + sliceId, options)
	}

	getRegions() {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/regsTree', options)
	}

	getGroups4DialogTable(repGroup, reportCode) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/governments/parents?group=' + repGroup + '&report=' + reportCode, options)
	}

	getGroupsChildren4DialogTable(searchPattern, repGroup) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/governments/children?searchPattern=' + searchPattern + '&group=' + repGroup, options)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getDepsByReportId(reportId) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/orgs?reportCode=' + reportId, options)
	}

	confirmSliceService(sliceId: number) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/confirm', body, options)
	}

	deleteSliceService(sliceId: number) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/delete', body, options)
	}

	sendToPreliminaryService(sliceId: number) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/preliminary', body, options)
	}

	sendToAgreementService(sliceId: number) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/send', body, options)
	}

	generateReports(lang, data) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		return this.http.post(this.BASE_API_URL + this.changeLang + '/slices/reports/createReports?repLang=' + lang, data, options)
	}

	postOrderSlice(orderSliceObj: OrderSliceObj) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }

		const body = {
			startDate: orderSliceObj.startDate,
			endDate: orderSliceObj.endDate,
			maxRecNum: orderSliceObj.maxRecNum,
			groups: orderSliceObj.groups
		}

		return this.http.post(this.BASE_API_URL + this.changeLang + '/slices', body, options);
	}

	rejectSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		const body = {
			historyId: saveEditReasonObj.historyId,
			approveCode: saveEditReasonObj.approveCode,
			territoryCode: saveEditReasonObj.territoryCode,
			msg: saveEditReasonObj.msg
		};
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/approve', body, options)
	}

	approveSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let token = sessionStorage.token;
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + token
		});

		let options = { headers: headers }
		const body = {
			historyId: saveEditReasonObj.historyId,
			approveCode: saveEditReasonObj.approveCode,
			territoryCode: saveEditReasonObj.territoryCode,
			msg: saveEditReasonObj.msg
		};
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/approve', body, options)
	}

	refreshTokenService() {
		console.log(this.ADMIN_URL)
		debugger;
		let refreshToken = sessionStorage.refresh_token;
		let appCode = sessionStorage.appCode;
		let appPass = sessionStorage.appPass;
		let lang = sessionStorage.lang

		const details = {
			'grant_type': 'refresh_token',
			'refresh_token': refreshToken,
			'lang': lang
		};

		let formBody = [];
		let formBodyString = '';

		for (const property in details) {
			const encodedKey = encodeURIComponent(property);
			const encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + encodedValue);
		}
		formBodyString = formBody.join('&');

		return this.http.post(this.ADMIN_URL + '/oauth/token', formBodyString, {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'Authorization': 'Basic ' + btoa(appCode + ':' + appPass)
			})
		})
	}
}
