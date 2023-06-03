import useSWR from 'swr';
import { swrFetcher } from 'apis/apiSetup';

const useSetting = () => {
    const { data, error, mutate, isValidating } = useSWR(['/rewards', {}, true], swrFetcher);

    return {
        data: data?.data,
        isLoading: isValidating,
        isError: error,
        mutate,
    };
};

export default useSetting;
