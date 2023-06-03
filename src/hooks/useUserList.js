import useSWR from 'swr';
import { swrFetcher } from 'apis/apiSetup';

const useUserList = () => {
    const { data, error, mutate, isValidating } = useSWR(['/users', {}, true], swrFetcher);

    return {
        data: data?.data,
        isLoading: isValidating,
        isError: error,
        mutate,
    };
};

export default useUserList;
