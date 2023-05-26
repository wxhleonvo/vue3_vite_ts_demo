interface IUseLocalStorage {
    setLocalStorage: (name: string, data: any) => void;
    getLocalStorage: (name: string) => any;
}

function useLocalStorage(): IUseLocalStorage {
    function setLocalStorage(name: string, data: any) {
        localStorage.setItem(name, data);
        //localStorage.setItem(name, JSON.stringify(data));
    }
    function getLocalStorage(name: string) {
        return localStorage.getItem(name);
        //return JSON.parse(localStorage.getItem(name)!);
    }
    return {
        setLocalStorage,
        getLocalStorage,
    };
}

export {
    useLocalStorage,
}