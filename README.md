# TodoList en Angular RxJS

Nous allons implémenter un liste de choses à faire (todolist), en utilisant Angular et RxJS et en s'inspirant du site [todomvc.com](http://todomvc.com/).

Vous pouvez retrouver un exemple de correction attendue pour les différentes étapes de ce TP (en ordre antéchronologique) en ligne : [https://alexdmr.github.io/l3m-2023-2024-angular-todolist/](https://alexdmr.github.io/l3m-2023-2024-angular-todolist/)

## Configuration de votre github

Nous allons configurer votre github pour lui faire générer le site correspondant à votre projet.
Pour cela, nous nous appuierons sur les github pages et les github actions. 
A chaque fois que vous pousserez une nouvelle version de votre code sur le dépôt, il sera compilé via une github action et le résultat de la compilation sera mis en ligne sur github pages.

Rendez-vous à l'adresse de votre dépôt github, puis cliquez sur le bouton `Settings` en haut à droite.
Dans le menu à gauche, cliquez sur `Pages`, puis configurer comme suit :

* Source : `Deploy from a branch`
* Branch : `gh-pages`  /  `root`
* Puis cliquez sur `Save`

## Configuration du fichier package.json

Modifier le script associé à la commande `build`, remplacez `l3m-2023-2024-angular-todolist` par le nom de votre dépôt (devrait être de la forme `l3m-2023-2024-angular-todolist-GITHUBID` avec `GITHUBID` votre identifiant github).

Cette configuration est nécessaire pour que l'application puisse fonctionner une fois déployer sur votre github pages.

## Installation des dépendance

Utiliser le scrit de clean install (ci) :

```bash
npm ci
```

## Étape 1 : Création du service

Créez un service `TodoListService` qui contiendra la liste des tâches à faire.

```bash
npx ng g s todo-list
```

Assurez vous que le service implémente bien l'interface `TodoListServiceInterface` (fichier `src/app/data/todo-list.interface.ts`) et que le service est bien injecté dans le composant `AppComponent`. Utilisez les fonctions et les définitions de tye du fichier `src/app/data/todolist.ts` pour implémenter votre service.

Pensez à sauvegarder la liste des tâches dans le `localStorage` pour qu'elle soit persistante, référez vous à la façon dont `initialTDL` est construit dans le fichier `src/app/data/todolist.ts`.

Modifiez votre composant `AppComponent` pour qu'il affiche la liste des tâches à faire (sans pouvoir faire de modification pour le moment). Pour tester votre service, vous pouvez ajouter des tâches à la main dans le constructeur du composant racine ou via des boutons dans l'interface (et en modifier, en supprimer, etc...).

## Étape 2 : Un premier affichage pour la liste

Utilisez et complétez le template suivant pour afficher la liste des tâches à faire :

```html
<h1></h1>
Ajouter <form (submit)=""><input #newTodo/></form>
<ul>
  <li>
    <input  type="checkbox" />
    <form (submit)="">
      <input  type="text" name="newLabel" #newLabel />
    </form>
    <button>X</button>
  </li>
</ul>
```

Le but et d'intéragir correctement avec le service et d'obtenir une vue éditable de la liste des tâches à faire, avec un premier formulaire pour ajouter une nouvelle chose à faire et, pour chaque tâche :

* une case à cocher pour représenter le fait que la tâche est réalisée ou pas
* un formulaire contenant une balise input pour modifier son label
* un bouton pour la supprimer

Vérifiez que la vue de la version 1 est bien mise à jour à chaque fois que vous modifiez la liste des tâches à faire via la vue de la version 2.

## Étape 3 : Implémenter la vue conçue par le designer

On se place maintenant dans un cadre plus réaliste, on suppose que vous travaillez dans une équipe de développement et que vous avez reçu un design pour votre application. Vous devez maintenant implémenter ce design (celui du site todomvc...). La feuille de style a déjà été écrite pour vous par le designer (voir le fichier `src/styles.scss`), vous n'avez plus qu'à implémenter les composants en suivant les instructions du designer (on va les donner au dur et à mesure).

En bon développeur, vous identifiez tout de suite les composants de votre application :

* un composant `AppComponent`, le composant racine, qui contiendra les autres composants
* un composant `TodoListComponent` pour afficher la liste des tâches à faire, ce composant va gérer la création de nouveaux items, placer les items et gérer le pied de liste (avec les filtres, le nombres de choses à faire restante et le bouton "supprimer les choses faites").
* un composant `TodoItemComponent` pour afficher un item de la liste, ce composant va gérer l'édition d'un item, sa suppression et sa complétion.

Vous commencez donc par générer les deux composants qui vous manquent :

```bash
npx ng g c todo-list --change-detection OnPush
npx ng g c todo-item --change-detection OnPush
```

---
Vous faites de choix d'implémenter des composants purs, c'est à dire des composants dont l'affichage ne dépend que de leurs entrées et d'un éventuel état interne. Vos composants n'auront donc pas accès au service `TodoListService` et ne pourront pas le modifier directement. Ils devront définir des sorties pour communiquer entre eux. Cette approche vous permet de mieux découpler vos composants des services et de les rendre plus facilement réutilisables.

---

### Étape 3.1 : Un premier jet pour le composant TodoListComponent

Copiez et complétez le template présent dans le fichier `src/app/data/templates/todolist.html`. L'affichage de votre composant sera basé sur un état interne de type `TdlState`, dont voici la définition :

```typescript
interface TdlState {
  readonly tdl: TodoList;
  readonly nbItemsLeft: number;
  readonly isAllDone: boolean;
  readonly currentFilter: FCT_FILTER;
  readonly filteredItems: readonly TodoItem[];
}

// avec
type FCT_FILTER = (item: TodoItem) => boolean;
```

Votre composant devra spécifier les entées et les sorties suivantes :

* **ENTRÉE** `tdl`, obligatoire, de type `TodoList`, la liste des tâches à faire. Vous dériverez de cette entrée l'état interne de votre composant.
* **SORTIE** `appendItems`, émettant des `NonEmptyList<string>`. Cette sortie permettra de prévenir que l'utilisateur veut ajouter de nouvelles tâches à faire.
* **SORTIE** `deleteItems`, émettant des `NonEmptyList<TodoItem>`. Cette sortie permettra de prévenir que l'utilisateur veut supprimer des tâches à faire.
* **SORTIE** `updateItems`, émettant des tuples `readonly [Partial<TodoItem>, NonEmptyList<TodoItem>]`. Cette sortie permettra de prévenir que l'utilisateur veut modifier des tâches à faire.

Vous serez amené à gérer des filtres pour afficher les tâches à faire, définissez trois attributs `readonly` de type `FCT_FILTER` pour gérer les trois filtres possibles : `filterAll` (on affiche la tâche quelque soit son état), `filterDone` (on affiche la tâche si et seulement si elle est réalisée) et `filterUndone` (on affiche la tâche si et seulement si elle n'est pas réalisée). Vous aurez probablement besoin de déclarer un signal privé readonly `_currentFilter` pour gérer le filtre courant.

A la fin de cette étape, avec votre composant TodoList vous devriez pouvoir :

* Ajouter des tâches à faire
* Visualiser le nombre de tâches à faire restantes (balise `<strong>`)
* Afficher le bouton dans le footer de class CSS `clear-completed` SI ET SEULEMENT SI il y a des tâches réalisées.
* Visualiser le filtre courant (balise `<a>` dans le `<footer>`). La baslise `<a>` correspondant au filtre courant doit prendre la classe CSS `selected`.
* Lier en entrée l'input de classe CSS `toggle-all` à l'attribut `isAllDone` de l'état interne de votre composant.
* Afficher la balise `<label for="toggleAll" ...>` SI ET SEULEMENT SI la liste des tâches à faire n'est pas vide.

### Étape 3.2 : Le composant TodoItemComponent

Dans cette étape, vous allez coder et intégrer sommairement le composant TodoItem. Commencez par copier et compléter le template présent dans le fichier `src/app/data/templates/todoitem.html`. L'affichage de votre composant sera basé sur un état interne de type `ItemState`, dont voici la définition :

```typescript
interface ItemState {
  readonly item: TodoItem;
  readonly editing: boolean; // true ssi l'utilisateur est en train d'éditer le label de la tâche
}
```

Votre composant devra spécifier les entées et les sorties suivantes :

* **ENTRÉE** `item`, obligatoire, de type TodoItem.
* **SORTIE** `update`, qui émet des `Partial<TodoItem>`
* **SORTIE** `delete`, qui émet des `TodoItem`

Vous devrez donc gérer un signal interne pour modéliser le fait que vous éditez ou pas le label de l'item. Exposez les valeurs de ce signal sous la forme d'un attribut calculé en lecture seul nommé `editing` (en lecture seul signifie que vous ne spéciefierez que le getter). Pour que ce signal ne soit pas visible de l'extérieur du composant mais seulement dans le composant et son template, donnez lui une portée `protected`. Utilisez ce signal, conjointement avec l'entrée `item` pour en dériver l'état interne de votre composant.

---
Afin de tester votre composant, pensez bien à l'insérer dans la vue du composant TodoList (un composant TodoItem par balise `<li>`), n'oubliez pas de bien lier les entrées et les sorties. Attention, le designer a gérer le mode édition d'une façon particulière, pour que le champs texte permettant d'éditer le label de l'item s'affiche, il faut ajouter la classe CSS `editing` à la baslise `<li>` correspondante. Pour avoir accès à cette information, rappelez vous que les balise `app-todo-item` correspondent à des composant. Ainsi, si vous avez la référence à la balise (en lui donnant un nom à l'aide de la directive `#`, par exemple `<app-todo-item #toto ...>`), alors vous pouvez accéder à l'attribut editing du composant correspondant en écrivant dans votre template `toto.editing`.

---

A la fin de cette étape vous devriez pouvoir :

* Représenter l'état de l'item (fait ou pas, son label).
* Pouvoir supprimer l'item en cliquant sur le bouton `X`.
* Passer en mode édition lorsque vous double-cliqué sur le label de l'item. Le champs texte correspondant devrait alors prendre le focus (voir sous section ci-dessous).
* Sortir du mode edition si vous appuyez sur la touche `Entrer` ou si vous cliquez en dehors du champs texte (perte de focus sur le champs texte, événement `blur`). En sortant du mode édition, vous devriez envoyer un signal `update` avec le nouveau label de l'item.
* Modifier l'état de réalisation de l'item (case à cocher).

#### Le cas particulier du focus sur le champs texte

Pour gérer le focus sur le champs texte, vous aurez besoin de récupérer une référence vers le champs texte (identifié par `#newTextInput`) dans le template de votre composant. Pour cela, vous pouvez utiliser le décorateur `@ViewChild` dans votre vue-modèle :

```typescript
@ViewChild('newTextInput') newTextInput!: ElementRef<HTMLInputElement>;
```

Il n'est ensuite pas immédiat de pouvoir donner le focus à ce champs texte lorsque vous passez en mode édition. En effet, pour des raisons de sécurité, il n'est pas possible de donner le focus à un élément du DOM qui n'est pas encore rendu. Or, au moment où le code de passage au mode édition sera exécuté, le champs sera encore absent du DOM (le style de votre designer le cache). Il faut donc attendre que le champs soit rendu pour pouvoir lui donner le focus. Pour ce que nous en savons au moment de la rédaction de ce cours, Angular ne propose pas de solution bien intégrée à ce genre de problème, aussi il nous faudra mettre en place une solution en utilisant des connaissances plus approfonfies. Nous présentons deux solutions :

* **Solution 1:** On va exploiter ici le mode de rafraichissement des pages Web en utilisant la fonction [`requestAnimationFrame`](https://developer.mozilla.org/fr/docs/Web/API/window/requestAnimationFrame). Cette fonction permet de spécifier une fonction qui sera appelée lors du prochain rafraichissement de la page. Par rafraichissement on entend ici la mise à jour des éléments de la page (ça n'est PAS un rafraichissement de type touche F5 qui renvoie la requête au serveur). On suppose aussi que lors du prochain rafraichissement Angular aura eu le temps de prendre en compte les changements qui font que le champs texte sera rendu. On peut donc écrire :

  ```typescript
  requestAnimationFrame( () => this.newTextInput.nativeElement.focus() )
  ```

  Cette solution n'est toutefois pas très satisfaisante car elle fait une hypothèse sur le fonctionnement interne d'Angular et elle ne fonctionnera pas si le champs texte n'est pas rendu lors du prochain rafraichissement. Vous pouvez toutefois l'utiliser dans le cadre de ce TP, où tenter la mise en place de la deuxième solution, plus sure mais aussi plus complexe à mettre en œuvre.

* **Solution 2:** On va exploiter ici [le cycle de vie des composants Angular](https://angular.io/guide/lifecycle-hooks). Angular offre en particulier une méthode permettant de savoir quand la vue d'un composant a été ré-évaluée : `ngAfterViewChecked`. Nous allons utiliser cela pour coder le comportement suivant :

  ---
  Lorsque l'état du composant change et que `editing` **DEVIENT** vrai (c'est à dire qu'il était faux juste avant et vrai maintenant), **ALORS** dès que la vue du composant aura été ré-évaluée, on donne le focus au champs texte.

  ---

  Pour coder ce comportement, nous nous appuierons sur des observables RxJS :
  * On définira un RxJS `Subject<void>` `_viewChecked`
  * On implémentera l’interface `AfterViewChecked` dans le composant `TodoItemComponent`. On implémentera donc la méthode `ngAfterViewChecked`. Dans cette méthode, on fera émettre le sujet `_viewChecked`.
  * On dérivera le signal d’état du composant en observable (fonction `toObservable`)
  * On utilisera l’opérateur RxJS [`bufferCount`](https://rxjs.dev/api/operators/bufferCount) pour récupérer les deux dernières valeurs produites par cet observable.
  * On filtrera (opérateur RxJS [`filter`](https://rxjs.dev/api/index/function/filter)) ces valeurs pour ne retenir que le cas où editing passe de false à true.
  * On basculera alors (opérateur [`switchMap`](https://rxjs.dev/api/index/function/switchMap)) sur l’observable viewChecked, de sorte à attendre le prochain rafraichissement de la vue du composant.
  * On s’abonnera à cet observable pour enfin donner le focus au champs texte, dont on pourra alors assurer qu’il est visible.

### Étape 3.3 : Une dernière passe sur le composant TodoListComponent

Nous sommes presque arrivé au bout ! Pour respecter la spécification de notre designer, il reste encore quelques petites choses :

* La balise `<li>` d'un item doit prendre la classe CSS `completed` **SI ET SEULEMENT SI** l'item est réalisé. Les labels des items réalisés doivent apparaitre barrés.
* Il devrait y avoir une animation lorsque un item passe de l'état réalisé à l'état non réalisé et inversement (le label apparait grisé et barré au travers d'une animation de quelques centaines de millisecondes). Si ça n'est pas le cas, c'est qu'Angular détruit et recrée la balise `<li>` à chaque fois que l'état de l'item change. Comment faire pour éviter cela ? (indice : revoir la partie de cours relative à [trackBy](https://angular.io/api/common/NgForOf#change-propagation)).
* Complétez le code des balises `<a>` des filtres pour que le filtre courant soit bien appliqué quand on clique dessus.

## Étape 4 : Pour aller plus loin -> Ajouter une fonctionnalité d'historique

Cette étape s'adresse aux étudiants qui veulent aller plus loin, elle n'est donc pas obligatoire. On veut ici réfléchir à la mise en place d'un système d'annuler/refaire pour la liste. Pour cela, on propose de passer par une interface générique de gestion d'historique dont l'interface est :

```typescript
export interface UndoRedoInterface<T> {
    readonly state: Observable<UndoRedoState<T>>;
    undo(): void;
    redo(): void;
    set(newState: T): void;
}
```

avec `UndoRedoState` défini par :

```typescript
export interface UndoRedoState<T> {
    readonly present: T;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
}
```

Pour gérer des annuler/refaire de taille arbitraire, on met en place un mécanisme de piles. On va avoir une pile pour gérer les états passés de notre historique, une pile pour gérer les états futurs de notre historique (dans le cas où on annule des modifications, on empile les valeurs annulés dans la pile des état futures). On aura enfin bien sur un état présent. Nous vous proposons la modélisation suivante :

```typescript
interface UndoRedoInternalState<T> {
    readonly past: readonly T[];
    readonly present: T;
    readonly future: readonly T[];
}
```

### Étape 4.1 : Implémenter les fonctions de bases

Pour commencer, implémenter les **fonctions** suivantes :

```typescript
/**
 * On revient à la valeur précédente,
 * la valeur présente est empilée dans le futur
 * on dépile une valeur passée pour la mettre dans le présent
 * Si il n'y a pas de valeur passée, on ne fait rien et on renvoie l'état tel quel
 * sinon on renvoie un nouvel état
 * @param state L'état courant
 * @returns Un nouvel état, ou l'état courant si il n'y a pas de valeur passée
 */
function undo<T>(state: UndoRedoInternalState<T>): UndoRedoInternalState<T>;

/**
 * redo est l'inverse de undo
 * @param state L'état courant
 * @returns Un nouvel état, ou l'état courant si il n'y a pas de valeur futur.
 */
function redo<T>(state: UndoRedoInternalState<T>): UndoRedoInternalState<T>;

/**
 * set remplace la valeur présente par une nouvelle valeur
 * la valeur présente est empilée dans le passé
 * La pile des valeurs futur est vidée
 * @param state L'état courant
 * @param present La nouvelle valeur présente
 * @returns Un nouvel état
 */
function set<T>(state: UndoRedoInternalState<T>, present: T): UndoRedoInternalState<T>;
```

### Étape 4.2 : Implémenter l'interface UndoRedoInterface

Définissez le type `FctOp<T>`, les fonctions qui prennent en pramètre un `UndoRedoInternalState<T>` et renvoient comme résultat un `UndoRedoInternalState<T>` :

```typescript
type FctOp<T> = (state: UndoRedoInternalState<T>) => UndoRedoInternalState<T>;
```

Codez la classe `UndoRedo<T>`, qui implémente l'interface `UndoRedoInterface<T>`.

Intégrez cette classe dans votre application, vous devrez modifier le service `TodoListService` pour qu'il utilise cette classe pour gérer l'historique de la liste des tâches à faire et permette ainsi d'annuler/refaire les modifications de la liste.

Indications :

* Utilisez un behaviorSubject pour gérer un état interne (`UndoRedoInternalState<T>`).
* Utilisez un `Subject<FctOp<T>>` qui vous servira à publier les fonctions à appliquer.
* Combinez les observables de votre état interne et de votre sujet qui publie des fonctions à l'aide de l'opérateur [`scan`](https://rxjs.dev/api/index/function/scan).
* Pour prendre en compte que l'état ne change pas toujorus (ex: si on essai d'annuler alors qu'il n'y a pas de passé), vous pouvez aussi utiliser l'opérateur RxJS [`distinctUntilChanged`](https://rxjs.dev/api/operators/distinctUntilChanged).
* Pour s'abonner au clavier, vous pouvez utiliser un observable dans votre service :

  ```typescript
  fromEvent(window, 'keydown').pipe(
    map( e => e as KeyboardEvent ),
    filter( e => e.ctrlKey || e.metaKey)
  ).subscribe(
    e => {
      switch(e.key) {
        case 'z': // annuler
        case 'y': // refaire
      }
    }
  )
  ```
