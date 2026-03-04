import { generateAlias } from "../../shared/time";

const CLIENT_ID_KEY = "offwork-stats-client-id";
const ALIAS_KEY = "offwork-stats-alias";

function createClientId(): string {
  return crypto.randomUUID();
}

export function getClientId(): string {
  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) {
    return existing;
  }

  const clientId = createClientId();
  window.localStorage.setItem(CLIENT_ID_KEY, clientId);
  return clientId;
}

export function getAliasCode(): string {
  const existing = window.localStorage.getItem(ALIAS_KEY);
  if (existing) {
    return existing;
  }

  const alias = generateAlias(getClientId());
  window.localStorage.setItem(ALIAS_KEY, alias);
  return alias;
}
