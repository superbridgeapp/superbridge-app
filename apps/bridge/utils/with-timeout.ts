export const withTimeout = async <T>(
  promise: () => Promise<T>,
  timeoutMs = 1_000
) => {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((resolve, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error("timeout")), timeoutMs);
  });

  return Promise.race([promise(), timeoutPromise])
    .then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    })
    .catch((e) => {
      throw e;
    });
};
