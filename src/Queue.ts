export interface QueueHandler {
  onSizeChanged: () => void;
}

export class Queue<T> implements QueueHandler {
  protected items: T[] = [];
  public handler: QueueHandler | undefined;

  public enqueue(item: T): void {
    this.items.push(item);
    this.handler?.onSizeChanged();
  }

  public dequeue(): T | undefined {
    const item = this.items.shift();
    if (item !== undefined) {
      this.handler?.onSizeChanged();
    }
    return item;
  }

  public peek(): T | undefined {
    return this.items[0];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items = [];
    this.handler?.onSizeChanged();
  }

  public onSizeChanged() {}
}
