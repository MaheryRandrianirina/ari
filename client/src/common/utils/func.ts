export function debounce(eventHandler:Function, delay:number){
    let timer:number;
    return (...args:any[])=>{
        clearTimeout(timer);

        timer = setTimeout(()=>eventHandler(...args), delay);
    }
}