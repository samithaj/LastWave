import Vue from 'vue';
import Vuex from 'vuex';
import LoadingStage from '@/models/LoadingStage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rendererOptions: {},
    dataSourceOptions: {},

    // Used for loading bars
    isCreatingWave: false,
    currentStage: -1,
    stages: [],
  },
  mutations: {
    clearOptions(state) {
      state.rendererOptions = {};
      state.dataSourceOptions = {};
    },
    updateRendererOption(state: any, payload: any) {
      state.rendererOptions[payload.alias] = payload.value;
    },
    updateDataSourceOption(state: any, payload:any) {
      state.dataSourceOptions[payload.alias] = payload.value;
    },
    setStages(state: any, stages: LoadingStage[]) {
      state.stages = stages;
      state.currentStage = -1;
    },
    startNextStage(state:any, segmentCount: number) {
      state.currentStage++;

      let currentStage: LoadingStage = state.stages[state.currentStage];
      currentStage.currentSegment = 0;
      currentStage.stageSegments = segmentCount;
    },
    progressCurrentStage(state: any) {
      let currentStage: LoadingStage = state.stages[state.currentStage];
      currentStage.currentSegment++;
    },
  },
  actions: {
  },
});
