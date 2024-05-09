const backEndPath = 'https://internetapplications-devopstask.azurewebsites.net/';

export const loginPath = `${backEndPath}api/user/login`;
export const registerPath = `${backEndPath}api/user/register`;
export const projectTaskApi =  `${backEndPath}api/ProjectTask/project/`;
export const projectUpdateTaskStateApi = `${backEndPath}api/ProjectTask/`;
export const projectUpdateTaskApi= `${backEndPath}api/ProjectTask/`;
export const projectDeleteTaskApi = `${backEndPath}api/ProjectTask/`;
export const taskGetAttachmentName = `${backEndPath}api/ProjectTask/`;
export const taskUplaodAttachment= `${backEndPath}api/ProjectTask/`;
export const taskDwonloadattachment= `${backEndPath}api/ProjectTask/`;
export const projectApi = `${backEndPath}api/Project/`;
export const getTaskCommentApi = `${backEndPath}api/Comment/Task/`;
export const addTaskCommentApi = `${backEndPath}api/Comment/`;
export const addTaskApi = `${backEndPath}api/ProjectTask/`;
export const projectsPath = `${backEndPath}api/project`;
export const handleDeveloperPath = (projectID: number, developerUsername: string) => `${backEndPath}api/project/${projectID}/developer/${developerUsername}`;
export const acceptRequestPath = `${backEndPath}api/user/acceptRequest`;
export const rejectRequestPath = `${backEndPath}api/user/rejectRequest`;
