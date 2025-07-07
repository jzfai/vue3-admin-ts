import { EasemobChat } from "easemob-websdk";

export interface ChannelParams {
  userId: string;
  channel: string;
}
export interface ChannelResp {
  accessToken: string;
  agoraUserId: string;
}
export function getRtcToken(
  imConn: EasemobChat.Connection,
  payload: ChannelParams
): Promise<ChannelResp> {
  const { userId, channel } = payload;
  const myHeaders = new Headers();
  myHeaders.append("authorization", `Bearer ${imConn.context.accessToken}`);
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return fetch(
    `${
      imConn.apiUrl
    }/token/rtcToken/v1?userAccount=${userId}&channelName=${channel}&appkey=${encodeURIComponent(
      imConn.appKey
    )}`,
    requestOptions
  ).then((response) => response.json());
}
export function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1);
}
