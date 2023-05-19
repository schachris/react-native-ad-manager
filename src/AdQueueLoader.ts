import { AdLoader } from './AdLoader';
import { Queue } from './Queue';
import type { AdSpecification, GADAdRequestOptions } from './types';

export class AdQueueLoader<AdFormatType, AdTargetingOptions = Record<string, string>> extends Queue<
  AdLoader<AdFormatType, AdTargetingOptions>
> {
  private minNumberOfItems: number = 0;
  private specification: AdSpecification;

  private requestOptions: GADAdRequestOptions<AdTargetingOptions> | undefined;

  constructor(
    specification: AdSpecification,
    specs: undefined | { length?: number },
    requestOptions?: GADAdRequestOptions<AdTargetingOptions> | undefined
  ) {
    super();
    this.handler = this;
    this.minNumberOfItems = specs?.length || 0;
    this.specification = specification;
    this.setOptions(requestOptions);
  }

  public setOptions(options: GADAdRequestOptions<AdTargetingOptions> | undefined) {
    console.log('##### SET OPTIONS', options);
    this.requestOptions = options;
    this.clear();
  }

  public getSpecification() {
    return this.specification;
  }

  public onSizeChanged(): void {
    this.refillQueue();
  }

  private refillQueue() {
    const missing = this.minNumberOfItems - this.size();
    for (let index = 0; index < missing; index++) {
      const ad = new AdLoader<AdFormatType, AdTargetingOptions>(
        this.specification,
        this.requestOptions,
        `prefetch_ad_${guidGenerator()}`
      );
      this.items.push(ad);
    }
  }
}

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}
