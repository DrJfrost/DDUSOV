
// State object
const state = {
	results: null,
}

// Getter functions
const getters = {
	getResults(state) {
		return state.results;
	},
}

// Actions 
const actions = {
	search({ commit }, query) {
		return new Promise((resolve, reject) => {
			const axios = require('axios');
			
			axios.get('https://random-data-api.com/api/stripe/random_stripe').then(resultsObj => {
				console.log(resultsObj)
				commit('SET_RESULTS', resultsObj);
				resolve();
			})
		});
	}
}

// Mutations
const mutations = {
	SET_RESULTS(state, data) {
		state.results = data;
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}