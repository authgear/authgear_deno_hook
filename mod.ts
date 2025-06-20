export interface HookResponseDisallowed {
  is_allowed: false;
  reason?: string;
  title?: string;
}

export interface HookResponseAllowed {
  is_allowed: true;
  mutations?: Mutations;
  constraints?: Constraints;
  bot_protection?: BotProtectionRequirements;
}

export type Mutations = MutationsOnUser | MutationsOnJWT;

export interface Constraints {
  amr: AMRConstraint[];
}

export interface BotProtectionRequirements {
  mode: BotProtectionRiskMode;
}

export type AMR =
  | "pwd"
  | "otp"
  | "sms"
  | "mfa"
  | "x_biometric"
  | "x_passkey"
  | "x_primary_password"
  | "x_primary_oob_otp_email"
  | "x_primary_oob_otp_sms"
  | "x_primary_passkey"
  | "x_secondary_password"
  | "x_secondary_oob_otp_email"
  | "x_secondary_oob_otp_sms"
  | "x_secondary_totp"
  | "x_recovery_code"
  | "x_device_token";

export type AMRConstraint = Extract<
  AMR,
  | "mfa"
  | "otp"
  | "pwd"
  | "sms"
  | "x_primary_oob_otp_email"
  | "x_primary_oob_otp_sms"
  | "x_primary_password"
  | "x_recovery_code"
  | "x_secondary_oob_otp_email"
  | "x_secondary_oob_otp_sms"
  | "x_secondary_password"
  | "x_secondary_totp"
>;

export type BotProtectionRiskMode = "never" | "always";

export interface MutationsOnUser {
  user: UserMutations;
}

export interface MutationsOnJWT {
  jwt: JWTMutations;
}

export interface JWTMutations {
  payload: JWTPayloadMutations;
}

export type JWTPayloadMutations = Record<string, unknown>;

export interface UserMutations {
  standard_attributes?: UserMutationsStandardAttributes;
  custom_attributes?: UserMutationsCustomAttributes;
  groups?: string[];
  roles?: string[];
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
  // The ISO 3166-1 alpha-2 code of the location derived from the ip address. `null` if the location cannot be determined by the ip address.
  geo_location_code: string | null;
  // The HTTP User-Agent heaer of the request that generated the event. It may be absent.
  user_agent?: string;

  oauth?: OAuthContext;
}

export type TriggeredBy = "user" | "admin_api" | "system" | "portal";

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

export interface JWT {
  payload: JWTPayload;
}

export type JWTPayload = Record<string, unknown>;

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
  groups?: string[];
  roles?: string[];
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

export interface Authenticator extends EntityBase {
  user_id: string;
  type: "password" | "passkey" | "totp" | "oob_otp_email" | "oob_otp_sms";
  is_default: boolean;
  kind: "primary" | "secondary";
}

export type IdentityType =
  | "login_id"
  | "oauth"
  | "anonymous"
  | "biometric"
  | "passkey"
  | "siwe";

export type LoginIDType = "email" | "phone" | "username";

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

export interface AuthenticationFlow {
  type:
    | "signup"
    | "promote"
    | "login"
    | "signup_login"
    | "reauth"
    | "account_recovery";
  name: string;
}

export interface Authentication {
  authentication:
    | "primary_password"
    | "primary_passkey"
    | "primary_oob_otp_email"
    | "primary_oob_otp_sms"
    | "secondary_password"
    | "secondary_totp"
    | "secondary_oob_otp_email"
    | "secondary_oob_otp_sms"
    | "recovery_code"
    | "device_token";
  authenticator: Authenticator | null; // Non-null if authentication is primary_password, primary_passkey, primary_oob_otp_email, primary_oob_otp_sms, secondary_password, secondary_totp, secondary_oob_otp_email, or secondary_oob_otp_sms.
}

export interface Identification {
  identification:
    | "email"
    | "phone"
    | "username"
    | "oauth"
    | "passkey"
    | "id_token"
    | "ldap";
  identity: Identity | null; // Non-null if identification is email, phone, username, oauth, passkey, or ldap.
  id_token: string | null; // Non-null if identification is id_token
}

export interface AuthenticationContext {
  user: User | null; // null if user is not known
  asserted_authentications: Authentication[];
  asserted_identifications: Identification[];
  amr: AMR[];
  authentication_flow: AuthenticationFlow | null; // null if the event is not triggered from authenfication flow
}

export interface EventUserPreCreate extends HookEventBase {
  type: "user.pre_create";
  payload: {
    user: User;
    identities: Identity[];
  };
}

export type EventUserPreCreateHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "mutations">;

export interface EventUserProfilePreUpdate extends HookEventBase {
  type: "user.profile.pre_update";
  payload: {
    user: User;
  };
}

export type EventUserProfilePreUpdateHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "mutations">;

export interface EventUserPreScheduleDeletion extends HookEventBase {
  type: "user.pre_schedule_deletion";
  payload: {
    user: User;
  };
}

export type EventUserPreScheduleDeletionHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "mutations">;

export interface EventUserPreScheduleAnonymization extends HookEventBase {
  type: "user.pre_schedule_anonymization";
  payload: {
    user: User;
  };
}

export type EventUserPreScheduleAnonymizationHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "mutations">;

export interface EventOIDCJWTPreCreate extends HookEventBase {
  type: "oidc.jwt.pre_create";
  payload: {
    user: User;
    identities: Identity[];
    jwt: JWT;
  };
}

export type EventOIDCJWTPreCreateHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "mutations">;

export interface EventAuthenticationPreInitialize extends HookEventBase {
  type: "authentication.pre_initialize";
  payload: {
    authentication_context: AuthenticationContext;
  };
}

export type EventAuthenticationPreInitializeHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "bot_protection" | "constraints">;

export interface EventAuthenticationPostIdentified extends HookEventBase {
  type: "authentication.post_identified";
  payload: {
    authentication_context: AuthenticationContext;
    identification: Identification;
  };
}

export type EventAuthenticationPostIdentifiedHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "bot_protection" | "constraints">;

export interface EventAuthenticationPreAuthenticated extends HookEventBase {
  type: "authentication.pre_authenticated";
  payload: {
    authentication_context: AuthenticationContext;
  };
}

export type EventAuthenticationPreAuthenticatedHookResponse =
  | HookResponseDisallowed
  | Pick<HookResponseAllowed, "is_allowed" | "constraints">;

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

export interface EventUserAnonymizationScheduled extends HookEventBase {
  type: "user.anonymization_scheduled";
  payload: {
    user: User;
  };
}

export interface EventUserAnonymizationUnscheduled extends HookEventBase {
  type: "user.anonymization_unscheduled";
  payload: {
    user: User;
  };
}

export interface EventUserAnonymized extends HookEventBase {
  type: "user.anonymized";
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

export interface EventIdentityEmailVerified extends HookEventBase {
  type: "identity.email.verified";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityPhoneVerified extends HookEventBase {
  type: "identity.phone.verified";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityEmailUnverified extends HookEventBase {
  type: "identity.email.unverified";
  payload: {
    user: User;
    identity: Identity;
  };
}

export interface EventIdentityPhoneUnverified extends HookEventBase {
  type: "identity.phone.unverified";
  payload: {
    user: User;
    identity: Identity;
  };
}

export type HookEvent =
  | EventUserPreCreate
  | EventUserProfilePreUpdate
  | EventUserPreScheduleDeletion
  | EventUserPreScheduleAnonymization
  | EventOIDCJWTPreCreate
  | EventUserCreated
  | EventUserProfileUpdated
  | EventUserAuthenticated
  | EventUserAnonymousPromoted
  | EventUserDisabled
  | EventUserReenabled
  | EventUserDeletionScheduled
  | EventUserDeletionUnscheduled
  | EventUserDeleted
  | EventUserAnonymizationScheduled
  | EventUserAnonymizationUnscheduled
  | EventUserAnonymized
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
  | EventIdentityOAuthDisconnected
  | EventIdentityEmailVerified
  | EventIdentityPhoneVerified
  | EventIdentityEmailUnverified
  | EventIdentityPhoneUnverified;

export interface CustomSMSGatewayPayload {
  to: string;
  body: string;
}

export interface CustomSMSGatewayResponse {
  code:
    | "ok" // Return this code if the sms is delivered successfully
    | "invalid_phone_number" // Return this code if the phone number is invalid
    | "rate_limited" // Return this code if some rate limit is reached and the user should retry the request
    | "authentication_failed" // Return this code if some authentication is failed, and the developer should check the current configurations.
    | "delivery_rejected"; // Return this code if the sms delivery service rejected the request for any reason the user cannot fix by retrying.
  provider_error_code?: string; // Error code that could appear on portal to assist debugging. For example, you may put the error code returned by twilio here.
}

// Account migration
export interface AccountMigrationRequest {
  migration_token: string;
}

export interface AccountMigrationResponse {
  identities?: IdentityMigrateSpec[];
  authenticators?: AuthenticatorMigrateSpec[];
}

type IdentityMigrateSpec = IdentityLoginIDMigrateSpec;

interface IdentityLoginIDMigrateSpec {
  type: "login_id";
  login_id: {
    key: string;
    type: LoginIDType;
    value: string;
  };
}

type AuthenticatorMigrateSpec =
  | AuthenticatorOOBOTPEmailMigrateSpec
  | AuthenticatorOOBOTPSMSMigrateSpec;

interface AuthenticatorOOBOTPEmailMigrateSpec {
  type: "oob_otp_email";
  oobotp: {
    email: string;
  };
}

interface AuthenticatorOOBOTPSMSMigrateSpec {
  type: "oob_otp_sms";
  oobotp: {
    phone: string;
  };
}
