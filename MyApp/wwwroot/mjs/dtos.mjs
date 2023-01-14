/* Options:
Date: 2023-01-13 11:08:11
Version: 6.51
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//AddServiceStackTypes: True
//AddDocAnnotations: True
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/

"use strict";
/** @typedef {'Unspecified'|'Mr'|'Mrs'|'Miss'} */
export var Title;
(function (Title) {
    Title["Unspecified"] = "Unspecified";
    Title["Mr"] = "Mr";
    Title["Mrs"] = "Mrs";
    Title["Miss"] = "Miss";
})(Title || (Title = {}));
/** @typedef {'Action'|'Adventure'|'Comedy'|'Drama'} */
export var FilmGenre;
(function (FilmGenre) {
    FilmGenre["Action"] = "Action";
    FilmGenre["Adventure"] = "Adventure";
    FilmGenre["Comedy"] = "Comedy";
    FilmGenre["Drama"] = "Drama";
})(FilmGenre || (FilmGenre = {}));
export class QueryBase {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {?number} */
    skip;
    /** @type {?number} */
    take;
    /** @type {string} */
    orderBy;
    /** @type {string} */
    orderByDesc;
    /** @type {string} */
    include;
    /** @type {string} */
    fields;
    /** @type {{ [index: string]: string; }} */
    meta;
}
/** @typedef T {any} */
export class QueryData extends QueryBase {
    /** @param {{skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init); }
}
export class Contact {
    /** @param {{id?:number,userAuthId?:number,title?:Title,name?:string,color?:string,favoriteGenre?:FilmGenre,age?:number}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {number} */
    id;
    /** @type {number} */
    userAuthId;
    /** @type {Title} */
    title;
    /** @type {?string} */
    name;
    /** @type {?string} */
    color;
    /** @type {?FilmGenre} */
    favoriteGenre;
    /** @type {number} */
    age;
}
export class ResponseError {
    /** @param {{errorCode?:string,fieldName?:string,message?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    errorCode;
    /** @type {string} */
    fieldName;
    /** @type {string} */
    message;
    /** @type {{ [index: string]: string; }} */
    meta;
}
export class ResponseStatus {
    /** @param {{errorCode?:string,message?:string,stackTrace?:string,errors?:ResponseError[],meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    errorCode;
    /** @type {string} */
    message;
    /** @type {string} */
    stackTrace;
    /** @type {ResponseError[]} */
    errors;
    /** @type {{ [index: string]: string; }} */
    meta;
}
export class GetContactsResponse {
    /** @param {{results?:Contact[],responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {?Contact[]} */
    results;
    /** @type {?ResponseStatus} */
    responseStatus;
}
export class CreateContactResponse {
    /** @param {{result?:Contact,responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {?Contact} */
    result;
    /** @type {?ResponseStatus} */
    responseStatus;
}
export class UpdateContactResponse {
    /** @param {{responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {?ResponseStatus} */
    responseStatus;
}
export class HelloResponse {
    /** @param {{result?:string}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    result;
}
export class Todo {
    /** @param {{id?:number,text?:string,isFinished?:boolean}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {number} */
    id;
    /** @type {string} */
    text;
    /** @type {boolean} */
    isFinished;
}
/** @typedef T {any} */
export class QueryResponse {
    /** @param {{offset?:number,total?:number,results?:T[],meta?:{ [index: string]: string; },responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {number} */
    offset;
    /** @type {number} */
    total;
    /** @type {T[]} */
    results;
    /** @type {{ [index: string]: string; }} */
    meta;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class AuthenticateResponse {
    /** @param {{userId?:string,sessionId?:string,userName?:string,displayName?:string,referrerUrl?:string,bearerToken?:string,refreshToken?:string,profileUrl?:string,roles?:string[],permissions?:string[],responseStatus?:ResponseStatus,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    userId;
    /** @type {string} */
    sessionId;
    /** @type {string} */
    userName;
    /** @type {string} */
    displayName;
    /** @type {string} */
    referrerUrl;
    /** @type {string} */
    bearerToken;
    /** @type {string} */
    refreshToken;
    /** @type {string} */
    profileUrl;
    /** @type {string[]} */
    roles;
    /** @type {string[]} */
    permissions;
    /** @type {ResponseStatus} */
    responseStatus;
    /** @type {{ [index: string]: string; }} */
    meta;
}
export class AssignRolesResponse {
    /** @param {{allRoles?:string[],allPermissions?:string[],meta?:{ [index: string]: string; },responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string[]} */
    allRoles;
    /** @type {string[]} */
    allPermissions;
    /** @type {{ [index: string]: string; }} */
    meta;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class UnAssignRolesResponse {
    /** @param {{allRoles?:string[],allPermissions?:string[],meta?:{ [index: string]: string; },responseStatus?:ResponseStatus}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string[]} */
    allRoles;
    /** @type {string[]} */
    allPermissions;
    /** @type {{ [index: string]: string; }} */
    meta;
    /** @type {ResponseStatus} */
    responseStatus;
}
export class RegisterResponse {
    /** @param {{userId?:string,sessionId?:string,userName?:string,referrerUrl?:string,bearerToken?:string,refreshToken?:string,roles?:string[],permissions?:string[],responseStatus?:ResponseStatus,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    userId;
    /** @type {string} */
    sessionId;
    /** @type {string} */
    userName;
    /** @type {string} */
    referrerUrl;
    /** @type {string} */
    bearerToken;
    /** @type {string} */
    refreshToken;
    /** @type {string[]} */
    roles;
    /** @type {string[]} */
    permissions;
    /** @type {ResponseStatus} */
    responseStatus;
    /** @type {{ [index: string]: string; }} */
    meta;
}
export class GetContacts {
    /** @param {{id?:number}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {?number} */
    id;
    getTypeName() { return 'GetContacts'; };
    getMethod() { return 'GET'; };
    createResponse() { return new GetContactsResponse(); };
}
export class CreateContact {
    /** @param {{title?:Title,name?:string,color?:string,favoriteGenre?:FilmGenre,age?:number,agree?:boolean}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {Title} */
    title;
    /** @type {string} */
    name;
    /** @type {?string} */
    color;
    /** @type {FilmGenre} */
    favoriteGenre;
    /** @type {number} */
    age;
    /** @type {boolean} */
    agree;
    getTypeName() { return 'CreateContact'; };
    getMethod() { return 'POST'; };
    createResponse() { return new CreateContactResponse(); };
}
export class DeleteContact {
    /** @param {{id?:number}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {number} */
    id;
    getTypeName() { return 'DeleteContact'; };
    getMethod() { return 'DELETE'; };
    createResponse() { };
}
export class UpdateContact {
    /** @param {{id?:number,title?:Title,name?:string,color?:string,favoriteGenre?:FilmGenre,age?:number}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {number} */
    id;
    /** @type {Title} */
    title;
    /** @type {?string} */
    name;
    /** @type {?string} */
    color;
    /** @type {?FilmGenre} */
    favoriteGenre;
    /** @type {number} */
    age;
    getTypeName() { return 'UpdateContact'; };
    getMethod() { return 'PATCH'; };
    createResponse() { return new UpdateContactResponse(); };
}
export class Hello {
    /** @param {{name?:string}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {?string} */
    name;
    getTypeName() { return 'Hello'; };
    getMethod() { return 'POST'; };
    createResponse() { return new HelloResponse(); };
}
export class QueryTodos extends QueryData {
    /** @param {{id?:number,ids?:number[],textContains?:string,skip?:number,take?:number,orderBy?:string,orderByDesc?:string,include?:string,fields?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { super(init); Object.assign(this, init); }
    /** @type {?number} */
    id;
    /** @type {?number[]} */
    ids;
    /** @type {?string} */
    textContains;
    getTypeName() { return 'QueryTodos'; };
    getMethod() { return 'GET'; };
    createResponse() { return new QueryResponse(); };
}
export class CreateTodo {
    /** @param {{text?:string}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    text;
    getTypeName() { return 'CreateTodo'; };
    getMethod() { return 'POST'; };
    createResponse() { return new Todo(); };
}
export class UpdateTodo {
    /** @param {{id?:number,text?:string,isFinished?:boolean}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {number} */
    id;
    /** @type {string} */
    text;
    /** @type {boolean} */
    isFinished;
    getTypeName() { return 'UpdateTodo'; };
    getMethod() { return 'PUT'; };
    createResponse() { return new Todo(); };
}
export class DeleteTodos {
    /** @param {{ids?:number[]}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {number[]} */
    ids;
    getTypeName() { return 'DeleteTodos'; };
    getMethod() { return 'DELETE'; };
    createResponse() { };
}
export class Authenticate {
    /** @param {{provider?:string,state?:string,oauth_token?:string,oauth_verifier?:string,userName?:string,password?:string,rememberMe?:boolean,errorView?:string,nonce?:string,uri?:string,response?:string,qop?:string,nc?:string,cnonce?:string,accessToken?:string,accessTokenSecret?:string,scope?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /**
     * @type {string}
     * @description AuthProvider, e.g. credentials */
    provider;
    /** @type {string} */
    state;
    /** @type {string} */
    oauth_token;
    /** @type {string} */
    oauth_verifier;
    /** @type {string} */
    userName;
    /** @type {string} */
    password;
    /** @type {?boolean} */
    rememberMe;
    /** @type {string} */
    errorView;
    /** @type {string} */
    nonce;
    /** @type {string} */
    uri;
    /** @type {string} */
    response;
    /** @type {string} */
    qop;
    /** @type {string} */
    nc;
    /** @type {string} */
    cnonce;
    /** @type {string} */
    accessToken;
    /** @type {string} */
    accessTokenSecret;
    /** @type {string} */
    scope;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'Authenticate'; };
    getMethod() { return 'POST'; };
    createResponse() { return new AuthenticateResponse(); };
}
export class AssignRoles {
    /** @param {{userName?:string,permissions?:string[],roles?:string[],meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    userName;
    /** @type {string[]} */
    permissions;
    /** @type {string[]} */
    roles;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'AssignRoles'; };
    getMethod() { return 'POST'; };
    createResponse() { return new AssignRolesResponse(); };
}
export class UnAssignRoles {
    /** @param {{userName?:string,permissions?:string[],roles?:string[],meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    userName;
    /** @type {string[]} */
    permissions;
    /** @type {string[]} */
    roles;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'UnAssignRoles'; };
    getMethod() { return 'POST'; };
    createResponse() { return new UnAssignRolesResponse(); };
}
export class Register {
    /** @param {{userName?:string,firstName?:string,lastName?:string,displayName?:string,email?:string,password?:string,confirmPassword?:string,autoLogin?:boolean,errorView?:string,meta?:{ [index: string]: string; }}} [init] */
    constructor(init) { Object.assign(this, init); }
    /** @type {string} */
    userName;
    /** @type {string} */
    firstName;
    /** @type {string} */
    lastName;
    /** @type {string} */
    displayName;
    /** @type {string} */
    email;
    /** @type {string} */
    password;
    /** @type {string} */
    confirmPassword;
    /** @type {?boolean} */
    autoLogin;
    /** @type {string} */
    errorView;
    /** @type {{ [index: string]: string; }} */
    meta;
    getTypeName() { return 'Register'; };
    getMethod() { return 'POST'; };
    createResponse() { return new RegisterResponse(); };
}

