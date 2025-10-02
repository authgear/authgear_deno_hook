import {
  EventAuthenticationPostIdentified,
  EventAuthenticationPostIdentifiedHookResponse,
  EventAuthenticationPreAuthenticated,
  EventAuthenticationPreAuthenticatedHookResponse,
  EventAuthenticationPreInitialize,
  EventAuthenticationPreInitializeHookResponse,
  EventOIDCIDTokenPreCreate,
  EventOIDCIDTokenPreCreateHookResponse,
  EventOIDCJWTPreCreate,
  EventOIDCJWTPreCreateHookResponse,
  EventUserPreCreate,
  EventUserPreCreateHookResponse,
  EventUserPreScheduleAnonymization,
  EventUserPreScheduleAnonymizationHookResponse,
  EventUserPreScheduleDeletion,
  EventUserPreScheduleDeletionHookResponse,
  EventUserProfilePreUpdate,
  EventUserProfilePreUpdateHookResponse,
  HookBlockingEvent,
  HookResponse,
} from "../mod.ts";

async function hook(e: HookBlockingEvent): Promise<HookResponse> {
  switch (e.type) {
    case "authentication.pre_initialize":
      return authentication_pre_initialize(e);
    case "authentication.post_identified":
      return authentication_post_identified(e);
    case "authentication.pre_authenticated":
      return authentication_pre_authenticated(e);
    case "user.pre_create":
      return user_pre_create(e);
    case "user.profile.pre_update":
      return user_profile_pre_update(e);
    case "user.pre_schedule_deletion":
      return user_pre_schedule_deletion(e);
    case "user.pre_schedule_anonymization":
      return user_pre_schedule_anonymization(e);
    case "oidc.jwt.pre_create":
      return oidc_jwt_pre_create(e);
    case "oidc.id_token.pre_create":
      return oidc_id_token_pre_create(e);
    default:
      return {
        is_allowed: false,
      };
  }
}

async function authentication_pre_initialize(
  _e: EventAuthenticationPreInitialize,
): Promise<EventAuthenticationPreInitializeHookResponse> {
  return {
    is_allowed: true,
    bot_protection: {
      mode: "always",
    },
    constraints: {
      amr: ["mfa", "pwd", "sms"],
    },
    rate_limits: {
      "authentication.account_enumeration": {
        weight: 1,
      },
      "authentication.general": {
        weight: 1,
      },
    },
  };
}

async function authentication_post_identified(
  _e: EventAuthenticationPostIdentified,
): Promise<EventAuthenticationPostIdentifiedHookResponse> {
  return {
    is_allowed: true,
    bot_protection: {
      mode: "never",
    },
    constraints: {
      amr: ["x_primary_password", "x_secondary_totp"],
    },
    rate_limits: {
      "authentication.account_enumeration": {
        weight: 1,
      },
      "authentication.general": {
        weight: 1,
      },
    },
  };
}

async function authentication_pre_authenticated(
  _e: EventAuthenticationPreAuthenticated,
): Promise<EventAuthenticationPreAuthenticatedHookResponse> {
  return {
    is_allowed: true,
    constraints: {
      amr: ["x_recovery_code", "x_secondary_oob_otp_email"],
    },
    rate_limits: {
      "authentication.account_enumeration": {
        weight: 1,
      },
      "authentication.general": {
        weight: 1,
      },
    },
  };
}

async function user_pre_create(
  _e: EventUserPreCreate,
): Promise<EventUserPreCreateHookResponse> {
  return {
    is_allowed: true,
    mutations: {
      user: {
        standard_attributes: {
          email: "test@example.com",
          phone_number: "+1234567890",
          preferred_username: "testuser",
          family_name: "Doe",
          given_name: "John",
          middle_name: "Q",
          name: "John Q. Doe",
          nickname: "JQ",
          picture: "https://example.com/avatar.jpg",
          profile: "https://example.com/profile",
          website: "https://johndoe.com",
          gender: "male",
          birthdate: "1990-01-01",
          zoneinfo: "America/New_York",
          locale: "en-US",
          address: {
            formatted: "123 Main St\nNew York, NY 10001\nUSA",
            street_address: "123 Main St",
            locality: "New York",
            region: "NY",
            postal_code: "10001",
            country: "USA",
          },
        },
        custom_attributes: {
          department: "Engineering",
          employee_id: "EMP123",
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
        groups: ["users", "developers", "admins"],
        roles: ["editor", "reviewer", "maintainer"],
      },
    },
  };
}

async function user_profile_pre_update(
  _e: EventUserProfilePreUpdate,
): Promise<EventUserProfilePreUpdateHookResponse> {
  return {
    is_allowed: true,
    mutations: {
      user: {
        standard_attributes: {
          name: "Updated Name",
          nickname: "NewNick",
          picture: "https://example.com/new-avatar.jpg",
        },
        custom_attributes: {
          last_updated: "2025-06-23T10:30:00Z",
          update_count: 42,
        },
        groups: ["premium_users"],
        roles: ["power_user"],
      },
    },
  };
}

async function user_pre_schedule_deletion(
  _e: EventUserPreScheduleDeletion,
): Promise<EventUserPreScheduleDeletionHookResponse> {
  return {
    is_allowed: true,
    mutations: {
      user: {
        custom_attributes: {
          deletion_reason: "User requested account deletion",
          deletion_timestamp: "2025-06-23T10:30:00Z",
          backup_created: true,
        },
      },
    },
  };
}

async function user_pre_schedule_anonymization(
  _e: EventUserPreScheduleAnonymization,
): Promise<EventUserPreScheduleAnonymizationHookResponse> {
  return {
    is_allowed: true,
    mutations: {
      user: {
        custom_attributes: {
          anonymization_reason: "GDPR compliance",
          anonymization_timestamp: "2025-06-23T10:30:00Z",
          data_retention_period: "30 days",
        },
      },
    },
  };
}

async function oidc_jwt_pre_create(
  _e: EventOIDCJWTPreCreate,
): Promise<EventOIDCJWTPreCreateHookResponse> {
  return {
    is_allowed: true,
    mutations: {
      jwt: {
        payload: {
          custom_claim: "custom_value",
          department: "Engineering",
          permissions: ["read", "write", "admin"],
          metadata: {
            created_at: "2025-06-23T10:30:00Z",
            version: "1.0",
            source: "authgear_hook",
          },
          nested_object: {
            level1: {
              level2: {
                deeply_nested: "value",
                array_data: [1, 2, 3, "mixed", true],
              },
            },
          },
        },
      },
    },
  };
}

async function oidc_id_token_pre_create(
  _e: EventOIDCIDTokenPreCreate,
): Promise<EventOIDCIDTokenPreCreateHookResponse> {
  return {
    is_allowed: true,
    mutations: {
      id_token: {
        payload: {
          custom_claim: "custom_value",
          department: "Engineering",
          permissions: ["read", "write", "admin"],
          metadata: {
            created_at: "2025-06-23T10:30:00Z",
            version: "1.0",
            source: "authgear_hook",
          },
          nested_object: {
            level1: {
              level2: {
                deeply_nested: "value",
                array_data: [1, 2, 3, "mixed", true],
              },
            },
          },
        },
      },
    },
  };
}
