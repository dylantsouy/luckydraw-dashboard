import useSWR from 'swr';
import { swrFetcher } from 'apis/apiSetup';

const useAdminList = () => {
    const { data, error, mutate, isValidating } = useSWR(['/admins', {}, true], swrFetcher);

    return {
        data: data?.data,
        isLoading: isValidating,
        isError: error,
        mutate,
    };
};

export default useAdminList;
