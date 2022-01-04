import { Component, ViewChild, AfterViewInit, Inject, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';

export interface UserData {
  id: string;
  name: string;
  age: string;
  mobile: string;
}

export interface grids {
  dataSource: MatTableDataSource<UserData>;
  paginator: MatPaginator;
}

/** Constants used to fill up our data base. */
const mobile: string[] = [
  '09192902393',
  '09120023400',
  '09130120056',
  '09160123201',
  '09100011108',
  '09100000000',
  '09101324547',
  '09110142536',
];
const NAMES: string[] = [
  'ali',
  'rohollah',
  'mahdi',
  'meysam',
  'zeynab',
  'zahra',
  'fatemeh',
  'alireza',
  'reza',
  'mohammad',
  'abbas',
  'akbar',
];

const listData: any[] = [
  {id: 1, name: "Rohollah", mobile: "09192902393", age: "23"},
];

const TemplistData: any[] = [
  {id: 1, name: "Rohollah", mobile: "09192902393", age: "23"},
];



 @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'name', 'age', 'mobile', 'actions'];
  dataSource: MatTableDataSource<UserData>;


  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = NAMES;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {


    const users = Array.from({length: 99}, (_, k) => createNewUser(listData.length + 1));
    this.dataSource = new MatTableDataSource(listData);


    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.dataSource = new MatTableDataSource(listData);
      this.dataSource.paginator = this.paginator;
    });
  }


  removeItem(element: any) {
    
    listData.forEach ((value: any, index: any) => {
      if (value == element)
      listData.splice (index, 1)
    });
    
    this.dataSource = new MatTableDataSource(listData);
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit() {

  }


  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  
    TemplistData.forEach ((value: any, index: any) => {
      if (value.name == fruit) {
        TemplistData.splice(index, 1);
      }
    });

    this.dataSource = new MatTableDataSource(TemplistData);
    this.dataSource.paginator = this.paginator;

    if (index == 0 && this.fruits.length <= 0)
    {
      this.dataSource = new MatTableDataSource(listData);
      this.dataSource.paginator = this.paginator;
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    listData.forEach ((value: any, index: any) => {
      if (value.name == event.option.viewValue)
      TemplistData.push(value);
      //listData.splice (index, 1)
    });

    this.dataSource = new MatTableDataSource(TemplistData);
    this.dataSource.paginator = this.paginator;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

}

function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))];

    listData.push({
      id: id.toString(),
      name: name,
      age: Math.round(Math.random() * 50).toString(),
      mobile: mobile[Math.round(Math.random() * (mobile.length - 1))],
    });

  return listData[id]
}

@Component({
  selector: 'app-root',
  templateUrl: 'dialog-content-example-dialog.html',
})

export class DialogContentExampleDialog implements OnInit {

  dialogForm: FormGroup;

  constructor(private fb:FormBuilder){
    this.dialogForm = this.fb.group ({
      id: [listData.length + 1, Validators.required] ,
      name: ['', Validators.required],
      age: ['', Validators.required],
      mobile: ['', Validators.required]
    })
  }
  
  addData() {
    listData.push(this.dialogForm.value);
  }

  ngOnInit() {

  }
}