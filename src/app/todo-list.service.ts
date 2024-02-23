import { Injectable, signal } from '@angular/core';
import { TodolistServiceInterface } from './data/todo-list.interface';
import { TodoList, TodoItem, initialTDL, appendItems, updateItems, deleteItems } from './data/todolist';
import { NonEmptyList } from './data/utils';

@Injectable({
  providedIn: 'root'
})
export class TodoListService implements TodolistServiceInterface{

  readonly sigTDL =  signal<TodoList>(initialTDL);

  constructor() {
    
  }

  appendItems(labels: NonEmptyList<string>): this {
    appendItems(this.sigTDL(), labels);
    localStorage.setItem("tdl", JSON.stringify(this.sigTDL()));
    return this;
  }
  updateItems(up: Partial<TodoItem>, items: NonEmptyList<TodoItem>): this {
    updateItems(this.sigTDL(), up, items);
    localStorage.setItem("tdl", JSON.stringify(this.sigTDL()));
    return this;
  }
  deleteItems(list: NonEmptyList<TodoItem>): this {
    deleteItems(this.sigTDL(), list);
    localStorage.setItem("tdl", JSON.stringify(this.sigTDL()));
    return this;
  }
}
