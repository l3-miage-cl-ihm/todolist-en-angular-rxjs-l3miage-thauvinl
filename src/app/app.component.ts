import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodolistServiceInterface } from './data/todo-list.interface';
import { TodoListService } from './todo-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(toDoListService : TodoListService){
    
  }
  
}
