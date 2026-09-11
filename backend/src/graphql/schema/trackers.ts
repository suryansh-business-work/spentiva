export const trackerTypeDefs = /* GraphQL */ `
  "What a tracker is for; picks its starting categories and payment modes"
  enum TrackerKind {
    PERSONAL
    BUSINESS
  }

  "OWNER manages the tracker and who it's shared with, EDITOR adds entries, VIEWER only reads"
  enum TrackerRole {
    OWNER
    EDITOR
    VIEWER
  }

  type TrackerMember {
    user: UserSummary!
    role: TrackerRole!
    addedAt: DateTime!
  }

  "A separate book of expenses (e.g. Home, Business) that can be shared with other users"
  type Tracker {
    id: ID!
    name: String!
    kind: TrackerKind!
    "ISO 4217 currency every total in this tracker is shown in"
    currency: String!
    monthlyBudget: Float
    "Your role in this tracker"
    role: TrackerRole!
    "Your first tracker, used when a request doesn't name one"
    isDefault: Boolean!
    owner: UserSummary!
    "The owner first, then everyone it is shared with"
    members: [TrackerMember!]!
    createdAt: DateTime!
  }

  input TrackerInput {
    name: String!
    kind: TrackerKind!
    "ISO 4217"
    currency: String!
    monthlyBudget: Float
  }

  input TrackerUpdateInput {
    name: String
    kind: TrackerKind
    "A new currency re-expresses every entry with today's rates"
    currency: String
    "null clears the budget (tracks against income)"
    monthlyBudget: Float
  }

  enum ReportFrequency {
    "Every morning, for the day before"
    DAILY
    "On the 1st, for the month before"
    MONTHLY
    "On 1 Jan / Apr / Jul / Oct, for the quarter before"
    QUARTERLY
    "On 1 January, for the year before"
    YEARLY
  }

  "An email report you receive for a tracker"
  type EmailReportSchedule {
    frequency: ReportFrequency!
    nextRunAt: DateTime!
    lastSentAt: DateTime
    lastError: String
  }

  extend type Query {
    "Trackers you own, then the ones shared with you"
    trackers: [Tracker!]!
    "Your email reports for a tracker (only the ones turned on)"
    emailReports(trackerId: ID): [EmailReportSchedule!]!
  }

  extend type Mutation {
    createTracker(input: TrackerInput!): Tracker!
    "Owner only"
    updateTracker(id: ID!, input: TrackerUpdateInput!): Tracker!
    "Owner only; deletes every entry, category and payment mode in it"
    deleteTracker(id: ID!): Boolean!
    "Owner only; shares with an existing account (sharing again changes the role). Role is EDITOR or VIEWER."
    shareTracker(id: ID!, email: String!, role: TrackerRole!): Tracker!
    setTrackerMemberRole(id: ID!, userId: ID!, role: TrackerRole!): Tracker!
    removeTrackerMember(id: ID!, userId: ID!): Tracker!
    "Stop having access to a tracker shared with you"
    leaveTracker(id: ID!): Boolean!

    "Turns on exactly these email reports for the tracker (others are turned off)"
    setEmailReports(trackerId: ID, frequencies: [ReportFrequency!]!): [EmailReportSchedule!]!
    "Emails you the tracker's report for a period right away; returns the address"
    sendReportEmail(trackerId: ID, period: Period!): String!
  }
`;
