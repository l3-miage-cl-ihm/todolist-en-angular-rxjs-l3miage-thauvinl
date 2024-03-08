import { ChangeDetectionStrategy, Signal, Component, Input, signal, Output, EventEmitter, computed } from '@angular/core';
import { TodoItem, TodoList, initialTDL } from '../data/todolist';
import { NonEmptyList } from '../data/utils';

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
  

  @Input() tdl : TodoList = initialTDL;
  @Output() appendItems = new EventEmitter<NonEmptyList<string>>();
  @Output() deleteItems = new EventEmitter<NonEmptyList<TodoItem>>();
  @Output() updateItems = new EventEmitter<readonly [Partial<TodoItem>, NonEmptyList<TodoItem>]>();

  readonly filterAll : FCT_FILTER = (item : TodoItem)=>{
    return true;
  }

  readonly filterDone : FCT_FILTER = (item : TodoItem)=>{
    return item.done;
  }

  readonly filterUndone : FCT_FILTER = (item : TodoItem)=>{
    return !item.done;
  }

  private _currentfilter = signal<FCT_FILTER>(this.filterAll);
  readonly itemsFiltered = signal<readonly TodoItem[]>(this.tdl.items.filter(this._currentfilter));
  


  //return this.tdl.items.filter(this.sigTDLState().currentFilter)
  constructor(){
    this.sigTDLState= computed<TdlState>(()=>{
      return {
        tdl : this.tdl,
        nbItemsLeft : this.nbItemsRemaining(),
        isAllDone : (this.nbItemsRemaining()===0),
        currentFilter : this._currentfilter(),
        filteredItems : this.itemsFiltered()
      }
    })
  }

  nbItemsRemaining(){
    return this.tdl.items.reduce((acc, val)=> !val.done? acc+1 : acc, 0);
  }


}
