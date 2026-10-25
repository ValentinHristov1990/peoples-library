export function findBookInCollections(collections, bookId) {
  for (const collection of collections) {
    const book = collection.books.find((b) => b.id === bookId);
    if (book) {
      return { collectionId: collection.id, book };
    }
  }
  return { collectionId: null, book: null };
}
