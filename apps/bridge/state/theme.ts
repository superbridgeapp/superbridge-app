import { createContext } from "react";

import { ThemeDto } from "@/codegen/model";

export const ThemeContext = createContext<ThemeDto | null>(null);
