export const store = {} as KV;

export function registerStore(name: string) {
    return (Clazz: Class): void => (store[name] = new Clazz());
}
