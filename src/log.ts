export const PackageConfig = {
  logging: false
};

export function logInfo(
  shouldLog: boolean,
  {
    adUnitId,
    formatIds,
    identifier
  }: { identifier?: string; adUnitId: string; formatIds: string[] },
  name: string,
  ...data: any[]
) {
  if (__DEV__ && shouldLog) {
    console.log("AMAD: ", adUnitId, identifier || formatIds, name, ...data);
  }
}
