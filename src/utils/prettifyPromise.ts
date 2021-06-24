async function prettifyPromise<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const result = await promise;

    return [result, null];
  } catch (error) {
    return [null, error];
  }
}

export default prettifyPromise;