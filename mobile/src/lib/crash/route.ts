/** The screen the user is on, so a report says where it happened (set from the root layout) */
let route = '/';

export const setCurrentRoute = (path: string) => {
  route = path;
};

export const currentRoute = () => route;
