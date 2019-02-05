import { Component, ViewChild, TemplateRef, OnInit, Inject } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';
import { VariableAst } from '@angular/compiler';
import { error } from '../../node_modules/protractor';
// tslint:disable-next-line:max-line-length
import { MatSort, MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatIconModule } from '@angular/material';
import { DialogOverviewExampleDialogComponent } from './dialog-overview-example-dialog/dialog-overview-example-dialog.component';
import { Alert } from '../../node_modules/@types/selenium-webdriver';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [UserService]
})
export class AppComponent implements OnInit {

    constructor(private serv: UserService, public dialog: MatDialog, public snackBar: MatSnackBar) {
        this.users = new Array<User>();
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    addNewUser: User[] = [
        { id: 0, unitname: null, mtm: null, recoveryName: null, os: null, mediaTypes: null, location: null  }
    ];

    users: Array<User>;
    showTable: boolean;
    statusMessage: string;
    isLoaded = true;
    displayedColumnsUsers: string[] = ['id', 'unitname', 'mtm', 'recoveryName', 'os', 'mediaTypes', 'location', 'Change', 'Delete'];
    displayedColumnsAddUser: string[] = ['unitname', 'mtm', 'recoveryName', 'os', 'mediaTypes', 'location', 'Save', 'Cancel'];
    dataSourceUsers: any;
    dataSourceAddUser: any;
    newUser: User;

    @ViewChild(MatSort) sort: MatSort;

    //   Form field with error messages
    name = new FormControl('', [Validators.required]);

    age = new FormControl('', [Validators.required]);

    email = new FormControl('', [Validators.required, Validators.email]);
    surnameFormControl = new FormControl('', [Validators.required]);

    ngOnInit() {
        this.loadUsers();
        this.dataSourceAddUser = new MatTableDataSource();
    }

    applyFilter(filterValue: string) {
        this.dataSourceUsers.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceUsers.paginator) {
            this.dataSourceUsers.paginator.firstPage();
        }
    }

    private loadUsers() {
        this.isLoaded = true;
        this.serv.getUsers().subscribe((data: User[]) => {
            this.users = data;
            this.users.sort(function (obj1, obj2) {
                // Descending: first id less than the previous
                return obj2.id - obj1.id;
            });
            this.isLoaded = false;
            this.dataSourceUsers = new MatTableDataSource(this.users);
            this.dataSourceAddUser = new MatTableDataSource(this.addNewUser);
            this.dataSourceUsers.sort = this.sort;
            this.dataSourceUsers.paginator = this.paginator;
        },
            // tslint:disable-next-line:no-shadowed-variable
            error => {
                alert('Error: ' + error.name);
                this.isLoaded = false;
            }
        );
    }

    deleteUserForDialog(user: User) {
        this.serv.deleteUser(user.id).subscribe(data => {
            this.statusMessage = 'User ' + user.unitname + ' is deleted',
                this.openSnackBar(this.statusMessage, 'Success');
            this.loadUsers();
        });
    }

    editUser(user: User) {
        this.serv.updateUser(user.id, user).subscribe(data => {
            this.statusMessage = 'User ' + user.unitname + ' is updated',
            this.openSnackBar(this.statusMessage, 'Success');
            this.loadUsers();
        },
            // tslint:disable-next-line:no-shadowed-variable
            error => {
                this.openSnackBar(error.statusText, 'Error');
            }
        );
    }

    saveUser(user: User) {
        // tslint:disable-next-line:max-line-length
        if (user.unitname != null && user.mtm != null && user.recoveryName != null && user.os != null  && user.mediaTypes != null && user.location != null) {
            this.serv.createUser(user).subscribe(data => {
                this.statusMessage = 'User ' + user.unitname + ' is added',
                this.showTable = false;
                this.openSnackBar(this.statusMessage, 'Success');
                this.loadUsers();
            },
                // tslint:disable-next-line:no-shadowed-variable
                error => {
                    this.showTable = false;
                    this.openSnackBar(error.statusText, 'Error');
                }
            );
        } else {
            this.openSnackBar('Please enter correct data', 'Error');
        }
    }

    show() {
        this.showTable = true;
        this.addNewUser = [{ id: 0, unitname: null, mtm: null, recoveryName: null, os: null, mediaTypes: null , location: null  }];

    }
    cancel() {
        this.showTable = false;
    }

    // snackBar
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }

    // material dialog
    openDialog(element): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: element,
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result === 'Confirm') {
                this.deleteUserForDialog(element);
            }
        });
    }

    getErrorMessage() {
        return this.name.hasError('required') ? 'You must enter a value' :
            this.name.hasError('name') ? 'Not a valid name' : '';
    }
    emailGetErrorMessage() {
        return this.email.hasError('required') ? 'You must enter a value' :
            this.email.hasError('email') ? 'Not a valid email' :
                '';
    }

    onSubmit(newUser: User) {
        this.newUser = new User(0, '', '', '', '', '', '');
    }
}
