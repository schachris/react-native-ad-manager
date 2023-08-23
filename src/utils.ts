import { AdState } from './types';

export function adStateToString(state: AdState) {
  switch (state) {
    case AdState.Error:
      return 'error';

    case AdState.Init:
      return 'init';

    case AdState.Loading:
      return 'loading';

    case AdState.Received:
      return 'received';

    case AdState.Displaying:
      return 'displaying';

    case AdState.Impression:
      return 'impression';

    case AdState.Clicked:
      return 'clicked';

    case AdState.Outdated:
      return 'outdated';
  }
}

export const PackageConfig = {
  logging: __DEV__,
};
