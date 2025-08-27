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
    return this.http.get(`${this.baseUrl02}/data/all-event/${sportId}`);
  }

  getCompetitionList(sportId:any): Observable<any>{
    return this.http.get(`${this.baseUrl02}/data/competition/${sportId}`);
  };

  getEventList(competitionId:any): Observable<any>{
    return this.http.get(`${this.baseUrl02}/data/event/${competitionId}`);
  }

  getMarketList(eventId:any): Observable<any>{
    return this.http.get(`${this.baseUrl02}/data/market/${eventId}`);
  }

  getMarketBook(marketId:any): Observable<any>{
    return this.http.get(`${this.baseUrl02}/data/book/${marketId}`);
  }
}
