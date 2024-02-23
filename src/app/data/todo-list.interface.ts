import { Signal } from "@angular/core";
import { TodoList, TodoItem } from "./todolist";
import { NonEmptyList } from "./utils";

export interface TodolistServiceInterface {
    readonly sigTDL: Signal<TodoList>;
    appendItems(labels: NonEmptyList<string>): this;
    updateItems(up: Partial<TodoItem>, items: NonEmptyList<TodoItem>): this;
    deleteItems(list: NonEmptyList<TodoItem>): this;
  }
  