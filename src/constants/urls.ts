import { urlBase } from './urlbase';

//users

//List Users
export const urlGetAllCMSUsers = `${urlBase}/users/`;
export const urlCreateUser = `${urlBase}/users/createuser`;
export const urlUpdateUser = `${urlBase}/users/modifyuser`;

export const urlAuthLogin = `${urlBase}/auth/login`;
export const urlUpdateCMSUser = `${urlBase}/urlUpdateUser`;
export const urlGetAllMobileUsers = `${urlBase}/users-mobile-cms/listUsers`;
export const urlGetAllMobileTransactions = `${urlBase}/users-mobile-cms/reporttransactions`;

//Roles
//Get roles
export const urlGetRoles = `${urlBase}/users/roles`;

//Create role
export const urlCreateRoles = `${urlBase}/users/createrole`;
//Update role
export const urlUpdateRoles = `${urlBase}/users/modifyrole`;

//Modules
export const urlGetModules = `${urlBase}/menu/modules`;
export const urlGetCategories = `${urlBase}/menu/categories`;
export const urlGetModulesByRol = `${urlBase}/menu/modulesbyrole`;
export const urlListAvailableModules = `${urlBase}/menu/listAvailableModules`;

//Ecommerce - Collections
export const urlGetCollections = `${urlBase}/products-cms/getInfoCollections`;
export const urlUpdateCollections = `${urlBase}/products-cms/updateCollection`;
export const urlCreateCollections = `${urlBase}/products-cms/createCollection`;
export const urlListAvailableCollections = `${urlBase}/products-cms/listCmsCollections/`;

//Ecommerce - Products
export const urlGetAllProducts = `${urlBase}/products-cms/listproducts/`;
export const urlCreateProductRequest = `${urlBase}/products-cms/createProduct`;
export const urlUpdateProductRequest = `${urlBase}/products/updateProduct`;

//Ecommerce - Brands
export const urlGetBrands = `${urlBase}/products-cms/getBrands/`;
export const urlCreateBrand = `${urlBase}/products-cms/createBrand`;
export const urlUpdateBrand = `${urlBase}/products-cms/updateBrand`;

//Ecommerce - Categories
export const urlGetCMSCategories = `${urlBase}/products-cms/getCategories`;

//Ecommerce - Subcategories
export const urlGetCMSSubcategories = `${urlBase}/products-cms/getSubcategories`;

//Recover Password
export const urlRecoverPassword = `${urlBase}/users-cms/forgotpassword/`;

//Fees
export const urlGetFees = `${urlBase}/utils/rates`;
export const urlCreateFees = `${urlBase}/utils/createRate`;
export const urlUpdateFees = `${urlBase}/utils/updateRate`;

//Positions
export const urlGetAllPositions = `${urlBase}/users/position`;
export const urlCreatePositions = `${urlBase}/users/createposition`;
export const urlUpdatePositions = `${urlBase}/users/modifyposition`;

//Providers
export const urlGetProviders = `${urlBase}/providers/`;
export const urlCreateProviders = `${urlBase}/providers/`;
export const urlUpdateProviders = `${urlBase}/providers`;

//Get orders state names
export const urlGetOrderState = `${urlBase}/utils/getOrderStates`;

// Create comments on orders
export const urlCreateCommentsOnOrders = `${urlBase}/orders/createComments`;

//url getCities of warehouses
export const urlGetAllCities = `${urlBase}/utils/dep_city`;

//url getCountries of warehouses
export const urlGetAllCountries = `${urlBase}/utils/getCountries`;

//get request types
export const urlGetRequestTypes = `${urlBase}/requests/typerequest`;
//Create
export const urlCreateRequestTypes = `${urlBase}/requests/createtyperequest`;
//Update
export const urlUpdateRequestType = `${urlBase}/requests/modifytyperequest`;

//Payment Methods
//get
export const urlGetAllPaymentMethods = `${urlBase}/payment-method`;
//Create
export const urlCreatePaymentMethods = `${urlBase}/payment-method`;
//Update
export const urlUpdatePaymentMethods = `${urlBase}/payment-method`;

//Contact Types get
export const urlGetAllContactTypes = `${urlBase}/requests/communication`;
//Contact Types Create
export const urlCreateContactTypes = `${urlBase}/requests/createcommunication`;
//Contact Types Update
export const urlUpdateContactTypes = `${urlBase}/requests/modifycommunication`;

//Process States urls
export const urlGetProcessStates = `${urlBase}/requests/stateprocess`;
export const urlCreateProcessStates = `${urlBase}/requests/createstateprocess`;
export const urlUpdateProcessStates = `${urlBase}/requests/modifystateprocess`;

//Request By User
export const urlGetRequestByUser = `${urlBase}/requests/requestbyuser`;
export const urlCreateRequest = `${urlBase}/requests/request`;
export const urlUpdateRequest = `${urlBase}/requests/request`;

//Public Defenders
export const urlGetAllPublicDefenders = `${urlBase}/configrequest/lawyers`;
export const urlCreatePublicDefenders = `${urlBase}/configrequest/createlawyers`;
export const urlUpdatePublicDefenders = `${urlBase}/configrequest/modifylawyers`;

//Documents
export const urlGetAllDocuments = `${urlBase}/requests/documents`;
export const urlGetAll2Documents = `${urlBase}/requests/documentsall`;
export const urlCreateDocuments = `${urlBase}/requests/documents`;

//Templates
export const urlGetAllTemplates = `${urlBase}/templates`;

//Proceeding Number
export const urlProceedingsNumber = `${urlBase}/requests/generateproceedingsnumber`;

//Expedientes
export const urlGetAllExpedientes = `${urlBase}/requests/allproceedingsnumbers`;
export const urlGetExpedientesById = `${urlBase}/requests/requestbyproceedingsnumber`;

//Search
export const urlSearchDocuments = `${urlBase}/requests/searchdocument`;

//Get all states
export const urlGetAllStates = `${urlBase}/requests/states`;


//Folios
export const urlFolios = `${urlBase}/requests/paginate`;
export const urlGetFolios = `${urlBase}/requests/folio`;

// Dashboard
export const urlDashboard = `${urlBase}/requests/dashboard`;

// Stages
export const urlGetAllStages = `${urlBase}/requests/stages`;

// Global Config
export const urlGetGlobalConfig = `${urlBase}/requests/setglobalconfig`;

// Notifications
export const urlSendNotification = `${urlBase}/requests/notifydisciplined`;

// Disciplineds
export const urlGetAllDisciplined = `${urlBase}/users/disciplined`;

// Comunicaciones y notificaciones

export const urlGetAllComunications = `${urlBase}/requests/pendingtonotify`;
export const urlGetAllCompletedComunications = `${urlBase}/requests/communicatedornotified`;
export const urlGetNotificationsPanel = `${urlBase}/requests/notificationspanel`;
export const urlNotifyOrCommunicate = `${urlBase}/requests/notifyorcommunicatewithemail`;
export const urlAttachVoucher = `${urlBase}/requests/attachvoucher`; 
export const urlGetVouchers = `${urlBase}/requests/vouchers`;

export const urlGetStagesWithStates = `${urlBase}/requests/stageswithstates`;