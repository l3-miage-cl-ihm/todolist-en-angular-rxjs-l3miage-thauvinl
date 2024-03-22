import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TodolistServiceInterface } from './data/todo-list.interface';
import { TodoListService } from './todo-list.service';
import { TodoItem, TodoList, initialTDL, updateItems } from './data/todolist';
import { NonEmptyList } from './data/utils';
import { elementAt, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly sigTDL = computed<TodoList>(() => { return this.toDoListService.sigTDL() });
  

  constructor(private toDoListService: TodoListService) {

  }
  addToDo(L: NonEmptyList<string>) {
    console.log([L]);
    this.toDoListService.appendItems(L);
  }

  updateTask(l: readonly [Partial<TodoItem>, NonEmptyList<TodoItem>]) {
    this.toDoListService.updateItems(l[0], l[1]);
  }
  removeTask(t: NonEmptyList<TodoItem>) {
    this.toDoListService.deleteItems(t);
  }

}
