import { NonEmptyList } from "./utils";

/**
 * Un TodoItem st une chose à faire,
 * avec un label et un état (fait ou pas fait).
 */
export interface TodoItem {
    readonly uid: number;
    readonly label: string;
    readonly done: boolean;
}

/**
 * Un TodoList est une liste de TodoItem.
 */
export interface TodoList {
    readonly uid: number;
    readonly title: string;
    readonly items: readonly TodoItem[];
}

/**
 * getUid renvoie un identifiant unique.
 */
let _uid = 0;
function getUid(): number {
    return _uid++;
}

/**
 * initialTDL est la liste initiale.
 * On la charge depuis le localStorage.
 * Si elle n'existe pas dans localStorage, on la crée.
 */
const localTDL: Partial<TodoList> = JSON.parse(localStorage.getItem("tdl") ?? "{}");
export const initialTDL = {
    uid: getUid(),
    title: localTDL.title ?? "Liste Miage",
    items: (localTDL.items ?? []).map(item => ({ ...item, uid: getUid() }))
};

/**
 * appendItems ajoute des items dont les labels
 * sont donnés en paramètre.
 * appendItems renvoie une nouvelle liste.
 * @param tdl La liste original
 * @param labels Les labels des items à ajouter
 * @returns La nouvelle liste, avec les items correspondants aux labels ajoutés à la fin
 */
export function appendItems(tdl: TodoList, labels: NonEmptyList<string>): TodoList {
    return {
        ...tdl,
        items: [
            ...tdl.items,
            ...labels.map(label => ({ label, done: false, uid: getUid() }))
        ]
    }
}

/**
 * updateItems met à jour les items donnés en paramètre.
 * updateItems renvoie une nouvelle liste.
 * @param tdl La liste originale
 * @param up Les modifications à apporter aux items. Si le label est vide, celui équivaut à une suppression
 * @param items Les items à modifier
 * @returns La nouvelle liste, avec les items modifiés
 */
export function updateItems(tdl: TodoList, up: Partial<TodoItem>, items: NonEmptyList<TodoItem>): TodoList {
    if (up.label === "") return deleteItems(tdl, items);

    const L = items.filter(item => !itemPartiallyEqualTo(item, up));
    return L.length == 0 ? tdl : {
        ...tdl,
        items: tdl.items.map(item => L.includes(item) ? { ...item, ...up } : item)
    };
}

/**
 * deleteItems supprime les items donnés en paramètre.
 * deleteItems renvoie une nouvelle liste.
 * @param tdl La liste originale
 * @param listItems Les items à supprimer
 * @returns La nouvelle liste, sans les items supprimés
 */
export function deleteItems(tdl: TodoList, listItems: NonEmptyList<TodoItem>): TodoList {
    const items = tdl.items.filter(item => !listItems.includes(item));
    return items.length == 0 ? tdl : { ...tdl, items };
}


/**
 * itemPartiallyEqualTo teste si un item est partiellement égal à un item partiel.
 * @param item Un item
 * @param ref Un item partiel
 * @returns true si, pour les atributs définis dans ref, item et ref ont la même valeur
 */
function itemPartiallyEqualTo(item: TodoItem, ref: Partial<TodoItem>): boolean {
    return (Object.keys(ref) as (keyof TodoItem)[]).every(k => ref[k] === item[k])
}
