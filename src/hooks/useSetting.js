import useSWR from 'swr';
import { loadingHandler, swrFetcher } from 'apis/apiSetup';

const useRewardList = () => {
    const { data, error, mutate } = useSWR(['/settings', {}, true], swrFetcher);

    return {
        data: data?.data,
        isLoading: loadingHandler(data, error),
        isError: error,
        mutate,
    };
};

export default useRewardList;
