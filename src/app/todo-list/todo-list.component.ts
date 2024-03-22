import { ChangeDetectionStrategy, Signal, Component, Input, signal, Output, EventEmitter, computed } from '@angular/core';
import { TodoItem, TodoList, initialTDL } from '../data/todolist';
import { NonEmptyList, nonEmptyList } from '../data/utils';

interface TdlState {
  readonly tdl: TodoList;
  readonly nbItemsLeft: number;
  readonly isAllDone: boolean;
  readonly currentFilter: FCT_FILTER;
  readonly filteredItems: readonly TodoItem[];
}

// avec
type FCT_FILTER = (item: TodoItem) => boolean;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  public sigTDLState;

  private _sigTdl = signal<TodoList>(initialTDL);
  @Input({ required: true })
  get tdl() { return this._sigTdl() }
  set tdl(v: TodoList) { this._sigTdl.set(v) }

  @Output() appendItems = new EventEmitter<NonEmptyList<string>>();
  @Output() deleteItems = new EventEmitter<NonEmptyList<TodoItem>>();
  @Output() updateItems = new EventEmitter<readonly [Partial<TodoItem>, NonEmptyList<TodoItem>]>();

  readonly filterAll: FCT_FILTER = () => true;
  readonly filterDone: FCT_FILTER = item => item.done;
  readonly filterUndone: FCT_FILTER = item => !item.done;

  public currentfilter = signal<FCT_FILTER> (this.filterAll);
  readonly itemsFiltered = computed<readonly TodoItem[]>(
    () => this.tdl.items.filter(this.currentfilter())
  );

  constructor() {
    this.sigTDLState = computed<TdlState>(() => {
      return {
        tdl: this.tdl,
        nbItemsLeft: this.nbItemsRemaining(),
        isAllDone: (this.nbItemsRemaining() === 0),
        currentFilter: this.currentfilter(),
        filteredItems: this.itemsFiltered()
      }
    })
  }

  nbItemsRemaining() {
    return this.tdl.items.reduce((acc, val) => !val.done ? acc + 1 : acc, 0);
  }

  toggleAllTasks(done: boolean) {
    const items = this.tdl.items;
    if (nonEmptyList(items)) {
      this.updateItems.emit([
        { done },
        items
      ])
    }
  }
  updateCurrentFilter(f : FCT_FILTER){
    this.currentfilter.set(f);
  }
  updateTasks(p:Partial<TodoItem>,t: NonEmptyList<TodoItem>){
    const items = this.tdl.items;
    if(nonEmptyList(items)){
      this.updateItems.emit([p,t])
    }
  }
  deleteTasks(t: TodoItem) {
    this.deleteItems.emit([t]);
  }


}
