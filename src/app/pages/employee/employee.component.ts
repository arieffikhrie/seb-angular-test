import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Employee } from 'src/app/models/employee';
import { CurrencyService } from 'src/app/services/currency.service';
import { EmployeeService } from 'src/app/services/employee.service';

export type SortColumn = 'name' | 'date' | 'salary' | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

const compareFunc = {
  name: (a: Employee, b: Employee) => {
    const nameA = `${a.firstname} ${a.lastname}`;
    const nameB = `${b.firstname} ${b.lastname}`;
    return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
  },
  date: (a: Employee, b: Employee) => {
    const dateA = new Date(a.dateJoined).getTime();
    const dateB = new Date(b.dateJoined).getTime();

    return dateA - dateB;
  },
  salary: (a: Employee, b: Employee) => {
    return a.salary - b.salary;
  },
  '': (a: Employee, b: Employee) => {
    return 0;
  },
};

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

export interface SearchItem {
  name: string;
  employee: Employee;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  employeesInit: Employee[] = [];
  employeeNumber: string = '';
  currency: string = '';
  highestEarningEmployee: string = '';
  recentlyJoinedEmployee: string = '';
  filterName: FormControl = new FormControl('');

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private employeeService: EmployeeService,
    private currencyService: CurrencyService
  ) {
    this.headers = new QueryList();
  }

  private getName(employee: Employee): string {
    return  `${employee.firstname} ${employee.lastname}`;
  }

  private search(text: string): Employee[] {
    const list: SearchItem[] = this.employees
      .map(employee => {
        return {
          name: this.getName(employee),
          employee
        }
      });

    return list
      .filter(item => {
        const term = text.toLowerCase();
        return item.name.toLowerCase().includes(term);
      })
      .map(item => item.employee);
  }

  ngOnInit(): void {
    this.currency = this.currencyService.get();
    this.employeeService.getAll().subscribe((employees) => {
      this.employeesInit = this.employees = employees;

      this.employeeNumber = `${this.employees.length}`;
      this.onSort({
        column: 'date',
        direction: 'desc',
      });

      const highestEarner = [...this.employees].sort((a, b) => {
        let res: number = compareFunc['salary'](a, b);
        return -res;
      })[0];

      this.highestEarningEmployee = this.getName(highestEarner);

      const recentJoined = [...this.employees].sort((a, b) => {
        let res: number = compareFunc['date'](a, b);
        return -res;
      })[0];

      this.recentlyJoinedEmployee = this.getName(recentJoined);

      this.filterName.valueChanges.subscribe(text => {
        this.employees = this.employeesInit;

        if (!text) {
          return;
        }
        this.employees = this.search(text);
      })
    });
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.employees = this.employeesInit;
    } else {
      this.employees = [...this.employees].sort((a, b) => {
        let res: number = compareFunc[column](a, b);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
