import { ButtonTypeMap, ExtendButtonBase } from "@mui/material";
import { MouseEventHandler, useState } from "react";
import { User } from "../App";

export const useExpand = (defaultValue: number, users: User[]): [
    MouseEventHandler<ExtendButtonBase<ButtonTypeMap<{}, "button">>>,
    MouseEventHandler<ExtendButtonBase<ButtonTypeMap<{}, "button">>>,
    User[],
    number
] => {
    const [expandNumber, setExpandNumber] = useState<number>(10);

    const handleExpand: MouseEventHandler<ExtendButtonBase<ButtonTypeMap<{}, "button">>> = (e)=>{
        setExpandNumber(nb => nb+10);
    }

    const handleExpandLess: MouseEventHandler<ExtendButtonBase<ButtonTypeMap<{}, "button">>> = (e)=>{
        setExpandNumber(nb => (nb > 10 ? nb-10 : nb));
    }
    

    const usersTodisplay = users.slice(0, expandNumber);

    return [handleExpand, handleExpandLess, usersTodisplay, expandNumber];
}