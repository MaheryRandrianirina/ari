import { createContext } from "react";
import { User } from "../../App";

export const ConnectedUserContext = createContext<User|null>(null);