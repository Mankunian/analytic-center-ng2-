/* eslint-disable prettier/prettier */
let hostname = window.location.hostname;
sessionStorage.setItem('hostname', hostname);

let username;
// console.log(JSON.parse(sessionStorage.userInfo));
if (sessionStorage.userInfo) {
	let userInfo = JSON.parse(sessionStorage.userInfo);
	username = userInfo.fullName;
}


const sourceURLs = {
	ADM_PAGE: '',
	ADM_API_URL: '',
	BASE_API_URL: window.location.protocol.toString() + "//" + hostname.toString() + ":8081/api/v1/",
	SOCKET_URL: window.location.protocol.toString() + "//" + hostname.toString() + ":8085/notifications/",
}
if (hostname === 'localhost') {
	sourceURLs.ADM_PAGE = 'http://localhost:4200';
	sourceURLs.ADM_API_URL = 'https://18.138.17.74:8084';
	sourceURLs.BASE_API_URL = 'https://18.140.232.52:8081/api/v1/';
	sourceURLs.SOCKET_URL = 'https://18.138.17.74:8085/notifications/';
}
else if (hostname.startsWith("10")) {
	sourceURLs.ADM_PAGE = "http://10.2.30.69";
	sourceURLs.ADM_API_URL = "http://10.2.30.69:8084";
	sourceURLs.SOCKET_URL = 'http://192.168.210.41:8085/notifications/';
}
else if (hostname.startsWith("192")) {
	sourceURLs.ADM_PAGE = 'http://192.168.210.69';
	sourceURLs.ADM_API_URL = 'http://192.168.210.69:8084';
	sourceURLs.SOCKET_URL = 'http://192.168.210.41:8085/notifications/';
}
else if (hostname.startsWith("master")) {
	sourceURLs.ADM_PAGE = 'https://master.d260huhvcvtk4w.amplifyapp.com';
	sourceURLs.ADM_API_URL = 'https://18.138.17.74:8084';
	sourceURLs.BASE_API_URL = 'https://18.140.232.52:8081/api/v1/';
	sourceURLs.SOCKET_URL = 'https://18.138.17.74:8085/notifications/';
}
else if (hostname.startsWith('stat')) {
	sourceURLs.ADM_PAGE = 'https://ac.kgp.kz';
	sourceURLs.ADM_API_URL = 'https://ac.kgp.kz:8084';
	sourceURLs.SOCKET_URL = 'https://stat.kgp.kz:8085/notifications/'
}




export const GlobalConfig = Object.freeze({

	BASE_API_URL: sourceURLs.BASE_API_URL,
	SOCKET_URL: sourceURLs.SOCKET_URL,
	ADM_URL: sourceURLs.ADM_API_URL,
	ADMIN_PAGE: sourceURLs.ADM_PAGE,


	BASE_AUTH_USER: username,
	STATUS_CODES: {
		IN_PROCESSING: "0", // В обработке
		APPROVED: "1", // Утвержден
		PRELIMINARY: "2", // Предварительный
		DELETED: "3", // Удален
		CANCELED_BY_USER: "4", // Отменен пользователем
		FORMED_WITH_ERROR: "5", // Сформирован с ошибкой
		WAITING_FOR_PROCESSING: "6", // В ожидании обработки
		IN_AGREEMENT: "7", // На согласовании
	},
	HIERARCHY_REPORTS: {
		GROUP_001: 0o1,
		GROUP_002: 0o2,
		GROUP_003: 0o3,
		GROUP_004: 0o4,
		GROUP_005: 0o5,
		GROUP_006: 0o6,
		GROUP_007: 0o7,
	},
	REPORT_GROUPS: {
		UGOLOV_PRESLED: 0o2,
		PROSECUTORS_WORK: 0o3,
		COURT_REPORTS: 0o4,
		KUI: 0o5,
		ADMIN_VIOLATIONS: 0o6,
		ERSOP: 100,
		KISA: 101,
		PROKURATURA: 102,
		CIVIL_CASES: 103,
		GPS_CORRUPTION: 104,
		F8: 105,
		GP_F7: 106,
		ROZYSK: 110,
		OM_SU: 112,
		GPS_F5: 115,
		VS_ADMIN_DELA: 118,
		VS_UGOLOV_DELA: 120,
		OL: 125,
		PSISU: 130
	}
});
