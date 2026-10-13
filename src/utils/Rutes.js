// FXE sync service. Set VITE_FXE_BASE_URL (https) in .env; no default host is shipped.
export const FXE_BASE_URL = import.meta.env.VITE_FXE_BASE_URL || '';

// Public link rutes
export const RUTE_GET_PUBLIC_LINK = 'publicLink';

export const RUTE_GET_PUBLIC_LINK_SINGLE = 'publicLink/single/';

export const RUTE_PUBLIC_LINK_EDIT = 'publicLink/edit';

export const RUTE_PUBLIC_LINK_ACTIVATE = 'publicLink/activate';

export const RUTE_UPDLOAD_BROKER_LOGO = 'brokers/upload-logo';

export const RUTE_SINGLE_ACCOUNT_METRICS = 'account/metrics';

const RUTE_CREATE_ACCOUNTFXE = 'account/createFXE';

export const RUTE_GET_TRADES = 'account/getTradesHistory';

export const RUTE_GET_BROKER_BY_NAME = 'brokers/servers/findByName';

const RUTE_CREATE_BROKER = '/broker/servers/create';

export const RUTE_USER_REGISTER = 'auth/register';

export const RUTE_VERIFY_PHONE = 'auth/verify-phone';

export const RUTE_POST_SURVEY = 'survey';

export const RUTE_USER_GOOGLE = 'auth/google-login';

export const RUTE_USER_DATA = 'user';

export const RUTE_USER_EDIT = 'user/edit';

export const RUTE_USER_LOGIN = 'auth/login';

const RUTE_ADD_ACCOUNT = 'account/';

export const RUTE_DELETE_ACCOUNT = 'account/delete';

export const RUTE_GET_ALL_ACCOUNTS_BY_USER = 'account/user/all';

export const RUTE_CREATE_ACCOUNT = 'account/create';

export const RUTE_CONNECT_ACCOUNT = 'account/connect';

export const RUTE_SYNC_FXE_ACCOUNT = 'account/updateFXE';

export const RUTE_CREATE_SLT_PLAN = 'slt/create';

export const RUTE_GET_WITHDRAWAL_PLAN = 'slt/getWithdrawal';

export const RUTE_GET_SLT_PLAN = 'slt/';

export const RUTE_DELETE_SLT_PLAN = 'slt/delete';

export const RUTE_CREATE_WITHDRAWAL_PLAN = 'slt/withdrawal';

export const RUTE_POST_EMOTIONAL = 'emotional/create/';

// Articles of the brokers
export const RUTE_GET_ARTICLES_PERBROKER = 'articles/perBroker/';

export const RUTE_GET_POSTS_PER_BROKER = 'posts/perBroker/';

export const RUTE_GET_REVIEWS_PER_BROKER = 'reviews/perBroker/';

// Slack ----------------------------
export const RUTE_SLACK_BROKER_TICKET = 'slack/createBrokerTicket';
export const RUTE_SLACK_CONTACT_US = 'slack/contactUs';
export const RUTE_SLACK_JOB_APPLICATION = 'slack/jobs';
export const RUTE_ERRORS_SLACKFXE = 'slack/errors/fxe';
const RUTE_SLACK_WANNA_WORK_WITH_US = 'slack/wannaWorkWithUs';

export const RUTE_GET_FEEDBACK_LIST = 'emotional/feedback-list/';
