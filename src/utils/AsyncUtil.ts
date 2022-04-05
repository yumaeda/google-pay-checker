export const timeoutPromise = <T extends any>(timeoutMillis: number, callback: Promise<T>) => new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('timeout'));
        }, timeoutMillis);
        callback.then((value) => {
            clearTimeout(timer);
            resolve(value);
        }, (error) => {
            clearTimeout(timer);
            reject(error);
        })
    });
    
    export const timeoutAndRetryPromise = <T extends any>(callback: Promise<T>, timeoutMillis: number, retries: number) => new Promise<T>((resolve, reject) => {
        let retryCount = 0;
    
        (function tryAgain() {
            timeoutPromise(timeoutMillis, callback).then((value) => {
                resolve(value);
            }, (error) => {
                if (error.message === 'timeout') {
                    retryCount += 1;
                    if (retryCount < retries) {
                        tryAgain();
                    } else {
                        reject('no response');
                    }
                } else {
                    reject(error);
                }
            })
        })();
    });
    
    export const doNothing = (timeoutMillis: number) => new Promise(resolve => {
        setTimeout((value) => resolve(value), timeoutMillis);
    })
    
    export const delayPromise = <T extends any>(callback: Promise<T>, timeoutMillis: number) => new Promise<T>((resolve, reject) => {
        Promise.all([callback, doNothing(timeoutMillis)]).then(([result]) => {
            resolve(result);
        }, ([reason]) => {
            reject(reason);
        })
    })