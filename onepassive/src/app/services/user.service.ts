import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  SERVER_URL: string = "http://localhost:8080/api/";
  constructor(private httpClient: HttpClient) { }

  public getUsers(){ 
       return this.httpClient.get(this.SERVER_URL + 'user');
  }

  public getUsersById(Id){
       return this.httpClient.get(`${this.SERVER_URL + 'user'}/${Id}`); 
  }
  public register(userdata: {id: number, amount: number, clientId: number, userId: number, description: string}){
      return this.httpClient.post(`${this.SERVER_URL + 'user'}`, userdata)
  }

  public delete(Id){
      return this.httpClient.delete(`${this.SERVER_URL + 'user'}/${Id}`)
  }
  public update(userdata: {id: number, amount: number, clientId: number, userId: number, description: string}){
      return this.httpClient.put(`${this.SERVER_URL + 'user'}/${userdata.id}`, userdata)
  }
}
