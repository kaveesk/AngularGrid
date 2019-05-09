import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from './patient';


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  url = 'http://localhost:65389/Api/Patient';  
  constructor(private http: HttpClient) { }  
  getAllPatient(): Observable<Patient[]> {  
    return this.http.get<Patient[]>(this.url + '/AllPatientDetails');  
  }  
  getPatientById(patPatientId: string): Observable<Patient> {  
    return this.http.get<Patient>(this.url + '/GetPatientDetailsById/' + patPatientId);  
  }  
  createPatient(patient: Patient): Observable<Patient> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Patient>(this.url + '/InsertPatientDetails/',  
    patient, httpOptions);  
  }  
  updatePatient(patient: Patient): Observable<Patient> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Patient>(this.url + '/UpdatePatientDetails/',  
    patient, httpOptions);  
  }  
  deletePatientById(value: string): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/DeletePatientDetails?id=' + value,  
 httpOptions);  
  }  
}
