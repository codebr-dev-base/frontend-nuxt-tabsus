export default function({ $axios, app }) {
  $axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      const code = parseInt(error.response && error.response.status);

      if ([401, 403].includes(code)) {
        app.$auth.logout();
        app.$auth.strategy.token.reset();
      }

      return Promise.reject(error);
    }
  );
}
