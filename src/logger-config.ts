export const AnodaConfig = {
    env:       undefined,
    appName:   undefined,
    loggerUri: undefined,
    loggerKey: undefined,

    init(obj: initObj) {
        this.env = obj.env;
        this.appName = obj.appName;
        this.loggerUri = obj.loggerUri;
        this.loggerKey = obj.loggerKey
}
};

interface initObj {
    env:       string,
    appName:   string,
    loggerUri: string,
    loggerKey: string,
}
