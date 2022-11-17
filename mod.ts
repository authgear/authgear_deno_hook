export type HookResponse = HookResponseAllowed | HookResponseDisallowed;

export interface HookResponseDisallowed {
  is_allowed: false;
  reason?: string;
  title?: string;
}

export interface HookResponseAllowed {
  is_allowed: true;
  mutations: Mutations;
}

export interface Mutations {
  user: UserMutations;
}

export interface UserMutations {
  standard_attributes: UserMutationsStandardAttributes;
  custom_attributes: UserMutationsCustomAttributes;
}

export type UserMutationsCustomAttributes = Record<string, unknown>;

// UserMutationsStandardAttributes is a subset of OIDC standard claims.
//
// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
export interface UserMutationsStandardAttributes {
  email?: string;
  phone_number?: string;
  preferred_username?: string;
  family_name?: string;
  given_name?: string;
  middle_name?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  profile?: string;
  website?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  address?: StandardAttributesAddress;
}

export interface StandardAttributesAddress {
  formatted?: string;
  street_address?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}

export interface HookEventBase {
  id: string;
  seq: number;
  context: HookEventContext;
}

export interface HookEventContext {
  // Unix timestamp of when the event was generated.
  timestamp: number;
  // The ID of the user associated with the event. It may be absent.
  user_id?: string;
  // Who triggered the event.
  triggered_by: TriggeredBy;
  // The user preferred languages as seen by Authgear.
  preferred_languages: string[];
  // The negotiated language by Authgear.
  language: string;
  // The client ID associated with the event. It may be absent.
  client_id?: string;
  // The IP address of the request that generated the event. It may be absent.
  ip_address?: string;
  // The HTTP User-Agent heaer of the request that generated the event. It may be absent.
  user_agent?: string;

  oauth?: OAuthContext;
}

export type TriggeredBy = "user" | "admin_api";

export interface OAuthContext {
  // The "state" parameter from the authentication request.
  state?: string;
}

export interface EntityBase {
  id: string;
  // RFC3339
  created_at: string;
  // RFC3339
  updated_at: string;
}

export interface User extends EntityBase {
  // RFC3339
  last_login_at?: string;
  is_anonymous: boolean;
  is_verified: boolean;
  is_disabled: boolean;
  disable_reason?: string;
  is_deactivated: boolean;
  // RFC3339
  delete_at?: string;
  can_reauthenticate: boolean;
  standard_attributes?: UserStandardAttributes;
  custom_attributes?: UserCustomAttributes;
  x_web3?: UserWeb3Info;
}

export interface UserStandardAttributes
  extends UserMutationsStandardAttributes {
  sub: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
  // Unix timestamp
  updated_at?: number;
}

export type UserCustomAttributes = Record<string, unknown>;

export interface UserWeb3Info {
  accounts: UserWeb3Account[];
}

export interface UserWeb3Account {
  account_identifier: Web3AccountIdentifier;
  network_identifier: Web3NetworkIdentifier;
  nfts: Web3NFT[];
}

export interface Web3AccountIdentifier {
  address: string;
}

export interface Web3NetworkIdentifier {
  blockchain: string;
  network: string;
}

export interface Web3NFT {
  contract: Web3NFTContract;
  tokens: Web3NFTToken[];
}

export interface Web3NFTContract {
  name: string;
  address: string;
}

export interface Web3NFTToken {
  token_id: string;
  transaction_identifier: Web3TransactionIdentifier;
  block_identifier: Web3BlockIdentifier;
  balance: string;
}

export interface Web3TransactionIdentifier {
  hash: string;
}

export interface Web3BlockIdentifier {
  index: number;
  // RFC3339
  timestamp: string;
}

export interface Identity extends EntityBase {
  type: IdentityType;
  claims: Record<string, unknown>;
}

export type IdentityType =
  | "login_id"
  | "oauth"
  | "anonymous"
  | "biometric"
  | "passkey"
  | "siwe";

export interface Session extends EntityBase {
  type: SessionType;
  amr?: string[];
  // RFC3339
  lastAccessedAt: string;
  createdByIP: string;
  lastAccessedByIP: string;
  lastAccessedByIPCountryCode: string;
  lastAccessedByIPEnglishCountryName: string;
  displayName: string;
  applicationName: string;
}

export type SessionType = "idp" | "offline_grant";

export interface EventUserPreCreate extends HookEventBase {
  type: "user.pre_create";
  payload: {
    user: User;
    identities: Identity[];
  };
}

export interface EventUserProfilePreUpdate extends HookEventBase {
  type: "user.profile.pre_update";
  payload: {
    user: User;
  };
}

export interface EventUserPreScheduleDeletion extends HookEventBase {
  type: "user.pre_schedule_deletion";
  payload: {
    user: User;
  };
}

export interface EventUserCreated extends HookEventBase {
  type: "user.created";
  payload: {
    user: User;
    identities: Identity[];
  };
}

export interface EventUserProfileUpdated extends HookEventBase {
  type: "user.profile.updated";
  payload: {
    user: User;
  };
}

export interface EventUserAuthenticated extends HookEventBase {
  type: "user.authenticated";
  payload: {
    user: User;
    session: Session;
  };
}

export interface EventUserSignedOut extends HookEventBase {
  type: "user.signed_out";
  payload: {
    user: User;
    session: Session;
  };
}

export interface EventUserAnonymousPromoted extends HookEventBase {
  type: "user.anonymous.promoted";
  payload: {
    anonymous_user: User;
    user: User;
    identities: Identity[];
  };
}

export interface EventUserDisabled extends HookEventBase {
  type: "user.disabled";
  payload: {
    user: User;
  };
}

export interface EventUserReenabled extends HookEventBase {
  type: "user.reenabled";
  payload: {
    user: User;
  };
}

export interface EventUserDeletionScheduled extends HookEventBase {
  type: "user.deletion_scheduled";
  payload: {
    user: User;
  };
}

export interface EventUserDeletionUnscheduled extends HookEventBase {
  type: "user.deletion_unscheduled";
  payload: {
    user: User;
  };
}

export interface EventUserDeleted extends HookEventBase {
  type: "user.deleted";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationIdentityLoginIDFailed
  extends HookEventBase {
  type: "authentication.identity.login_id.failed";
  payload: {
    login_id: string;
  };
}

export interface EventAuthenticationIdentityAnonymousFailed
  extends HookEventBase {
  type: "authentication.identity.anonymous.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationIdentityBiometricFailed
  extends HookEventBase {
  type: "authentication.identity.biometric.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationPrimaryPasswordFailed
  extends HookEventBase {
  type: "authentication.primary.password.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationPrimaryOOBOTPEmailFailed
  extends HookEventBase {
  type: "authentication.primary.oob_otp_email.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationPrimaryOOBOTPSMSFailed
  extends HookEventBase {
  type: "authentication.primary.oob_otp_sms.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationSecondaryPasswordFailed
  extends HookEventBase {
  type: "authentication.secondary.password.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationSecondaryTOTPFailed extends HookEventBase {
  type: "authentication.secondary.totp.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationSecondaryOOBOTPEmailFailed
  extends HookEventBase {
  type: "authentication.secondary.oob_otp_email.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationSecondaryOOBOTPSMSFailed
  extends HookEventBase {
  type: "authentication.secondary.oob_otp_sms.failed";
  payload: {
    user: User;
  };
}

export interface EventAuthenticationSecondaryRecoveryCodeFailed
  extends HookEventBase {
  type: "authentication.secondary.recovery_code.failed";
  payload: {
    user: User;
  };
}

export interface EventIdentityEmailAdded extends HookEventBase {
  type: "identity.email.added";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityEmailRemoved extends HookEventBase {
  type: "identity.email.removed";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityEmailUpdated extends HookEventBase {
  type: "identity.email.updated";
  payload: {
    user: User;
    old_identity: Identity;
    new_identity: Identity;
  };
}

export interface EventIdentityPhoneAdded extends HookEventBase {
  type: "identity.phone.added";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityPhoneRemoved extends HookEventBase {
  type: "identity.phone.removed";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityPhoneUpdated extends HookEventBase {
  type: "identity.phone.updated";
  payload: {
    user: User;
    old_identity: Identity;
    new_identity: Identity;
  };
}

export interface EventIdentityUsernameAdded extends HookEventBase {
  type: "identity.username.added";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityUsernameRemoved extends HookEventBase {
  type: "identity.username.removed";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityUsernameUpdated extends HookEventBase {
  type: "identity.username.updated";
  payload: {
    user: User;
    old_identity: Identity;
    new_identity: Identity;
  };
}

export interface EventIdentityOAuthConnected extends HookEventBase {
  type: "identity.oauth.connected";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityOAuthDisconnected extends HookEventBase {
  type: "identity.oauth.disconnected";
  payload: {
    user: User;
    identity: Identity;
  };
}

export type HookEvent =
  | EventUserPreCreate
  | EventUserProfilePreUpdate
  | EventUserPreScheduleDeletion
  | EventUserCreated
  | EventUserProfileUpdated
  | EventUserAuthenticated
  | EventUserSignedOut
  | EventUserAnonymousPromoted
  | EventUserDisabled
  | EventUserReenabled
  | EventUserDeletionScheduled
  | EventUserDeletionUnscheduled
  | EventUserDeleted
  | EventAuthenticationIdentityLoginIDFailed
  | EventAuthenticationIdentityAnonymousFailed
  | EventAuthenticationIdentityBiometricFailed
  | EventAuthenticationPrimaryPasswordFailed
  | EventAuthenticationPrimaryOOBOTPEmailFailed
  | EventAuthenticationPrimaryOOBOTPSMSFailed
  | EventAuthenticationSecondaryPasswordFailed
  | EventAuthenticationSecondaryTOTPFailed
  | EventAuthenticationSecondaryOOBOTPEmailFailed
  | EventAuthenticationSecondaryOOBOTPSMSFailed
  | EventAuthenticationSecondaryRecoveryCodeFailed
  | EventIdentityEmailAdded
  | EventIdentityEmailRemoved
  | EventIdentityEmailUpdated
  | EventIdentityPhoneAdded
  | EventIdentityPhoneRemoved
  | EventIdentityPhoneUpdated
  | EventIdentityUsernameAdded
  | EventIdentityUsernameRemoved
  | EventIdentityUsernameUpdated
  | EventIdentityOAuthConnected
  | EventIdentityOAuthDisconnected;
