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

  getAllEvents(sportId:any): Observable<any>{
    return this.http.get(`${this.baseUrl}/sport/all-event/${sportId}`);
  }

  getCompetitionList(sportId:any): Observable<any>{
    return this.http.get(`${this.baseUrl}/sport/competition/${sportId}`);
  };

  getEventList(competitionId:any): Observable<any>{
    return this.http.get(`${this.baseUrl}/sport/event/${competitionId}`);
  }

  getMarketList(eventId:any): Observable<any>{
    return this.http.get(`${this.baseUrl}/sport/market/${eventId}`);
  }

  getMarketBook(marketId:any): Observable<any>{
    return this.http.get(`${this.baseUrl}/sport/book/${marketId}`);
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

  getCurrency(data:any={}): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/get`,data);
  }
  
  getBaseCurrency(data:any={}): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/get-one`,data);
  }
  
  UpdateMultipleCurrency(data:any={}): Observable<any>{
    return this.http.post(`${this.baseUrl}/currency/update`,data);
  }

  deleteCurrency(id:any): Observable<any>{
    return this.http.delete(`${this.baseUrl}/currency/remove/${id}`);
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

}
