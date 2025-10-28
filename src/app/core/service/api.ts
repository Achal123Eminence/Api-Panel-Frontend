import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = environment.baseUrl;
  private baseUrl02 = environment.baseUrl02;

  constructor(private http:HttpClient){}

  login(obj:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/user/login`, obj);
  }  

  getAllEvents(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/sport/all-event`,data);
  }

  getCompetitionList(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/sport/competition`,data);
  };

  getEventList(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/sport/event`,data);
  }

  getMarketList(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/sport/market`,data);
  }

  getMarketBook(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/sport/book`,data);
  }

  addEvent(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/add`,data);
  }

  getDefaultSetting(data:any={}): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/get-default`,data);
  }

  updateDefaultSetting(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/update-default`,data);
  }

  addCurrency(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/create`,data);
  }

  updateCurrency(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/update-base`,data);
  }

  getCurrency(data:any={}): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/get`,data);
  }
  
  getBaseCurrency(data:any={}): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/get-one`,data);
  }
  
  UpdateMultipleCurrency(data:any={}): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/update`,data);
  }

  deleteCurrency(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/remove`,data);
  }

  addManualCompetition(data:any){
    return this.http.post(`${this.baseUrl}/manual/add-competition`,data);
  }

  getNextManual(data:any={}){
    return this.http.post(`${this.baseUrl}/manual/next-competition-id`,data);
  }

  addManualEvent(data:any){
    return this.http.post(`${this.baseUrl}/manual/add-event`,data);
  }

  getManualCompetitionList(data:any={}){
    return this.http.post(`${this.baseUrl}/manual/get-manual-competition`,data);
  }

  getManualCompetitionListBySport(data:any){
    return this.http.post(`${this.baseUrl}/manual/get-manual-competition-bySport`,data);
  }

  updateManualCompetition(data:any){
    return this.http.post(`${this.baseUrl}/manual/update-manual-competition`,data);
  }

  addSingleMarket(data:any){
    return this.http.post(`${this.baseUrl}/event/add-market`,data);
  }

  removeSingleMarket(data:any){
    return this.http.post(`${this.baseUrl}/event/remove-market`,data);
  }

  getBetfairCompetitionList(data:any){
    return this.http.post(`${this.baseUrl}/event/get-competition`,data);
  }

  updateCompetitionGrade(data:any){
    return this.http.post(`${this.baseUrl}/event/update-competition-grade`,data);
  }

  deleteCompetition(data:any){
    return this.http.post(`${this.baseUrl}/event/remove-competition`,data);
  }

  updateEventGrade(data:any){ 
    return this.http.post(`${this.baseUrl}/event/update-event-grade`,data);
  }

  deleteEvent(data:any){
    return this.http.post(`${this.baseUrl}/event/remove-event`,data);
  }

  removeEvent(data:any){
    return this.http.post(`${this.baseUrl}/event/partialy-remove-event`,data);
  }

  updateCompetitionMarket(data:any){
    return this.http.post(`${this.baseUrl}/event/update-competition-market`,data);
  }

  updateEventMarket(data:any){
    return this.http.post(`${this.baseUrl}/event/update-event-market`,data);
  }

  getSavedEventList(data:any){
    return this.http.post(`${this.baseUrl}/event/get-saved-event`,data);
  }

  rollBackEvent(data:any){
    return this.http.post(`${this.baseUrl}/event/rollback-event`,data);
  }

  competitionCheck(data:any){
     return this.http.post(`${this.baseUrl}/event/competition-check`,data);
  }

  getRunningEventList(data:any){
     return this.http.post(`${this.baseUrl}/running-matches/get-events`,data);
  }

  getRunningEventMarketList(data:any){
     return this.http.post(`${this.baseUrl}/running-matches/get-markets`,data);
  }

  updateRunningEventMarketStatus(data:any){
     return this.http.post(`${this.baseUrl}/running-matches/update-markets-status`,data);
  }

  updateRunningEventType(data:any){
     return this.http.post(`${this.baseUrl}/running-matches/update-event-type`,data);
  }

  updateRunningEventOpenDate(data:any){
    return this.http.post(`${this.baseUrl}/running-matches/update-event-open-date`,data);
  }

  updateRunningEventRunners(data:any){
    return this.http.post(`${this.baseUrl}/running-matches/update-event-runner`,data);
  }

  updateRunningBookmaker(data:any){
    return this.http.post(`${this.baseUrl}/running-matches/update-event-bookmaker`,data);
  }

  getAllProviderEvents(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/sport/all-provider-events`,data);
  }

  getRunningCompetitionCount(data:any){
     return this.http.post(`${this.baseUrl}/running-matches/get-running-competition-count`,data);
  }

  getAutoPremiumStatusBySport(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/get-autoPremium-statusBySport`,data);
  }

  updateAutoPremiumStatusBySport(data:any): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/update-autoPremium-statusBySport`,data);
  }
}
