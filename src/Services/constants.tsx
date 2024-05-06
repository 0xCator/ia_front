const backEndPath = 'https://internetapplications-devopstask.azurewebsites.net/';

export const loginPath = `${backEndPath}api/user/login`;
export const registerPath = `${backEndPath}api/user/register`;
export const projectsPath = `${backEndPath}api/project`;
export const handleDeveloperPath = (projectID: number, developerUsername: string) => `${backEndPath}api/project/${projectID}/developer/${developerUsername}`;
export const acceptRequestPath = `${backEndPath}api/user/acceptRequest`;
export const rejectRequestPath = `${backEndPath}api/user/rejectRequest`;