interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize(options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GoogleWindowObject {
  accounts: GoogleAccounts;
}

interface Window {
  google?: GoogleWindowObject;
}
