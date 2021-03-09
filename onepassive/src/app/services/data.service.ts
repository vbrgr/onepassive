import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api'

@Injectable({
  providedIn: 'root'
})
 export class DataService implements InMemoryDbService{

  constructor() { }
  createDb(){

   let  users =  [
    {  id:  1,  name:  'Test', email: 'test@gmail.com', password: 'test' },
	{  id:  2,  name:  'Test', email: 'test@gmail.com', password: 'test' },
	{  id:  3,  name:  'Test', email: 'test@gmail.com', password: 'test' },
	{  id:  4,  name:  'Test', email: 'test@gmail.com', password: 'test' },
	{  id:  5,  name:  'Test', email: 'test@gmail.com', password: 'test' },
   ];

   return {users};

  }
}
