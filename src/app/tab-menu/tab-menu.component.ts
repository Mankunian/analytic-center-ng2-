import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { HttpService } from "../services/http.service";
import { SliceNumber } from "../sliceNumber";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { SharedService } from "../services/shared.service";
import { TreeNode } from "primeng/api/treenode";
import { ErrorHandlerService } from "../services/error-handler.service";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../date.adapter';
import { MessageService } from "primeng/api";

@Component({
	selector: "app-tab-menu",
	templateUrl: "./tab-menu.component.html",
	styleUrls: ["./tab-menu.component.scss"],
	providers: [HttpService, MessageService,
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	],
})
export class TabMenuComponent implements OnInit {
	groupListFormGroup: FormGroup;
	groupList: any;
	max: number;
	checkedGroupCodes: any;
	checkedGroupList: any = [];
	enableStatus: boolean;
	orderSliceDone: boolean;
	selected = 0;
	checkedGroups: any = [];
	onTabSelectedIndex: number;
	preloaderByOrderSlice: boolean;
	checkDeleted = false;

	subscription: Subscription;
	groupListKaz: any;
	shared: any;
	disabledBtn = true;
	lang: string;

	gridData: TreeNode[];

	dateFrom = new FormControl(new Date(new Date().getFullYear(), 0, 1));
	dateTo = new FormControl(new Date());

	sliceNumber: SliceNumber;
	permissionsArr: any[];
	permissionElem: any;
	elementPermissionList: any;
	elementGroup: any;


	constructor(
		private httpService: HttpService,
		private formBuilder: FormBuilder,
		public translate: TranslateService,
		public getShared: SharedService,
		private service: SharedService,
		public errorHandler: ErrorHandlerService,
		private messageService: MessageService
	) {
		translate.addLangs(["ru", "kaz", "qaz"]);
		translate.setDefaultLang("ru");
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz|qaz/) ? browserLang : "ru");

		this.subscription = getShared.subjGroupListKaz$.subscribe(value => {
			this.groupList = value;
			this.groupList.forEach(element => {
				if (element.status == 2) {
					element.disabledStatus = true;
				}
			});
		});
	}

	ngOnInit() {
		this.groupListFormGroup = this.formBuilder.group({
			groupList: this.formBuilder.array([]),
		});
		this.getGroupList()
		this.getSliceNumber()
	}

	getGroupList() {
		// console.log('Получение групп отчетов')
		this.httpService.getGroupList().subscribe(data => {
			this.groupList = data;
			let permissionReport = []
			let permissionDelete = []
			let permissionCreate = []
			let permissionConfirm = []
			let permissionApprove = []
			let permissionList = JSON.parse(sessionStorage.getItem('permissionCodesList'))


			this.groupList.forEach(elementGroup => {
				if (sessionStorage.permissionCodesList) {
					permissionList.forEach(elementPermission => {
						if (elementPermission == elementGroup.permissionReport) {
							permissionReport.push(elementGroup)
							sessionStorage.setItem('permissionReport', JSON.stringify(permissionReport))
						}
						else if (elementPermission == elementGroup.permissionCreate) {
							elementGroup.enableStatus = true;
							permissionCreate.push(elementGroup)
							sessionStorage.setItem('permissionCreate', JSON.stringify(permissionCreate))
						}
						else if (elementPermission == elementGroup.permissionDelete) {
							permissionDelete.push(elementGroup)
							sessionStorage.setItem('permissionDelete', JSON.stringify(permissionDelete))
						}
						else if (elementPermission == elementGroup.permissionConfirm) {
							permissionConfirm.push(elementGroup)
							sessionStorage.setItem('permissionConfirm', JSON.stringify(permissionConfirm))
						}
						else if (elementPermission == elementGroup.permissionApprove) {
							permissionApprove.push(elementGroup)
							sessionStorage.setItem('permissionApprove', JSON.stringify(permissionApprove))
						}
					});
				} else {
					// alert('sessionStorage has no permissionCodesList')
				}
			});
		},
			error => {
				console.log(error)
				this.errorHandler.alertError(error);
			}
		);
	}

	getSliceNumber() {
		this.httpService.getSliceNumber().subscribe(
			(data: SliceNumber) => {
				this.max = data.value;
			},
			error => {
				console.log(error)
				this.errorHandler.alertError(error);
			}
		);
	}

	onCheckedGroup(event) {
		this.disabledBtn = false;
		this.checkedGroups.push(event);
		this.checkedGroupCodes = event.source.value.code;

		// eslint-disable-next-line no-underscore-dangle
		if (event.source._checked) {
			this.checkedGroupList.push(this.checkedGroupCodes);
		} else {
			let a = this.checkedGroupList.indexOf(this.checkedGroupCodes);
			this.checkedGroupList.splice(a, 1);
		}

		if (this.checkedGroupList.length == 0) {
			this.disabledBtn = true;
		}
	}

	onTabSelectedEvent(event) {
		this.selected = event.index;
	}

	orderSlice() {
		this.dateFrom.value.setHours(0);
		this.dateFrom.value.setMinutes(0);
		this.dateFrom.value.setSeconds(0);

		this.dateTo.value.setHours(0);
		this.dateTo.value.setMinutes(0);
		this.dateTo.value.setSeconds(0);

		let dateFrom = this.dateFrom.value,
			ddFrom = ("0" + dateFrom.getDate()).slice(-2),
			mmFrom = ("0" + (dateFrom.getMonth() + 1)).slice(-2),
			yyFrom = dateFrom.getFullYear();
		let dateFromInput = ddFrom + "." + mmFrom + "." + yyFrom;

		let dateTo = this.dateTo.value,
			ddTo = ("0" + dateTo.getDate()).slice(-2),
			mmTo = ("0" + (dateTo.getMonth() + 1)).slice(-2),
			yyTo = dateTo.getFullYear();
		let dateToInput = ddTo + "." + mmTo + "." + yyTo;

		let orderSliceObj = {
			startDate: dateFromInput,
			endDate: dateToInput,
			maxRecNum: this.max,
			groups: this.checkedGroupList,
		};

		this.httpService.postOrderSlice(orderSliceObj).subscribe(
			(data: any) => {
				this.service.sendOrderSliceList(data);
				this.preloaderByOrderSlice = true;
				this.checkedGroups.forEach(element => {
					// eslint-disable-next-line no-underscore-dangle
					element.source._checked = false; // uncheck all selected value after response
				});
				this.checkedGroupList.length = 0; // clear checkbox array after response
				this.selected = 0; // transfer to Home Tab after response
				this.preloaderByOrderSlice = false;

				data.forEach(element => {
					this.showToastMessage(element);
				});
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}

	showToastMessage(elem) {
		console.log(elem)
		let groupName = elem.groupName;
		let period = elem.period;
		let detail = groupName + '' + period
		this.messageService.add({ severity: 'info', summary: 'Сформирован срез', detail: detail });

	}
}