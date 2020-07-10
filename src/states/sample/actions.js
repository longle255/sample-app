import { action } from 'typesafe-actions';
import { sampleService } from 'services';

export const SampleActions = {
  SAMPLE_ACTION: '[SAMPLE] ACTION',
  IS_LOADING_SAMPLE: '[SAMPLE] IS_LOADING_SAMPLE',

  ACTION_SUCCEED: '[SAMPLE] ACTION_SUCCEED',
  ACTION_FAILED: '[SAMPLE] ACTION_FAILED',
};

/* #region get pools */
export const getSamplesAction = model => {
  return async (dispatch, getState) => {
    dispatch(isLoadingSamplesAction(model));
    try {
      const result = await sampleService.getSamples(model);
      const data = {
        ...model,
        pagination: {
          ...model.pagination,
          total: result.total,
        },
        data: result.data,
      };

      dispatch(getSamplesSuccessAction(data));
    } catch (error) {
      dispatch(getSamplesFailureAction(error));
    }
  };
};

export const isLoadingSamplesAction = data => {
  return action(SampleActions.IS_LOADING_SAMPLE, data);
};

export const getSamplesSuccessAction = data => {
  return action(SampleActions.ACTION_SUCCEED, data, SampleActions.SAMPLE_ACTION);
};

export const getSamplesFailureAction = error => {
  return action(SampleActions.ACTION_FAILED, error, SampleActions.SAMPLE_ACTION);
};
/* #endregion */
