import { Initializer } from '@dropins/tools/types/elsie/src/lib';
import { Lang } from '@dropins/tools/types/elsie/src/i18n';
import { ProductModel } from '@dropins/storefront-pdp/data/models';

type ConfigProps = {
    langDefinitions?: Lang;
    defaultLocale?: string;
    sku?: string;
    acdl?: boolean;
    anchors?: string[];
    persistURLParams?: boolean;
    optionsUIDs?: string[];
    models?: {
        [name: string]: {
            initialData: any;
            transform: (data?: ProductModel) => ProductModel;
            fallbackData?: (parentProduct: any, simpleProduct: ProductModel) => ProductModel;
        };
    };
};
export declare const initialize: Initializer<ConfigProps>;
export declare const config: import('@dropins/tools/types/elsie/src/lib').Config<ConfigProps>;
export {};
//# sourceMappingURL=initialize.d.ts.map