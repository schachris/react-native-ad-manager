import { AdState } from "./types";

export function adStateToString(state: AdState) {
  switch (state) {
    case AdState.Error:
      return "error";

    case AdState.Init:
      return "init";

    case AdState.Loading:
      return "loading";

    case AdState.Received:
      return "received";

    case AdState.Displaying:
      return "displaying";

    case AdState.Impression:
      return "impression";

    case AdState.Clicked:
      return "clicked";

    case AdState.Outdated:
      return "outdated";
  }
}

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
