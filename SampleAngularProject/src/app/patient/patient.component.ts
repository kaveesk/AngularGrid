import { Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs'; 
import { PatientService } from '../patient.service';  
import { Patient } from '../patient';  
import {DomSanitizer} from '@angular/platform-browser';
import {MatIcon,MatButtonModule,MatPaginator, MatSort, MatTableDataSource,MatIconModule,MatIconRegistry } from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {SelectionModel} from '@angular/cdk/collections';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  title = 'angulartoastr';

  color = 'primary';
  mode = 'determinate';
  value = 50;
  public animalOptions: any = [
    { label: 'Male', value: '0', checked: false },
    { label: 'Female', value: '1', checked: false }
  ];
  public _choice: any;

   displayedColumns = ['select', 'patPatientName', 'patDateOfBirth', 'patEmailId','patGender','patAddress', 'patPinCode','update'];
   dataSource = new MatTableDataSource<PatientData>();

   selection = new SelectionModel<PatientData>(true, []);
  public endorsementIds: string[] = [];
  //  displayedColumns = ['id', 'name', 'progress', 'color'];
  //  dataSource = new MatTableDataSource<UserData>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSaved = false;
  patientForm:any;
  allPatients:Observable<Patient[]>;
  patientIdUpdate = null;
  message = null;
  //patients: Observable<Patient[]>;
  constructor(private formbuilder: FormBuilder, private patientService:PatientService,iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) { 
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/thumbup-icon.svg'));
    //this.ngAfterViewInit(); 
    //Create 100 users
   //const users: Patient[] = [];
  //  const users: UserData[] = [];
  //  for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }

  //  // Assign the data to the data source for the table to render
  //  this.dataSource = new MatTableDataSource(users);
  
  }

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    console.log(this.dataSource.filter);
  }

  ngOnInit() {
    this.showLoader();
    this.patientForm = this.formbuilder.group({
      patPatientName   : ['', [Validators.required]],  
      patDateOfBirth   :['', [Validators.required]], 
      patEmailId        : ['', [Validators.required]], 
      patGender      :['', [Validators.required]], 
      patAddress      : ['', [Validators.required]], 
      patPinCode      :['', [Validators.required]], 

    });
    this.loadAllPatients();   
  }

  loadAllPatients(){
    
    //this.allPatients = this.patientService.getAllPatient();
    this.patientService.getAllPatient().subscribe(res => {
      this.dataSource =  new MatTableDataSource(res as PatientData[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
    });
  }

  saveAnimal($event: any) {
    this.patientForm.controls['patGender'].setValue($event.value);
  }


  onFormSubmit(){
    //this.showLoader();
    debugger;
    this.dataSaved = false;
    const patient = this.patientForm.value;
    this.CreatePatient(patient);
    this.patientForm.reset();
    console.log(this.patientForm.value);
  }
  
  resetForm(){
    this.patientForm.reset();
  }
  loadPatientToEdit(patPatientId: string)
  {
    this.patientService.getPatientById(patPatientId).subscribe(patient=>{
      this.message = null;
      this.dataSaved = false;
      this.patientIdUpdate = patient.patPatientId;
      this.patientForm.controls['patPatientName'].setValue(patient.patPatientName);
      this.patientForm.controls['patDateOfBirth'].setValue(patient.patDateOfBirth);  
      this.patientForm.controls['patEmailId'].setValue(patient.patEmailId);  
      this.patientForm.controls['patGender'].setValue(patient.patGender);  
      this.patientForm.controls['patAddress'].setValue(patient.patAddress);  
      this.patientForm.controls['patPinCode'].setValue(patient.patPinCode); 

      if (patient.patGender.trim() === '1') {
        this.animalOptions[0].checked = false;
        this.animalOptions[1].checked = true;
      }
      else  {
        this.animalOptions[0].checked = true;
        this.animalOptions[1].checked = false;
      }
       });
      
  }

  CreatePatient(patient: Patient){
    this.showLoader();
    if(this.patientIdUpdate == null){
      this.patientService.createPatient(patient).subscribe(
        () =>{
          this.dataSaved = true;
         
          this.toastr.success('Record Saved Sucessfully!', '',{timeOut: 3000})
          this.loadAllPatients();
          this.patientIdUpdate = null;
          this.patientForm.reset();
        });
    }else{
patient.patPatientId = this.patientIdUpdate;
this.patientService.updatePatient(patient).subscribe(
  () =>{
    this.dataSaved = true;
    this.toastr.success('Record Updated Sucessfully!', '',{timeOut: 3000})
    this.loadAllPatients();
    this.patientIdUpdate = null;
    this.patientForm.reset();
});
    }
  }

  deletePatient(patPatientIds: any){
    this.spinnerService.show();
  setTimeout(()=>this.spinnerService.hide(),3000)
    //if(confirm("Are you sure want to delete this ?")){
     // patPatientIds.forEach(function (value) {

      var arrayLength = patPatientIds.length;
      for (var i = 0; i < arrayLength; i++) {
          console.log(patPatientIds[i]);
          //Do something
      
        console.log(patPatientIds[i]);
        this.patientService.deletePatientById(patPatientIds[i]).subscribe(() =>{
          this.dataSaved = true;
          
            this.loadAllPatients();
            this.patientIdUpdate = null;
            this.patientForm.reset();
        });
      }
      this.toastr.success('Record Deleted Sucessfully!', '',{timeOut: 3000})
     // }); 

 //   }
 //console.log(patPatientId);
  }

  reserForm(){
    this.patientForm.reset();
    this.message = null;
    this.dataSaved = false;
    this.animalOptions[0].checked = false;
    this.animalOptions[1].checked = false;
    
  }
  showLoader()
{
  this.spinnerService.show();
  setTimeout(()=>this.spinnerService.hide(),1000)
}

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}
toggle(event, row) {
  let name = row.patPatientId;
  
  if(event.checked) {
    if (this.endorsementIds.indexOf(name) === -1) {
      this.endorsementIds.push(name);
      this.selection.select(row);
    }

  } else {
    const index = this.endorsementIds.indexOf(name);
    if (index > -1) {
      this.endorsementIds.splice(index, 1);        
      this.selection.deselect(row);
    }
  }

  console.log(this.endorsementIds);
}

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(ev) {    
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => {
          this.selection.select(row)
          });

    this.endorsementIds = [];
    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        this.endorsementIds.push(row.patPatientId);      
      }      
    });
    console.log(this.endorsementIds);
  }

 }

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

export interface PatientData {
  patPatientId: string;  
  patPatientName: string;  
  patDateOfBirth: Date;  
  patEmailId: string;  
  patGender: string;  
  patAddress: string;  
  patPinCode: string;  
}
