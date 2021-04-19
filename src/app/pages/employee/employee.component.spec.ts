import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeComponent, NgbdSortableHeader } from './employee.component';

const mockData = [
  {
    id: 1,
    employeeId: '07f17d85-d8d9-4802-8db9-e1d50f96ae4b',
    firstname: 'User',
    lastname: '1',
    dateJoined: 'Fri Dec 09 1994 18:04:18 GMT+0800 (Malaysia Time)',
    salary: 10,
  },
  {
    id: 2,
    employeeId: '66bd4320-4075-4d87-873e-5bc9e9843744',
    firstname: 'User',
    lastname: '2',
    dateJoined: 'Mon Oct 27 1980 01:12:37 GMT+0730 (Malaysia Time)',
    salary: 20,
  },
  {
    id: 3,
    employeeId: '51ce9fe4-7fee-451a-a20c-ef0d626efd3a',
    firstname: 'User',
    lastname: '3',
    dateJoined: 'Mon Jul 08 1991 13:19:00 GMT+0800 (Malaysia Time)',
    salary: 30,
  },
];

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let debugElement: DebugElement;
  let serviceStub: any;

  beforeEach(async () => {
    serviceStub = {
      getAll: () => of(mockData),
    };

    await TestBed.configureTestingModule({
      declarations: [EmployeeComponent, CardComponent, NgbdSortableHeader],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: EmployeeService,
          useValue: serviceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have employees data from api', () => {
    expect(component.employees).toBeTruthy();
    expect(component.employees.length).toBe(3);
  });

  it('should have always start with date joined descending', () => {
    expect(
      debugElement.query(By.css('table tbody tr:first-child th:nth-child(3)'))
        .nativeElement.innerText
    ).toBe(`${mockData[0].firstname} ${mockData[0].lastname}`);
  });

  it('should have correct number of total employee ', () => {
    expect(component.employeeNumber).toBe(`${mockData.length}`);
  });

  it('should have correct name of highest earner ', () => {
    expect(component.highestEarningEmployee).toBe('User 3');
  });

  it('should have correct name of last joined ', () => {
    expect(component.recentlyJoinedEmployee).toBe('User 1');
  });

  it('should have sort table descending by name ', async () => {
    await fixture.whenStable().then(() => {
      let thirdColumn = debugElement.query(By.css('table thead th[sortable]'));
      let el = thirdColumn.nativeElement;
      console.log(el.innerText);

      thirdColumn.triggerEventHandler('click', {});
      thirdColumn.triggerEventHandler('click', {});
      fixture.detectChanges();

      expect(
        debugElement.query(By.css('table tbody tr:first-child th:nth-child(3)'))
          .nativeElement.innerText
      ).toBe(`${mockData[2].firstname} ${mockData[2].lastname}`);
    });
  });

  it('should have filter only 1 user ', async () => {
    await fixture.whenStable().then(() => {
      let input = debugElement.query(By.css('input'));
      let el = input.nativeElement;

      expect(el.value).toBe('');

      el.value = '1';
      el.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.filterName.value).toBe('1');
      expect(debugElement.queryAll(By.css('table tbody tr')).length).toBe(1);
    });
  });
});
