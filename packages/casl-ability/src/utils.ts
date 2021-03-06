import { AnyObject, Subject, SubjectClass, ForcedSubject, AliasesMap } from './types';

export function wrapArray<T>(value: T[] | T): T[] {
  return Array.isArray(value) ? value : [value];
}

export function setByPath(object: AnyObject, path: string, value: unknown): void {
  let ref = object;
  let lastKey = path;

  if (path.indexOf('.') !== -1) {
    const keys = path.split('.');

    lastKey = keys.pop()!;
    ref = keys.reduce((res, prop) => {
      res[prop] = res[prop] || {};
      return res[prop] as AnyObject;
    }, object);
  }

  ref[lastKey] = value;
}

const TYPE_FIELD = '__caslSubjectType__';
export function setSubjectType<
  T extends string,
  U extends Record<PropertyKey, any>
>(type: T, object: U): U & ForcedSubject<T> {
  if (object) {
    if (!object.hasOwnProperty(TYPE_FIELD)) {
      Object.defineProperty(object, TYPE_FIELD, { value: type });
    } else if (type !== object[TYPE_FIELD]) {
      throw new Error(`Trying to cast object to subject type ${type} but previously it was casted to ${object[TYPE_FIELD]}`);
    }
  }

  return object as U & ForcedSubject<T>;
}

export function detectSubjectType<T extends Subject>(subject?: T): string {
  if (!subject) {
    return 'all';
  }

  if (typeof subject === 'string') {
    return subject;
  }

  if (subject.hasOwnProperty(TYPE_FIELD)) {
    return (subject as any)[TYPE_FIELD];
  }

  const Type = typeof subject === 'function' ? subject : subject.constructor;
  return (Type as SubjectClass).modelName || Type.name;
}

type KeyOrValuesOf<T extends {}> = keyof T | T[keyof T] | Array<keyof T | T[keyof T]>;

export function expandActions(aliasMap: AliasesMap, rawActions: KeyOrValuesOf<AliasesMap>) {
  let actions = wrapArray(rawActions);
  let i = 0;

  while (i < actions.length) {
    const action = actions[i++] as string;

    if (aliasMap.hasOwnProperty(action)) {
      actions = actions.concat(aliasMap[action]);
    }
  }

  return actions;
}

function assertAliasMap(aliasMap: AliasesMap) {
  if (aliasMap.manage) {
    throw new Error('Cannot add alias for "manage" action because it is reserved');
  }

  Object.keys(aliasMap).forEach((alias) => {
    const hasError = alias === aliasMap[alias]
      || Array.isArray(aliasMap[alias]) && (
        aliasMap[alias].indexOf(alias) !== -1 || aliasMap[alias].indexOf('manage') !== -1
      );

    if (hasError) {
      throw new Error(`Attempt to alias action to itself: ${alias} -> ${aliasMap[alias]}`);
    }
  });
}

export const identity = <T>(x: T) => x;
export function createAliasResolver(aliasMap: AliasesMap) {
  if (process.env.NODE_ENV !== 'production') {
    assertAliasMap(aliasMap);
  }

  return (action: KeyOrValuesOf<AliasesMap>) => expandActions(aliasMap, action);
}
