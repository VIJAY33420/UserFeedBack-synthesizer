import { useMutation } from '@tanstack/react-query';
import { api } from '../api/endpoints';

export const useSummary = () => {
  return useMutation({
    mutationFn: api.summary.generate,
  });
};
