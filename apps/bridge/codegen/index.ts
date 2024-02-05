/**
 * Generated by orval v6.24.0 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query'
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query'
import axios from 'axios'
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import type {
  ActionDto,
  ActivityDto,
  BridgeControllerGetActivityParams,
  BridgeNftDto,
  CcipReadDto,
  CcipReadResponseDto,
  CctpDomainDto,
  ConduitDeploymentConfigDto,
  CreateConduitDeploymentDto,
  DeploymentDto,
  IdDto,
  SyncStatusDto,
  TransactionDto
} from './model'




export const bridgeControllerGetActivity = (
    address: string,
    params: BridgeControllerGetActivityParams, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<ActivityDto>> => {
    
    return axios.get(
      `/api/bridge/activity/${address}`,{
    ...options,
        params: {...params, ...options?.params},}
    );
  }


export const getBridgeControllerGetActivityQueryKey = (address: string,
    params: BridgeControllerGetActivityParams,) => {
    return [`/api/bridge/activity/${address}`, ...(params ? [params]: [])] as const;
    }

    
export const getBridgeControllerGetActivityQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetActivity>>, TError = AxiosError<unknown>>(address: string,
    params: BridgeControllerGetActivityParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetActivity>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetActivityQueryKey(address,params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetActivity>>> = ({ signal }) => bridgeControllerGetActivity(address,params, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(address), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetActivity>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetActivityQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetActivity>>>
export type BridgeControllerGetActivityQueryError = AxiosError<unknown>

export const useBridgeControllerGetActivity = <TData = Awaited<ReturnType<typeof bridgeControllerGetActivity>>, TError = AxiosError<unknown>>(
 address: string,
    params: BridgeControllerGetActivityParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetActivity>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetActivityQueryOptions(address,params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerGetProveTransactionV2 = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<TransactionDto>> => {
    
    return axios.get(
      `/api/bridge/prove_transaction_v2/${id}`,options
    );
  }


export const getBridgeControllerGetProveTransactionV2QueryKey = (id: string,) => {
    return [`/api/bridge/prove_transaction_v2/${id}`] as const;
    }

    
export const getBridgeControllerGetProveTransactionV2QueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetProveTransactionV2>>, TError = AxiosError<unknown>>(id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetProveTransactionV2>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetProveTransactionV2QueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetProveTransactionV2>>> = ({ signal }) => bridgeControllerGetProveTransactionV2(id, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetProveTransactionV2>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetProveTransactionV2QueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetProveTransactionV2>>>
export type BridgeControllerGetProveTransactionV2QueryError = AxiosError<unknown>

export const useBridgeControllerGetProveTransactionV2 = <TData = Awaited<ReturnType<typeof bridgeControllerGetProveTransactionV2>>, TError = AxiosError<unknown>>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetProveTransactionV2>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetProveTransactionV2QueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerGetProveTransaction = (
    idDto: IdDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<TransactionDto>> => {
    
    return axios.post(
      `/api/bridge/prove`,
      idDto,options
    );
  }



export const getBridgeControllerGetProveTransactionMutationOptions = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerGetProveTransaction>>, TError,{data: IdDto}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerGetProveTransaction>>, TError,{data: IdDto}, TContext> => {
 const {mutation: mutationOptions, axios: axiosOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof bridgeControllerGetProveTransaction>>, {data: IdDto}> = (props) => {
          const {data} = props ?? {};

          return  bridgeControllerGetProveTransaction(data,axiosOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type BridgeControllerGetProveTransactionMutationResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetProveTransaction>>>
    export type BridgeControllerGetProveTransactionMutationBody = IdDto
    export type BridgeControllerGetProveTransactionMutationError = AxiosError<unknown>

    export const useBridgeControllerGetProveTransaction = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerGetProveTransaction>>, TError,{data: IdDto}, TContext>, axios?: AxiosRequestConfig}
) => {

      const mutationOptions = getBridgeControllerGetProveTransactionMutationOptions(options);

      return useMutation(mutationOptions);
    }
    
export const bridgeControllerGetFinaliseTransactionV2 = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<TransactionDto>> => {
    
    return axios.get(
      `/api/bridge/finalise_transaction_v2/${id}`,options
    );
  }


export const getBridgeControllerGetFinaliseTransactionV2QueryKey = (id: string,) => {
    return [`/api/bridge/finalise_transaction_v2/${id}`] as const;
    }

    
export const getBridgeControllerGetFinaliseTransactionV2QueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransactionV2>>, TError = AxiosError<unknown>>(id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransactionV2>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetFinaliseTransactionV2QueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransactionV2>>> = ({ signal }) => bridgeControllerGetFinaliseTransactionV2(id, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransactionV2>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetFinaliseTransactionV2QueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransactionV2>>>
export type BridgeControllerGetFinaliseTransactionV2QueryError = AxiosError<unknown>

export const useBridgeControllerGetFinaliseTransactionV2 = <TData = Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransactionV2>>, TError = AxiosError<unknown>>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransactionV2>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetFinaliseTransactionV2QueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerGetFinaliseTransaction = (
    idDto: IdDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<TransactionDto>> => {
    
    return axios.post(
      `/api/bridge/finalise`,
      idDto,options
    );
  }



export const getBridgeControllerGetFinaliseTransactionMutationOptions = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransaction>>, TError,{data: IdDto}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransaction>>, TError,{data: IdDto}, TContext> => {
 const {mutation: mutationOptions, axios: axiosOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransaction>>, {data: IdDto}> = (props) => {
          const {data} = props ?? {};

          return  bridgeControllerGetFinaliseTransaction(data,axiosOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type BridgeControllerGetFinaliseTransactionMutationResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransaction>>>
    export type BridgeControllerGetFinaliseTransactionMutationBody = IdDto
    export type BridgeControllerGetFinaliseTransactionMutationError = AxiosError<unknown>

    export const useBridgeControllerGetFinaliseTransaction = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerGetFinaliseTransaction>>, TError,{data: IdDto}, TContext>, axios?: AxiosRequestConfig}
) => {

      const mutationOptions = getBridgeControllerGetFinaliseTransactionMutationOptions(options);

      return useMutation(mutationOptions);
    }
    
export const bridgeControllerGetArbitrumFinaliseTransaction = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<TransactionDto>> => {
    
    return axios.get(
      `/api/bridge/arbitrum_finalise_transaction/${id}`,options
    );
  }


export const getBridgeControllerGetArbitrumFinaliseTransactionQueryKey = (id: string,) => {
    return [`/api/bridge/arbitrum_finalise_transaction/${id}`] as const;
    }

    
export const getBridgeControllerGetArbitrumFinaliseTransactionQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetArbitrumFinaliseTransaction>>, TError = AxiosError<unknown>>(id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetArbitrumFinaliseTransaction>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetArbitrumFinaliseTransactionQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetArbitrumFinaliseTransaction>>> = ({ signal }) => bridgeControllerGetArbitrumFinaliseTransaction(id, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetArbitrumFinaliseTransaction>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetArbitrumFinaliseTransactionQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetArbitrumFinaliseTransaction>>>
export type BridgeControllerGetArbitrumFinaliseTransactionQueryError = AxiosError<unknown>

export const useBridgeControllerGetArbitrumFinaliseTransaction = <TData = Awaited<ReturnType<typeof bridgeControllerGetArbitrumFinaliseTransaction>>, TError = AxiosError<unknown>>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetArbitrumFinaliseTransaction>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetArbitrumFinaliseTransactionQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerGetCctpMintTransaction = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<TransactionDto>> => {
    
    return axios.get(
      `/api/bridge/cctp_mint/${id}`,options
    );
  }


export const getBridgeControllerGetCctpMintTransactionQueryKey = (id: string,) => {
    return [`/api/bridge/cctp_mint/${id}`] as const;
    }

    
export const getBridgeControllerGetCctpMintTransactionQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetCctpMintTransaction>>, TError = AxiosError<unknown>>(id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpMintTransaction>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetCctpMintTransactionQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetCctpMintTransaction>>> = ({ signal }) => bridgeControllerGetCctpMintTransaction(id, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpMintTransaction>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetCctpMintTransactionQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetCctpMintTransaction>>>
export type BridgeControllerGetCctpMintTransactionQueryError = AxiosError<unknown>

export const useBridgeControllerGetCctpMintTransaction = <TData = Awaited<ReturnType<typeof bridgeControllerGetCctpMintTransaction>>, TError = AxiosError<unknown>>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpMintTransaction>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetCctpMintTransactionQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerFiatPrices = (
     options?: AxiosRequestConfig
 ): Promise<AxiosResponse<void>> => {
    
    return axios.get(
      `/api/bridge/fiat_prices`,options
    );
  }


export const getBridgeControllerFiatPricesQueryKey = () => {
    return [`/api/bridge/fiat_prices`] as const;
    }

    
export const getBridgeControllerFiatPricesQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerFiatPrices>>, TError = AxiosError<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerFiatPrices>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerFiatPricesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerFiatPrices>>> = ({ signal }) => bridgeControllerFiatPrices({ signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerFiatPrices>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerFiatPricesQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerFiatPrices>>>
export type BridgeControllerFiatPricesQueryError = AxiosError<unknown>

export const useBridgeControllerFiatPrices = <TData = Awaited<ReturnType<typeof bridgeControllerFiatPrices>>, TError = AxiosError<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerFiatPrices>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerFiatPricesQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerGetTokenPrices = (
     options?: AxiosRequestConfig
 ): Promise<AxiosResponse<void>> => {
    
    return axios.get(
      `/api/bridge/token_prices`,options
    );
  }


export const getBridgeControllerGetTokenPricesQueryKey = () => {
    return [`/api/bridge/token_prices`] as const;
    }

    
export const getBridgeControllerGetTokenPricesQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetTokenPrices>>, TError = AxiosError<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetTokenPrices>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetTokenPricesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetTokenPrices>>> = ({ signal }) => bridgeControllerGetTokenPrices({ signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetTokenPrices>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetTokenPricesQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetTokenPrices>>>
export type BridgeControllerGetTokenPricesQueryError = AxiosError<unknown>

export const useBridgeControllerGetTokenPrices = <TData = Awaited<ReturnType<typeof bridgeControllerGetTokenPrices>>, TError = AxiosError<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetTokenPrices>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetTokenPricesQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerAdminGetDeployments = (
     options?: AxiosRequestConfig
 ): Promise<AxiosResponse<DeploymentDto[]>> => {
    
    return axios.get(
      `/api/bridge/admin/deployment`,options
    );
  }


export const getBridgeControllerAdminGetDeploymentsQueryKey = () => {
    return [`/api/bridge/admin/deployment`] as const;
    }

    
export const getBridgeControllerAdminGetDeploymentsQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerAdminGetDeployments>>, TError = AxiosError<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerAdminGetDeployments>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerAdminGetDeploymentsQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerAdminGetDeployments>>> = ({ signal }) => bridgeControllerAdminGetDeployments({ signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerAdminGetDeployments>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerAdminGetDeploymentsQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerAdminGetDeployments>>>
export type BridgeControllerAdminGetDeploymentsQueryError = AxiosError<unknown>

export const useBridgeControllerAdminGetDeployments = <TData = Awaited<ReturnType<typeof bridgeControllerAdminGetDeployments>>, TError = AxiosError<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerAdminGetDeployments>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerAdminGetDeploymentsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerAdminAddDeployment = (
    idDto: IdDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<IdDto>> => {
    
    return axios.post(
      `/api/bridge/admin/deployment`,
      idDto,options
    );
  }



export const getBridgeControllerAdminAddDeploymentMutationOptions = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerAdminAddDeployment>>, TError,{data: IdDto}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerAdminAddDeployment>>, TError,{data: IdDto}, TContext> => {
 const {mutation: mutationOptions, axios: axiosOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof bridgeControllerAdminAddDeployment>>, {data: IdDto}> = (props) => {
          const {data} = props ?? {};

          return  bridgeControllerAdminAddDeployment(data,axiosOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type BridgeControllerAdminAddDeploymentMutationResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerAdminAddDeployment>>>
    export type BridgeControllerAdminAddDeploymentMutationBody = IdDto
    export type BridgeControllerAdminAddDeploymentMutationError = AxiosError<unknown>

    export const useBridgeControllerAdminAddDeployment = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerAdminAddDeployment>>, TError,{data: IdDto}, TContext>, axios?: AxiosRequestConfig}
) => {

      const mutationOptions = getBridgeControllerAdminAddDeploymentMutationOptions(options);

      return useMutation(mutationOptions);
    }
    
export const bridgeControllerGetCctpDomains = (
     options?: AxiosRequestConfig
 ): Promise<AxiosResponse<CctpDomainDto[]>> => {
    
    return axios.get(
      `/api/bridge/cctp_domains`,options
    );
  }


export const getBridgeControllerGetCctpDomainsQueryKey = () => {
    return [`/api/bridge/cctp_domains`] as const;
    }

    
export const getBridgeControllerGetCctpDomainsQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetCctpDomains>>, TError = AxiosError<unknown>>( options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpDomains>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetCctpDomainsQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetCctpDomains>>> = ({ signal }) => bridgeControllerGetCctpDomains({ signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpDomains>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetCctpDomainsQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetCctpDomains>>>
export type BridgeControllerGetCctpDomainsQueryError = AxiosError<unknown>

export const useBridgeControllerGetCctpDomains = <TData = Awaited<ReturnType<typeof bridgeControllerGetCctpDomains>>, TError = AxiosError<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpDomains>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetCctpDomainsQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerGetDeploymentSyncStatus = (
    deploymentId: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<SyncStatusDto[]>> => {
    
    return axios.get(
      `/api/bridge/sync_status/${deploymentId}`,options
    );
  }


export const getBridgeControllerGetDeploymentSyncStatusQueryKey = (deploymentId: string,) => {
    return [`/api/bridge/sync_status/${deploymentId}`] as const;
    }

    
export const getBridgeControllerGetDeploymentSyncStatusQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetDeploymentSyncStatus>>, TError = AxiosError<unknown>>(deploymentId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetDeploymentSyncStatus>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetDeploymentSyncStatusQueryKey(deploymentId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetDeploymentSyncStatus>>> = ({ signal }) => bridgeControllerGetDeploymentSyncStatus(deploymentId, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(deploymentId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetDeploymentSyncStatus>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetDeploymentSyncStatusQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetDeploymentSyncStatus>>>
export type BridgeControllerGetDeploymentSyncStatusQueryError = AxiosError<unknown>

export const useBridgeControllerGetDeploymentSyncStatus = <TData = Awaited<ReturnType<typeof bridgeControllerGetDeploymentSyncStatus>>, TError = AxiosError<unknown>>(
 deploymentId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetDeploymentSyncStatus>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetDeploymentSyncStatusQueryOptions(deploymentId,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerGetCctpSyncStatus = (
    chainId: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<SyncStatusDto[]>> => {
    
    return axios.get(
      `/api/bridge/cctp_sync_status/${chainId}`,options
    );
  }


export const getBridgeControllerGetCctpSyncStatusQueryKey = (chainId: string,) => {
    return [`/api/bridge/cctp_sync_status/${chainId}`] as const;
    }

    
export const getBridgeControllerGetCctpSyncStatusQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetCctpSyncStatus>>, TError = AxiosError<unknown>>(chainId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpSyncStatus>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetCctpSyncStatusQueryKey(chainId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetCctpSyncStatus>>> = ({ signal }) => bridgeControllerGetCctpSyncStatus(chainId, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(chainId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpSyncStatus>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetCctpSyncStatusQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetCctpSyncStatus>>>
export type BridgeControllerGetCctpSyncStatusQueryError = AxiosError<unknown>

export const useBridgeControllerGetCctpSyncStatus = <TData = Awaited<ReturnType<typeof bridgeControllerGetCctpSyncStatus>>, TError = AxiosError<unknown>>(
 chainId: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetCctpSyncStatus>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetCctpSyncStatusQueryOptions(chainId,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerHandleCctpHyperlane = (
    ccipReadDto: CcipReadDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<CcipReadResponseDto[]>> => {
    
    return axios.post(
      `/api/bridge/cctp`,
      ccipReadDto,options
    );
  }



export const getBridgeControllerHandleCctpHyperlaneMutationOptions = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerHandleCctpHyperlane>>, TError,{data: CcipReadDto}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerHandleCctpHyperlane>>, TError,{data: CcipReadDto}, TContext> => {
 const {mutation: mutationOptions, axios: axiosOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof bridgeControllerHandleCctpHyperlane>>, {data: CcipReadDto}> = (props) => {
          const {data} = props ?? {};

          return  bridgeControllerHandleCctpHyperlane(data,axiosOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type BridgeControllerHandleCctpHyperlaneMutationResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerHandleCctpHyperlane>>>
    export type BridgeControllerHandleCctpHyperlaneMutationBody = CcipReadDto
    export type BridgeControllerHandleCctpHyperlaneMutationError = AxiosError<unknown>

    export const useBridgeControllerHandleCctpHyperlane = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerHandleCctpHyperlane>>, TError,{data: CcipReadDto}, TContext>, axios?: AxiosRequestConfig}
) => {

      const mutationOptions = getBridgeControllerHandleCctpHyperlaneMutationOptions(options);

      return useMutation(mutationOptions);
    }
    
export const bridgeControllerCreateConduitDeployment = (
    createConduitDeploymentDto: CreateConduitDeploymentDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<ConduitDeploymentConfigDto>> => {
    
    return axios.post(
      `/api/bridge/conduit/deployment`,
      createConduitDeploymentDto,options
    );
  }



export const getBridgeControllerCreateConduitDeploymentMutationOptions = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerCreateConduitDeployment>>, TError,{data: CreateConduitDeploymentDto}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerCreateConduitDeployment>>, TError,{data: CreateConduitDeploymentDto}, TContext> => {
 const {mutation: mutationOptions, axios: axiosOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof bridgeControllerCreateConduitDeployment>>, {data: CreateConduitDeploymentDto}> = (props) => {
          const {data} = props ?? {};

          return  bridgeControllerCreateConduitDeployment(data,axiosOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type BridgeControllerCreateConduitDeploymentMutationResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerCreateConduitDeployment>>>
    export type BridgeControllerCreateConduitDeploymentMutationBody = CreateConduitDeploymentDto
    export type BridgeControllerCreateConduitDeploymentMutationError = AxiosError<unknown>

    export const useBridgeControllerCreateConduitDeployment = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerCreateConduitDeployment>>, TError,{data: CreateConduitDeploymentDto}, TContext>, axios?: AxiosRequestConfig}
) => {

      const mutationOptions = getBridgeControllerCreateConduitDeploymentMutationOptions(options);

      return useMutation(mutationOptions);
    }
    
export const bridgeControllerGetConduitDeployment = (
    id: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<ConduitDeploymentConfigDto>> => {
    
    return axios.get(
      `/api/bridge/conduit/deployment/${id}`,options
    );
  }


export const getBridgeControllerGetConduitDeploymentQueryKey = (id: string,) => {
    return [`/api/bridge/conduit/deployment/${id}`] as const;
    }

    
export const getBridgeControllerGetConduitDeploymentQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetConduitDeployment>>, TError = AxiosError<unknown>>(id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetConduitDeployment>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetConduitDeploymentQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetConduitDeployment>>> = ({ signal }) => bridgeControllerGetConduitDeployment(id, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetConduitDeployment>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetConduitDeploymentQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetConduitDeployment>>>
export type BridgeControllerGetConduitDeploymentQueryError = AxiosError<unknown>

export const useBridgeControllerGetConduitDeployment = <TData = Awaited<ReturnType<typeof bridgeControllerGetConduitDeployment>>, TError = AxiosError<unknown>>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetConduitDeployment>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetConduitDeploymentQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const bridgeControllerTrack = (
    actionDto: ActionDto, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<void>> => {
    
    return axios.post(
      `/api/bridge/track`,
      actionDto,options
    );
  }



export const getBridgeControllerTrackMutationOptions = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerTrack>>, TError,{data: ActionDto}, TContext>, axios?: AxiosRequestConfig}
): UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerTrack>>, TError,{data: ActionDto}, TContext> => {
 const {mutation: mutationOptions, axios: axiosOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof bridgeControllerTrack>>, {data: ActionDto}> = (props) => {
          const {data} = props ?? {};

          return  bridgeControllerTrack(data,axiosOptions)
        }

        


   return  { mutationFn, ...mutationOptions }}

    export type BridgeControllerTrackMutationResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerTrack>>>
    export type BridgeControllerTrackMutationBody = ActionDto
    export type BridgeControllerTrackMutationError = AxiosError<unknown>

    export const useBridgeControllerTrack = <TError = AxiosError<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof bridgeControllerTrack>>, TError,{data: ActionDto}, TContext>, axios?: AxiosRequestConfig}
) => {

      const mutationOptions = getBridgeControllerTrackMutationOptions(options);

      return useMutation(mutationOptions);
    }
    
export const bridgeControllerGetNfts = (
    deploymentId: string,
    withdrawing: string,
    address: string, options?: AxiosRequestConfig
 ): Promise<AxiosResponse<BridgeNftDto[]>> => {
    
    return axios.get(
      `/api/bridge/nfts/${deploymentId}/${withdrawing}/${address}`,options
    );
  }


export const getBridgeControllerGetNftsQueryKey = (deploymentId: string,
    withdrawing: string,
    address: string,) => {
    return [`/api/bridge/nfts/${deploymentId}/${withdrawing}/${address}`] as const;
    }

    
export const getBridgeControllerGetNftsQueryOptions = <TData = Awaited<ReturnType<typeof bridgeControllerGetNfts>>, TError = AxiosError<unknown>>(deploymentId: string,
    withdrawing: string,
    address: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetNfts>>, TError, TData>, axios?: AxiosRequestConfig}
) => {

const {query: queryOptions, axios: axiosOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBridgeControllerGetNftsQueryKey(deploymentId,withdrawing,address);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof bridgeControllerGetNfts>>> = ({ signal }) => bridgeControllerGetNfts(deploymentId,withdrawing,address, { signal, ...axiosOptions });

      

      

   return  { queryKey, queryFn, enabled: !!(deploymentId && withdrawing && address), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetNfts>>, TError, TData> & { queryKey: QueryKey }
}

export type BridgeControllerGetNftsQueryResult = NonNullable<Awaited<ReturnType<typeof bridgeControllerGetNfts>>>
export type BridgeControllerGetNftsQueryError = AxiosError<unknown>

export const useBridgeControllerGetNfts = <TData = Awaited<ReturnType<typeof bridgeControllerGetNfts>>, TError = AxiosError<unknown>>(
 deploymentId: string,
    withdrawing: string,
    address: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof bridgeControllerGetNfts>>, TError, TData>, axios?: AxiosRequestConfig}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getBridgeControllerGetNftsQueryOptions(deploymentId,withdrawing,address,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




