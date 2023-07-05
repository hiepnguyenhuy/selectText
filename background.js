// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'editButton',
//     title: 'Edit',
//     contexts: ['selection']
//   });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'editButton') {
//     chrome.tabs.sendMessage(tab.id, { type: 'showEditButton' });
//   }
// });

// //đăng kí nút assgito
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'assigtoButton',
//     title: 'Assign to...',
//     contexts: ['selection']
//   });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'assigtoButton') {
//     chrome.tabs.sendMessage(tab.id, { type: 'showAssigtoButton' });
//   }
// });
