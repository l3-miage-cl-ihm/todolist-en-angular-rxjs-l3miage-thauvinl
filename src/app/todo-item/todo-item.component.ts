import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal, computed, signal } from '@angular/core';
import { appendItems, TodoItem } from '../data/todolist';
import { bufferCount, filter, Subject, switchMap } from 'rxjs';
import { toObservable } from "@angular/core/rxjs-interop"
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
export class TodoItemComponent implements AfterViewChecked{
  public sigItemState;

  private _sigItem = signal<TodoItem>(initialItem);
  protected _sigEditing = signal<boolean>(false);

  private _viewChecked = new Subject<void> ();
  

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
    const obs = toObservable(this.sigItemState);
    const derniersEtats = obs.pipe(
        bufferCount(2),
        filter(
          ([av,ap])=> !av.editing && ap.editing
        ),
        switchMap(()=>this._viewChecked)
      ).subscribe(this._viewChecked);
    
  }
  get editing() : boolean{
    return this._sigEditing();
  }
  toggleTask(done:boolean){
    this.update.emit({
      ...this.item,
      done
    });
  }
  deleteTask(){
    this.delete.emit(this.sigItemState().item);
  }
  changeLabel(label: string) {
    this._sigEditing.set(false);
    this.update.emit( {label} )
  }

  ngAfterViewChecked(): void {
    this._viewChecked.next();
  }


}
