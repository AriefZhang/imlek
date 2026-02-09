export enum GroupOfActionEnum {
  ACCOUNT_SETTINGS = 'Account Settings',
  LISTING_MANAGEMENT = 'Listing Management',
  GUEST_MANAGEMENT = 'Guest Management',
}

export type GroupOfActionResponse = {
  group_of_action: string;
};
