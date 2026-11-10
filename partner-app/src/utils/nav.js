// Tab screens ko kisi bhi stack screen se kholne ke liye helper
export const TAB_SCREENS = ['Dashboard', 'Products', 'Orders', 'Payments', 'More'];

export function goTo(navigation, name, params) {
  if (TAB_SCREENS.includes(name)) navigation.navigate('Tabs', { screen: name, params });
  else navigation.navigate(name, params);
}
