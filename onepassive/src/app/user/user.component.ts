import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../services/user.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { TransferService } from './../services/transfer.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  users: any;

  userForm: FormGroup;
  userupdateForm: FormGroup;
  submitted = false;
  invalidLogin: boolean;
  loading = false;
  errorMsg: string;
  successMsg: string;
  action: any;
  usersData: any;
  userloginData: any;
  editData: any;
  name: string;
  email: string;
  password: string;
  type: string;
  constructor( private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private transferService: TransferService,
    private http: HttpClient,
    private userService: UserService) {
      this.route.params.subscribe(params => this.action = params);
      this.route.params.subscribe(id => this.action = id);
      this.userForm = formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]],
        type: ['', Validators.required],
        id: [this.action['id']],
        session_user: [this.userloginData.name]
    });
     // this.formControlValueChanged();
  }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      responsive: true,
       // Declare the use of the extension in the dom parameter
       dom: 'Bfrtip',
       // Configure the buttons
       buttons: [
         'colvis',
         'copy',
         'print',
         'excel'
       ],
       colReorder: {
        order: [1, 0, 2],
        fixedColumnsRight: 2
      },
    };
    this.http.get('/api/getusers/')
      .map(this.extractData)
      .subscribe(users => {
        this.users = users;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      });

    this.successMsg = this.transferService.getData();
     this.usersData = this.userService.getUsers();
     this.editData = { id: null, name: null, email: null, password: null} ;
     if (this.action['id']) {
        this.userService.getUsersById(this.action['id']).subscribe(res => {
          this.editData = res.json();
          this.editData = this.editData[0];
        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client side Error !');
          } else {
            console.log('Server side Error !' + err);
          }
        });
      }
      

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
  /* formControlValueChanged() {
    const passControl = this.userForm.get('password');
    if (this.action['id'] !== null) {
    } else {
    passControl.setValidators([Validators.required]);
    }
    } */

  get f() { return this.userForm.controls; }
  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.userForm.invalid) {
          return;
      }
      const form = this.userForm.value;
    if (this.action['id'] != null) {
      this.update(this.userForm.value);
    } else {
    this.register(this.userForm.value);
    }
  }

  /* uniqueEmail() {
    const emailControl = this.userForm.get('email');
    this.userService.getUsersByEmail(emailControl.value, this.action['id']).subscribe(result => {
      if(result === true){
        emailControl.setValidators([Validators.emailTaken]);
      }
    });
  } */
  register(credentials) {
    this.loading = true;
    this.userService.register(credentials)
      .subscribe(result => {
        if (result.status) {

          this.successMsg = result.status;
          this.loading = false;
          this.transferService.setData(this.successMsg);
          this.router.navigate(['admin/user']);
        } else {
          this.invalidLogin = true;
          this.errorMsg = result.errorMessage;
          this.loading = false;
        }
      });
}
update(credentials) {
  this.loading = true;
  this.userService.update(credentials)
    .subscribe(result => {
      if (result.status) {

        this.successMsg = result.status;
        this.transferService.setData(this.successMsg);
        this.loading = false;
        this.router.navigate(['admin/user']);
      } else {
        this.invalidLogin = true;
        this.errorMsg = result.errorMessage;
        this.loading = false;
      }
    });
}
public deleteUser(id) {
 
this.userService.delete(id).subscribe(res => {
  this.successMsg = res.status;
  this.usersData = this.userService.getUsers();
  this.router.navigate(['admin/user']);
  this.ngOnDestroy();
  this.ngOnInit();
}, (err: HttpErrorResponse) => {
  if (err.error instanceof Error) {
    console.log('Client side Error !');
  } else {
    console.log('Server side Error !');
  }
});
    
}

menuClickHandler(route) {
  this.router.navigate([route]);
}

}
