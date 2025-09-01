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
}
