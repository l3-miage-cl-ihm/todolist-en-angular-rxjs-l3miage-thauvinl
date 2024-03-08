import { Injectable, effect, signal } from '@angular/core';
import { TodolistServiceInterface } from './data/todo-list.interface';
import { TodoList, TodoItem, initialTDL, appendItems, updateItems, deleteItems } from './data/todolist';
import { NonEmptyList } from './data/utils';

@Injectable({
  providedIn: 'root'
})
export class TodoListService implements TodolistServiceInterface{

  readonly sigTDL =  signal<TodoList>(initialTDL);

  constructor() {
    const initTDL = localStorage.getItem('tdl');
    if (!!initTDL) {
      // On parse
      const L = JSON.parse(initTDL) as TodoList;
      // On charge les items
      this.sigTDL.set( L );
    }

    effect( () => {
      const tdl = this.sigTDL();
      localStorage.setItem("tdl", JSON.stringify(tdl));
    });
  }

  appendItems(labels: NonEmptyList<string>): this {
    this.sigTDL.set(appendItems(this.sigTDL(), labels));
    return this;
  }
  updateItems(up: Partial<TodoItem>, items: NonEmptyList<TodoItem>): this {
    this.sigTDL.set(updateItems(this.sigTDL(), up, items));
    return this;
  }
  deleteItems(list: NonEmptyList<TodoItem>): this {
    this.sigTDL.set(deleteItems(this.sigTDL(), list));
    return this;
  }
}
