import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/endpoints';

export const useFeedbackList = () => {
  return useQuery({
    queryKey: ['feedback', 'list'],
    queryFn: api.feedback.getAll,
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.feedback.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
};

export const useShortlist = () => {
  return useQuery({
    queryKey: ['feedback', 'shortlist'],
    queryFn: api.feedback.getShortlist,
  });
};

export const useClusters = () => {
  return useQuery({
    queryKey: ['feedback', 'clusters'],
    queryFn: api.feedback.getClusters,
  });
};

export const useTrend = () => {
  return useQuery({
    queryKey: ['feedback', 'trend'],
    queryFn: api.feedback.getTrend,
  });
};
