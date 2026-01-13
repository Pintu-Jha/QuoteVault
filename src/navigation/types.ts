export type RootStackParamList = {
    MainTabs: undefined;
    Search: undefined;
    Collections: undefined;
    CollectionDetail: {
        collectionId: string;
        collectionName: string;
    };
    ShareQuote: {
        quote: {
            id: string;
            text: string;
            author: string;
            category: string;
        };
    };
    Settings: undefined;
    Auth: undefined;
};

export type ExploreStackParamList = {
    CategoryBrowse: undefined;
    CategoryQuotes: {
        categoryId: string;
        categoryName: string;
        categoryColor: string;
    };
};

export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    ResetPassword: undefined;
};
