const API_BASE = '/api/v1'

export const routes = {
  login: () => `${API_BASE}/login`,
  signup: () => `${API_BASE}/signup`,
  channels: () => `${API_BASE}/channels`,
  channelById: id => `${API_BASE}/channels/${id}`,
  messages: () => `${API_BASE}/messages`,
  homePage: () => '/',
  loginPage: () => '/login',
  signupPage: () => '/signup',
}
