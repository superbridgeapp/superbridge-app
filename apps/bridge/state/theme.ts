import { createContext } from "react";

import { ThemeDto } from "@/codegen/model";

export const ThemeContext = createContext<Partial<ThemeDto> | null>(null);
