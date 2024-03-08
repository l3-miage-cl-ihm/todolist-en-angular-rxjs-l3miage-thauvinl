import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TodolistServiceInterface } from './data/todo-list.interface';
import { TodoListService } from './todo-list.service';
import { TodoItem, TodoList, initialTDL, updateItems } from './data/todolist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly sigTDL =  computed<TodoList>(()=>{return this.toDoListService.sigTDL()});

  constructor(private toDoListService : TodoListService){
    
  }
  addToDo(s:string){
    console.log([s]);
    this.toDoListService.appendItems([s]);
  }
  checkTask(b:boolean, t: TodoItem){
    this.toDoListService.updateItems({
      done: b
    },
    [t])
  }
  updateTaskLabel(s:string, t:TodoItem){
    this.toDoListService.updateItems({
      label: s
    },
    [t])
  }
  removeTask(t:TodoItem){
    this.toDoListService.deleteItems([t]);
  }
  
}
