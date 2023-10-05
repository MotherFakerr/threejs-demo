export class ElementIdPool {
    public maxId = 1e6;

    private _curId = 0;

    public generateId(): number {
        const id = ++this._curId;
        if (id > this.maxId) {
            throw Error('id larger than max id');
        }

        return id;
    }
}
