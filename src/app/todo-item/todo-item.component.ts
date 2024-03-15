import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { TodoItem } from '../data/todolist';

interface ItemState {
  readonly item: TodoItem;
  readonly editing: boolean; // true ssi l'utilisateur est en train d'éditer le label de la tâche
}
const initialItem : TodoItem = {uid : -1,label:"",done:false};
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  public sigItemState;

  private _sigItem = signal<TodoItem>(initialItem);
  protected _sigEditing = signal<boolean>(true);

  @Input({required:true})
    get item() {return this._sigItem()}
    set item(v:TodoItem) {this._sigItem.set(v)}
  @Output() update = new EventEmitter<Partial<TodoItem>>();
  @Output() delete = new EventEmitter<TodoItem>();


  constructor(){
    this.sigItemState = computed<ItemState> (()=> {
      return {
        item: this.item,
        editing: this.editing
      }
    })
  }
  protected get editing() : boolean{
    return this._sigEditing();
  }
  toggleTask(done:boolean){
    this.update.emit({
      ...this.item,
      done
    });
  }
  changeLabel(label:string){
    this.update.emit({
      ...this.item,
      label
    })
  }

}
