declare module 'db-local' {
  export interface DbLocalOptions {
    path: string
    readOnFind?: boolean
  }

  export interface SchemaDefinition {
    [key: string]: {
      type: any
      default?: any
      required?: boolean
    }
  }

  interface FilterOperators<T> {
    $eq?: T
    $ne?: T
    $gt?: T
    $gte?: T
    $lt?: T
    $lte?: T
    $in?: T[]
    $nin?: T[]
    $exists?: boolean
    $regex?: RegExp
  }

  export type FilterQuery<T> = {
    [P in keyof T]?: T[P] | FilterOperators<T[P]>
  }

  // Documents returned by query methods include instance methods for update, save, and remove.
  export interface Document<T> extends T {
    /**
     * Update the document using a partial update.
     * Returns a new document instance with the changes.
     */
    update(data: Partial<T>): Document<T>

    /**
     * Save the current state of the document.
     * Returns the updated document.
     */
    save(): T

    /**
     * Remove the document from the collection.
     * Returns the removed document.
     */
    remove(): T
  }

  // The Schema class is generic over the document type T.
  export interface SchemaInstance<T = any> {
    /**
     * Find a single document matching the query.
     * Returns a document instance with instance methods.
     */
    find(query: FilterQuery<T>): Document<T>[]

    /**
     * Find one document matching the query.
     * Returns a document instance or null if not found.
     */
    findOne(query: FilterQuery<T>): Document<T> | null

    /**
     * Create a new document with the given data.
     * Returns the created document instance.
     */
    create(data: T): Document<T>

    /**
     * Remove documents matching the query.
     * Returns the number of documents removed.
     */
    remove(query: FilterQuery<T>): number

    /**
     * Update documents matching the query with the provided data.
     * Returns the updated document instance.
     */
    update(query: FilterQuery<T>, data: Partial<T>): Document<T>

    /**
     * Replace the entire model (collection) with a new model.
     */
    replaceModel(newModel: T[]): void
  }

  export type Schema<T = any> = (model: string, definition: SchemaDefinition) => SchemaInstance<T>

  class DbLocal {
    constructor(options: DbLocalOptions)
    Schema: Schema
    Types: {
      ObjectId: string
    }
  }

  export default DbLocal
}
