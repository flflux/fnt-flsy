import React from "react";
import { Society, User } from "@fnt-flsy/data-transfer-types";

export const UserContext = React.createContext<User | null>(null);
export const SocietyContext=React.createContext<Society | null>(null);