
// State object
const state = {
	results: null,
	nextPageUrl: null,
	currentPageUrl: null,
	previousPageUrls: [],
}

// Getter functions
const getters = {
	getResults(state) {
		return state.results;
	},
	getNextPageUrl(state) {
		return state.nextPageUrl;
	},
	getPreviousPageUrls(state) {
		return state.previousPageUrls;
	}
}

// Actions 
const actions = {
	search({ commit }, payload) {
		let query = payload.query;
		let pageSize = payload.pageSize

		let url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}&format=json&pageSize=${pageSize}`
		return new Promise((resolve, reject) => {
			const axios = require('axios');
			axios.get(url).then(resultsObj => {
				commit('SET_RESULTS', resultsObj);
				commit('SET_NEXT_PAGE_URL', resultsObj.data.nextPageUrl);
				commit('SET_CURRENT_PAGE_URL', url);
				commit('RESET_PREVIOUS_PAGE_URL');
				resolve();
			})
		});
	},
	nextPage({ commit }, payload) {
		return new Promise((resolve, reject) => {
			const axios = require('axios');
			axios.get(state.nextPageUrl).then(resultsObj => {
				commit('SET_RESULTS', resultsObj);
				commit('SET_PREVIOUS_PAGE_URL', state.currentPageUrl);
				commit('SET_CURRENT_PAGE_URL', state.nextPageUrl)
				commit('SET_NEXT_PAGE_URL', resultsObj.data.nextPageUrl);
				resolve();
			})
		});
	},
	previousPage({ commit }, payload) {
		let last = state.previousPageUrls.length-1;
		return new Promise((resolve, reject) => {
			const axios = require('axios');	
			axios.get(state.previousPageUrls[last]).then(resultsObj => {
				commit('SET_RESULTS', resultsObj);
				commit('SET_CURRENT_PAGE_URL', state.previousPageUrls[last])
				commit('SET_NEXT_PAGE_URL', resultsObj.data.nextPageUrl);
				commit('SET_PREVIOUS_PAGE_URL');

				console.log(state.nextPageUrl);
				console.log(state.currentPageUrl);
				console.log(state.previousPageUrls);
				resolve();
			})
		});
	},
}

// Mutations
const mutations = {
	SET_RESULTS(state, data) {
		state.results = data;
	},
	SET_NEXT_PAGE_URL(state, data){
		state.nextPageUrl = data;
	},
	SET_CURRENT_PAGE_URL(state, data){
		state.currentPageUrl = data;
	},
	SET_PREVIOUS_PAGE_URL(state, data){
		if (!data && state.previousPageUrls.length > 0){
			state.previousPageUrls.pop();
		} else if(data) {
			state.previousPageUrls.push(data)
		}
	},
	RESET_PREVIOUS_PAGE_URL(state, data){
		state.previousPageUrls = []
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}