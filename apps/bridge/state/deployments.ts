import { createContext } from "react";

import { DeploymentDto } from "@/codegen/model";

export const DeploymentsContext = createContext<DeploymentDto[]>([]);
